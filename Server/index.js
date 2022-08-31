const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cors = require("cors")
const { Server } = require("socket.io");
// const { Socket } = require('dgram');
app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

//is some one connected
io.on("connection", (socket) => {
    console.log("user connected", socket.id);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`user join: ${socket.id} || room id: ${data}`)
    })

    socket.on('send_message', (data) => {
        socket.to(data.room).emit("recive_message", data)
        console.log('recive message', data.room)
    })

    socket.on('disconnect', () => {
        console.log("user disconnected", socket.id)
    })
});

server.listen(3001, () => {
    console.log("server runnig....")
})

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });

// io.on('connection', (socket) => {
//     console.log('a user connected');
//     socket.on('disconnect', () => {
//         console.log('user disconnected');
//     });
// });

// server.listen(3000, () => {
//     console.log('listening on http://localhost:3000');
// });