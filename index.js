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

// Route to handle HTTP GET requests to the root URL for testing purposes
app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

let isConnected = false

// Handle WebSocket connections
io.on('connection', (socket) => {
    isConnected = socket.connected

    // Handle 'message' event from client
    socket.on("message", (arg, callback) => {
        socket.broadcast.emit('message', arg)
        socket.emit('message', arg)
    })

    // Handle 'query' event from client
    socket.on("query", (arg, callback) => {
        if(arg === 'undefined'|| arg === null|| arg === ''){
            // Send the result back to the client along with the error message if the query is empty
            socket.emit('result', response('400', 'Query is empty', null))
            return
        }
        let res = {}
        // Execute the SQL query received from the client
        con.query(`${arg}`, function (err, result, fields) {
            if (err) {
                // Send the result back to the client along with the error message
                socket.emit('result', response('err', err.sqlMessage, null))
            } else {
                if (result.length > 0) {
                    // Send the result back to the client along with the success message and the data
                    socket.emit('result', response('200', 'Records found', result))
                } else {
                    // Send the result back to the client along with the error message if no data is found
                    socket.emit('result', response('404', 'No data found', null))
                }
            }
        });
    })

    // Handle WebSocket disconnection
    socket.on('disconnect', (socket) => {
        console.log('Disconnect');
    });
})

// Start the server and listen on the specified port
const port = 3000;
server.listen(port, () => {
    console.log(`Server is running ${port}`);
});