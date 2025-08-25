import net from "net";
import { parseRequest } from "./handleRequest.js";
import { handleResponse } from "./handleResponse.js";

const PORT = 42069;

const server = net.createServer((conn) => {
  console.log("new connection");
  let request = { data: "", state: "null" };

  conn.on("data", (data) => {
    request.data += data.toString("utf8");
    if (request.state == "null") {
      request.state = "init";
      const requestParsed = parseRequest(request);
      const response = handleResponse(requestParsed);
      conn.write(response);
    }
  });

  conn.on("end", () => {
    console.log("connection closed");
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`listening on port ${PORT}`);
});
