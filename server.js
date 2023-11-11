const net = require('net')
const server = net.createServer()

const Clients = [];

server.on('connection', (socket) => {
    console.log("a new connected to server");

    const clientId = Clients.length + 1

    // Brodcasting a message to everyone when someone joined the chat room
    Clients.map((client) => {
        client.socket.write(`User ${clientId} joined`)
    })

    socket.write(`id-${clientId}`)


    socket.on("data", (data) => {

        const dataStirng = data.toString('utf-8')
        const id = dataStirng.substring(0, dataStirng.indexOf("-"))
        const message = dataStirng.substring(dataStirng.indexOf("-message-") + 9)

        Clients.map((Client) => {
            Client.socket.write(`>User ${id}: ${message}`)
        })
    })

    // Brodcasting a message to everyone when someone leaves the chat room
    socket.on("end", () => {
        Clients.map((client) => {
            client.socket.write(`User ${clientId} left`)
        })

    })

    Clients.push({ id: clientId.toString(), socket })
})

server.listen(3008, "127.0.0.1", () => {
    console.log("open server on", server.address())
})