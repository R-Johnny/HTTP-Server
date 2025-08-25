export function parseRequest(request) {
  switch (request.state) {
    case "init":
      while (request.state == "init") {
        request.requestLine = parseRequestLine(request);
      }
    case "headers":
      while (request.state == "headers") {
        request.headers = parseHeaders(request);
      }
    case "body":
      while (request.state == "body") {
        request.body = parseBody(request);
      }
    case "done":
      return request;
  }
}

export function parseRequestLine(request) {
  if (!request.data.includes("\r\n")) {
    return false;
  }

  const lines = request.data.split("\r\n");
  const headerString = lines[0];
  let [method, requestTarget, HTTPVersion] = headerString.split(" ");
  const requestLine = { method, requestTarget, HTTPVersion };
  validateHTTPVersion(HTTPVersion);
  request.state = "headers";
  return requestLine;
}

export function parseHeaders(request) {
  if (!request.data.includes("\r\n\r\n")) {
    return false;
  }

  const lines = request.data.split("\r\n");
  const headerLines = lines.slice(1, -2);
  let headers = new Map();
  for (const header of headerLines) {
    let split = header.split(":");
    const fieldName = split[0].toLowerCase();
    const fieldValue = split.slice(1).join(":").trim();
    if (headers.has(fieldName)) {
      headers.set(fieldName, headers.get(fieldName) + `,${fieldValue}`);
    } else {
      headers.set(fieldName, fieldValue);
    }
  }
  request.state = "body";
  return headers;
}

export function parseBody(request) {
  const headers = request.headers;

  if (!headers.has("content-length")) {
    request.state = "done";
    return null;
  }

  const lines = request.data.split("\r\n\r\n");
  let body = lines[1];
  const contentLength = headers.get("content-length");
  if (contentLength != body.length) {
    return;
  }
  const contentType = headers.get("content-type");
  if (contentType == "application/json") {
    body = JSON.parse(body);
  }
  request.state = "done";
  return body;
}

function validateHTTPVersion(HTTPVersion) {
  if (HTTPVersion != "HTTP/1.1") {
    return Error;
  }
  return true;
}
