const express = require("express");
const app = express();
const hostname = process.env.IP || "127.0.0.1";
const port = process.env.PORT || 8090;

const http = require('http').Server(app);
const io = require("socket.io")(http);
app.use(express.static('.'));

io.on('connection', function(client) {
    console.log("Connection established");
    client.on("candidate", function(msg){
        console.log("candidate message recieved!");
        client.broadcast.emit("candidate", msg);
    });
    client.on("sdp", function(msg){
        console.log("sdp message broadcasted!");
        client.broadcast.emit("sdp", msg);
    });
    client.on("desc", function(desc){
        console.log("description received!");
        client.broadcast.emit("desc", desc);
    });
    client.on("answer", function(answer){
        console.log("answer broadcasted");
        client.broadcast.emit("answer", answer);
    });
});

http.listen(port, hostname);