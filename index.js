const express = require('express');
const app = express();
const http = require('http');
const {Server} = require('socket.io');
const {createServer} = require("http");
const server = http.createServer(app);
const httpServer = createServer(app);
const {response} = require('./functions');
const io = require('socket.io')(server, {
    cors: {origin: '*'}
});
const mysql = require('mysql');
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tep_dashboard"
});

app.get('/', (req, res) => {
    con.connect(function (err) {
        if (err) throw err;
        con.query("SELECT * FROM users", function (err, result, fields) {
            if (err) {
                res.send(response('err', err.sqlMessage, null))
            } else {
                if (result.length > 0) {
                    res.send(response('200', 'Records found', result))
                } else {
                    res.send(response('404', 'No data found', null))
                }
            }

        });
    });
    // res.send('<h1>Hello world</h1>');
});
let isConnected = false
io.on('connection', (socket) => {
    isConnected = socket.connected

    socket.on("message", (arg, callback) => {
        socket.broadcast.emit('message', arg)
        socket.emit('message', arg)
    })
    socket.on("query", (arg, callback) => {
        if(arg === 'undefined'|| arg === null|| arg === ''){
            socket.emit('result', response('400', 'Query is empty', null))
            return response('400', 'Query is empty', null)
        }
        let res = {}
        con.query(`${arg}`, function (err, result, fields) {
            if (err) {
               res = response('err', err.sqlMessage, null)
                socket.emit('result', res)
            } else {
                if (result.length > 0) {
                   res = response('200', 'Records found', result)
                    socket.emit('result', res)
                } else {
                    res = response('404', 'No data found', null)
                    socket.emit('result', res)
                }
            }

        });

    })

    socket.on('disconnect', (socket) => {
        console.log('Disconnect');
    });
})

const port = 3000;
server.listen(port, () => {
    console.log(`Server is running ${port}`);
});