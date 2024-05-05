// Https

const http = require("http");

// Instance Http server
const server = http.createServer((req, res) => {
  console.log(req)


  // Req 

  // Database Res


  res.writeHead(400)
  res.end("Hello World")
  console.log("Hello World");
});

server.listen(3000)