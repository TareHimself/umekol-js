const ps = require(`${process.cwd()}/passthrough.js`);
const { sync, bot, socket, socketEvents,modulesLastReloadTime } = require(`${process.cwd()}/passthrough.js`);

const fs = require('fs');

const { io } = require("socket.io-client");

// On connect to the server
function onConnect() {
    console.log('Connected to server');
    socket.emit('identify', {id : 'REL', guilds : Array.from(bot.guilds.cache.keys())});
    console.log('Sent identity to server');
}

// On disconnect from the server
function onDisconnect() {
    console.log('Disconnected from server');
}


// handle an event from the server to invalidate local date( make the data dirty so we pull a new version from the db)
function onInvalidate(payload) {
    
}

// handle an event from the server to invalidate local date( make the data dirty so we pull a new version from the db)
function onGetGuild(guildId) {
    socket.emit('guildData',bot.guilds.cache.get(guildId));
}

// array of possible events (done like this for heatsync reloading)
const newSocketEvents = [
    { id: 'connect', event: onConnect },
    { id: 'disconnect', event: onDisconnect },
    { id: 'invalidate', event: onInvalidate },
    { id: 'getGuild', event: onGetGuild }
]


if (socket === undefined) {
    const newSocket = io('https://rel-js-server.oyintareebelo.repl.co');
    console.log('Socket connection created');
    Object.assign(ps, { socket: newSocket });
}

if (socket) {
    if (socketEvents !== undefined) {
        
        socketEvents.forEach(function (socketEvent, index) {
            try {
                socket.removeListener(socketEvent.id, socketEvent.event);
            } catch (error) {
                console.log(error);
            }
        });

    }

    newSocketEvents.forEach(function (socketEvent, index) {
        try {
            socket.on(socketEvent.id, socketEvent.event);
        } catch (error) {
            console.log(error);
        }
    });

    Object.assign(ps, { socketEvents: newSocketEvents });
}

console.log('Socket Module Loaded');

if(modulesLastReloadTime.socket !== undefined)
{
    
}

modulesLastReloadTime.socket = bot.uptime;











