import { createServer } from "./server";

const port = process.env.PORT || 3002;
const server = createServer();

server.listen(port, () => {
    console.log("Listening on port " + port)
});
