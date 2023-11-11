const { rejects } = require("assert");
const net = require("net");
const { resolve } = require("path");
// const rl = require("readline");

const readline = require("readline/promises")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const clearLine = (dir) => {
    return new Promise((resolve, rejects) => {
        process.stdout.clearLine(dir, () => {
            resolve()
        })
    })
}

const moveCursor = (dx, dy) => {
    return new Promise((resolve, rejects) => {
        process.stdout.moveCursor(dx, dy, () => {
            resolve()
        })
    })
}

let id;

const socket = net.createConnection({ host: "127.0.0.1", port: 3008 },
    async () => {
        console.log("connected to server");

        const ask = async () => {
            const message = await rl.question("Enter a message ")
            // move the cursor one line up
            await moveCursor(0, -1);
            // clear the line current line the cursor is in
            await clearLine(0);
            socket.write(`${id}-message-${message}`)
        }
        ask()

        socket.on("data", async (data) => {

            // log an empty line
            console.log();
            // move cursor a line up
            await moveCursor(0, -1);
            // clear that line that the cursor just move into
            await clearLine(0)

            if (data.toString('utf-8').substring(0, 3) === "id-") {
                // when we are getting the id
                // everything from the third character up until the end
                id = data.toString('utf-8').substring(3)

                console.log(`Your id is ${id}!\n`);
            } else {
                console.log(data.toString("utf-8"));
            }
            ask();
        })
    })


socket.on("end", () => {
    console.log("Connection is ended");
})