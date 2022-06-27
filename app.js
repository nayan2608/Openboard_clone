const express=require("express");  // access
const socket=require("socket.io");

const app=express();  // initialized and server ready

app.use(express.static("public"));

let port=process.env.PORT || 5000;
let server=app.listen(port,()=>{
    console.log("listen port 5000");
})

let io=socket(server);

io.on("connection",(socket)=>{
    console.log("made socket connection");

    // received
    socket.on("beginpath", (data) => {
        // now transfer to all connected computer
        io.sockets.emit("beginpath", data);
    })

    socket.on("drawstroke", (data) => {
        io.sockets.emit("drawstroke", data);
    })

    socket.on("undoredo", (data) => {
        io.sockets.emit("undoredo", data);
    })
})