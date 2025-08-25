Start Server
node main.js

Curl for Testing
curl -X POST http://localhost:42069 \
  -H "X-Custom-Header: value1" \
  -H "X-Custom-Header: value2" \
  -H "Content-Type: application/json" \
  -d '{"message":"hello world"}'
