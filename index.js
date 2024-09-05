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
const path = require( "path" );
const { table } = require('console');
const con = mysql.createConnection({
    host: "localhost",
    user: "creator",
    password: "CreatorTangguh",
    database: "db_dashboard"
});

app.use( express.static( 'public' ));
// Route to handle HTTP GET requests to the root URL for testing purposes
app.get('/', (req, res) => {
    res.sendFile( path.join( __dirname + "/public/index.html" ));
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
    socket.on("query", (data, callback) => {
   
        const terms = data.terms
        const arg = data.sql
        const emitName = `result`
        let resData = {
            done: false,
            items: [],
            tableName: data.tableName
        }

        if(arg === 'undefined'|| arg === null|| arg === ''){
            // Send the result back to the client along with the error message if the query is empty
            socket.emit(emitName, response('400', 'Query is empty', null))
            return
        }
        
        // Execute the SQL query received from the client
        con.query({
            sql: arg,
            values: terms
        },  function (err, result, fields) {
            
            if (err) {
                // Send the result back to the client along with the error message
                socket.emit(emitName, response('err', err.sqlMessage, resData))
            } else {
                if (result.length > 0) {
                    // Send the result back to the client along with the success message and the data
                    socket.emit(emitName, response('200', 'Records found', {
                        ...resData,
                        items: result,
                    }))
                    socket.emit('next')
                } else {
                    // Send the result back to the client along with the error message if no data is found
                    socket.emit(emitName, response('404', 'No data found', resData))
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