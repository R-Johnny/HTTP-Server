import fs from "fs";

export function handleResponse(request) {
  const HTTPVERSION = "1.1";
  const statusCode = "200 OK";
  const contentType = "text/html";
  const body = fs.readFileSync("./test.html", "utf8");

  const reponse =
    `HTTP/${HTTPVERSION} ${statusCode}\r\n` +
    `Content-Type: ${contentType}\r\n` +
    `Content-Length: ${Buffer.byteLength(body)}\r\n` +
    `Connection: close\r\n` +
    "\r\n" +
    body;

  return reponse;
}
