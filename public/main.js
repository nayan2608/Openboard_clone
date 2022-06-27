
let optioncontainer=document.querySelector(".options-container");
let optionflag=true;
let toolcontainer=document.querySelector(".tools-container");
let penciltoolcontainer=document.querySelector(".pencil-tool-container");
let pencil=document.querySelector(".pencil");
let pencilflag=false;
let erasertoolcontainer=document.querySelector(".eraser-tool-container");
let eraser=document.querySelector(".eraser");
let eraserflag=false;
let sticky=document.querySelector(".notepad");
let upload=document.querySelector(".upload");

optioncontainer.addEventListener("click",(e)=>{
    // true show tool,false hide
    optionflag=!optionflag;
    if(optionflag) opentools();
    else closetools();
})

function opentools(){
    let iconelem=optioncontainer.children[0];
    iconelem.classList.remove("bi-x-lg");
    iconelem.classList.add("bi-list");
    toolcontainer.style.display="flex"; 
}

function closetools(){
    let iconelem=optioncontainer.children[0];
    iconelem.classList.remove("bi-list");
    iconelem.classList.add("bi-x-lg");
    toolcontainer.style.display="none";
    
    penciltoolcontainer.style.display="none";
    erasertoolcontainer.style.display="none";
}

pencil.addEventListener("click",(e)=>{
    // true show pencil,false hide
    pencilflag=!pencilflag;
    
    if(pencilflag) penciltoolcontainer.style.display="block";
    else penciltoolcontainer.style.display="none";
})

eraser.addEventListener("click",(e)=>{
    // true show eraser,false hide
    eraserflag=!eraserflag;
    
    if(eraserflag) erasertoolcontainer.style.display="flex";
    else erasertoolcontainer.style.display="none";
})

upload.addEventListener("click",(e)=>{
    let input=document.createElement("input");
    input.setAttribute("type","file");
    input.click();

    input.addEventListener("change",(e)=>{
        let file=input.files[0];
        let url=URL.createObjectURL(file);

        stickytemplatehtml= `
        <div class="header-container">
        <div class="minimize"></div>
        <div class="remove"></div>
        </div>
        <div class="note-container">
            <img src="${url}">
        </div>
    `;
     creatsticky(stickytemplatehtml);
    })
})

sticky.addEventListener("click",(e)=>{
    
    stickytemplatehtml= `
        <div class="header-container">
        <div class="minimize"></div>
        <div class="remove"></div>
        </div>
        <div class="note-container">
            <textarea spellcheck="false"></textarea>
        </div>
    `;
     creatsticky(stickytemplatehtml);
})

function creatsticky(stickytemplatehtml){
    let stickycontainer=document.createElement("div");
    stickycontainer.setAttribute("class","sticky-container");
    stickycontainer.innerHTML=stickytemplatehtml;

    document.body.appendChild(stickycontainer); 

    let minimize=stickycontainer.querySelector(".minimize");
    let remove=stickycontainer.querySelector(".remove");
    noteaction(minimize,remove,stickycontainer);

    stickycontainer.onmousedown = function(event) {
        draganddrop(stickycontainer,event);
    }

    stickycontainer.ondragstart = function() {
        return false;
    };
}

function noteaction(minimize,remove,stickycontainer){
    
    remove.addEventListener("click",(e)=>{
        stickycontainer.remove();
    })
    
    minimize.addEventListener("click",(e)=>{
        let notecontainer=stickycontainer.querySelector(".note-container");
        let display=getComputedStyle(notecontainer).getPropertyValue("display");
        if(display==="none") notecontainer.style.display="block";
        else notecontainer.style.display="none";
    })
}

function draganddrop(element,event){

    let shiftX=event.clientX-element.getBoundingClientRect().left;
    let shiftY=event.clientY-element.getBoundingClientRect().top;
      
    element.style.position='absolute';
    element.style.zIndex=1000;
      
    moveAt(event.pageX,event.pageY);
      
    // moves the ball at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX,pageY) {
        element.style.left=pageX-shiftX+'px';
        element.style.top=pageY-shiftY+'px';
    }
      
    function onMouseMove(event) {
        moveAt(event.pageX,event.pageY);
    }
      
    // move the ball on mousemove
    document.addEventListener('mousemove',onMouseMove);
      
    // drop the ball, remove unneeded handlers
    element.onmouseup=function() {
        document.removeEventListener('mousemove',onMouseMove);
        element.onmouseup=null;
    };
}
