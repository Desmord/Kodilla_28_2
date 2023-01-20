const express = require('express');
const path = require(`path`)
const PORT = 8000;
const app = express();
const socket = require('socket.io');


app.use(express.static(path.join(__dirname, '/client')));

let messages = [];
let users = [];

app.get('/', (req, res) => {
    res.show('index.html');
});


const server = app.listen(process.env.PORT || PORT, () => {
    console.log('Server is running on Port:', 8000)
});
const io = socket(server);

const getUserByID = (id) => {
    return users.filter(user => user.id === id ? true : false)[0]
}

io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);
    socket.on('message', () => { console.log('Oh, I\'ve got something from ' + socket.id) });

    socket.on('disconnect', () => {
        socket.broadcast.emit(`message`, { author: `Chat bot`, content: ` ${getUserByID(socket.id).author} has left the conversation... :(` })
        users = users.filter(user => user.id === socket.id ? false : true)
        console.log('Oh, socket ' + socket.id + ' has left')
    });
    console.log('I\'ve added a listener on message and disconnect events \n');

    socket.on('message', (message) => {
        console.log('Oh, I\'ve got something from ' + socket.id);
        messages.push(message);
        socket.broadcast.emit('message', message);
    });

    socket.on('join', ({ author }) => {
        users.push({ author: author, id: socket.id })
        socket.broadcast.emit(`message`, { author: `Chat bot`, content: `${author} has joined the conversation!` })
    })
});