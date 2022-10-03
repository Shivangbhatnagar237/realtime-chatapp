const io = require("socket.io")();
const socketapi = {
    io: io
};

let namearr = [];
let ids = [];

// Add your socket.io logic here!
io.on("connection", function (socket) {
    io.emit('onlineUsers', namearr)

    socket.on('disconnect', () => {
        let index = ids.indexOf(socket.id);
        namearr.splice(index, 1);
        ids.splice(index, 1);
        // console.log(namearr , ids);
        io.emit('onlineUsers', namearr);
    })

    socket.on('newUser', (username) => {
        namearr.push(username);
        ids.push(socket.id);
        io.emit('onlineUsers', namearr);
        // console.log(namearr, ids);
    })

    socket.on('newMessage', (data, currentUser) => {
        let index = ids.indexOf(socket.id);
        let user = namearr[index];
        io.emit('newMessage', { data, user });
    });

    socket.on('typing', () => {
        let index = ids.indexOf(socket.id);
        let user = namearr[index];
        socket.broadcast.emit('typing', { user });
    });
});
// end of socket.io logic

module.exports = socketapi;