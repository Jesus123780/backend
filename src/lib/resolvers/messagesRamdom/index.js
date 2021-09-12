'use strict'
const messages = [];

//Query para los mensajes
const messagesQuery = {
    messages: () => messages,
}

//Mutation para los mensajes
const subscribers = [];
// eslint-disable-next-line
const PostMessagesMutation = {
    postMessage: (parent, { user, content, hour }) => {
        const id = messages.length;
        messages.push({
            id,
            user,
            content,
            hour
        });
        subscribers.forEach(fn => fn());
        return id;
    },
}
module.exports = {
    messagesQuery,
    PostMessagesMutation,
}