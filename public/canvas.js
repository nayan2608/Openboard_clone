
let canvas=document.querySelector("canvas");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
let pencilcolor=document.querySelectorAll(".pencil-color");
let pencilwidthelement=document.querySelector(".pencil-width");
let eraserwidthelement=document.querySelector(".eraser-width");
let download=document.querySelector(".download");
let redo=document.querySelector(".redo");
let undo=document.querySelector(".undo");
let mousedown=false;

let tool=canvas.getContext("2d");

let pencolor="red";
let erasercolor="white";
let penwidth=pencilwidthelement.value;
let erasewidth=eraserwidthelement.value;

tool.strokeStyle=pencolor;
tool.lineWidth=penwidth;

let undoredotracker=[];
let track=0;

canvas.addEventListener("mousedown",(e)=>{
    mousedown=true;

    let data = {
        x: e.clientX,
        y: e.clientY
    }
    // send data to server
    //beginpath(data);
    socket.emit("beginpath",data);
})

canvas.addEventListener("mousemove",(e)=>{
    if(mousedown){
        
        let data = {
            x: e.clientX,
            y: e.clientY,
            color: eraserflag ? erasercolor : pencolor,
            width: eraserflag ? erasewidth : penwidth
        }
        socket.emit("drawstroke",data);
       // drawstroke(data);
    }
})

canvas.addEventListener("mouseup",(e)=>{
    mousedown=false;

    let url=canvas.toDataURL();
    undoredotracker.push(url);
    track=undoredotracker.length-1;
})

function beginpath(strokeobject){
    tool.beginPath();
    tool.moveTo(strokeobject.x,strokeobject.y);
}

function drawstroke(strokeobject){
    tool.strokeStyle=strokeobject.color;
    tool.lineWidth=strokeobject.width;
    tool.lineTo(strokeobject.x,strokeobject.y);
    tool.stroke();
}

redo.addEventListener("click",(e)=>{
    if(track < undoredotracker.length-1){track++;}

    let trackobj = {  
        trackvalue: track,
        undoredotracker
    }

    socket.emit("undoredo",trackobj);
    // undoredocanvas(data);
})

undo.addEventListener("click",(e)=>{

    if(track > 0){
        track--;
    }

    let trackobj = {
        trackvalue: track,
        undoredotracker
    }
    
    socket.emit("undoredo",trackobj);
    // undoredocanvas(data);
})

function undoredocanvas(trackobj){

    track=trackobj.trackvalue;
    undoredotracker=trackobj.undoredotracker;
    
    let url=undoredotracker[track];
    let img=new Image();
    img.src=url;
       
    img.onload = (e) => {
        tool.clearRect(0,0,canvas.width,canvas.height);
        tool.drawImage(img,0,0,canvas.width,canvas.height);
    }
}

pencilcolor.forEach((colorelement) => {
    colorelement.addEventListener("click",(e)=>{
        let color=colorelement.classList[0];
        pencolor=color;
        tool.strokeStyle=pencolor;
    })
})

pencilwidthelement.addEventListener("change",(e)=>{
    penwidth=pencilwidthelement.value;
    tool.lineWidth=penwidth;
})

eraserwidthelement.addEventListener("change",(e)=>{
    erasewidth=eraserwidthelement.value;
    tool.lineWidth=erasewidth;
})

eraser.addEventListener("click",(e)=>{
    if(eraserflag){
        tool.strokeStyle=erasercolor;
        tool.lineWidth=erasewidth;
    }
    else{
       tool.strokeStyle=pencolor;
       tool.lineWidth=penwidth;
    }
})

download.addEventListener("click",(e)=>{

    let url=canvas.toDataURL();
    let a=document.createElement("a");
    a.href=url;
    a.download="board.jpg";
    a.click();
})

socket.on("beginpath", (data) => {
    beginpath(data);
})

socket.on("drawstroke", (data) => {
    drawstroke(data);
})

socket.on("undoredo", (data) => {
    undoredocanvas(data);
})

