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
        origin: "*",
        methods: ["GET", "POST"],
    }
});

/**
 * sql connection
 */
var mysql = require('mysql');
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hello_super_star_backend'
});

con.connect(function (err) {
    if (err)
        throw err;
    console.log("MySql Database Connected");
});






//is some one connected
io.on("connection", (socket) => {
    console.log("user connected", socket.id);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`user join: ${socket.id} || room id: ${data}`)
    })

    /**
     * send fan group 
     */
    socket.on('send_message', (data) => {
        socket.to(data.room_id).emit("recive_message", data)
        console.log('recive message', data)


        con.query(
            `INSERT INTO fan_group_messages (sender_id, sender_name, sender_image,group_id,position,text,room_id,time,status )
            VALUES (${data.sender_id
            + ',' + '"' + data.sender_name + '"'
            + ',' + '"' + data.sender_image + '"'
            + ',' + data.group_id + ','
            + 2
            + ',' + "'" + data.text + "'"
            + ',' + '"' + data.room_id + '"'
            + ',' + '"' + data.time + '"'
            + ',' + data.status})`,
            function (err, res) {

                if (res.affectedRows > 0) {
                    console.log("fan group sms save to database ❤️")
                }

            });
    })


    /**
     * qna message
     */
    socket.on('qna_send_message', (data) => {
        socket.to(data.room_id).emit("qna_recive_message", data)
        console.log('qna message', data)
        con.query(
            `INSERT INTO qna_messages (sender_id,qna_id,sender_name,room_id,msg_type,sender_image,media,text,time)
            VALUES (${data.sender_id
            + ',' + data.qna_id
            + ',' + '"' + data.sender_name + '"'
            + ',' + '"' + data.room_id + '"'
            + ',' + '"' + data.msg_type + '"'
            + ',' + '"' + data.sender_image + '"'
            + ',' + '"' + data.media + '"'
            + ',' + '"' + data.text + '"'
            + ',' + '"' + data.time + '"'

            })`,
            function (err, res) {

                if (res.affectedRows > 0) {
                    console.log("qna message save to database ❤️")
                }

            });


    })



    /**
     * typing session
     */
    socket.on('typing_event_send', (data) => {
        socket.broadcast.to(data.room_id).emit("typing_event_recive", data)
        console.log('typing', data)
    })

    socket.on('disconnect', () => {
        console.log("user disconnected", socket.id)
    })
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


server.listen(3001, () => {
    console.log('listening on http://localhost:3001');
});