const express = require("express")

// To Create a Express Server
const server = express()

// http:/localhost:3000/app 
server.get("/app",(req,res)=>{
  res.send("Hello From Express")
})

server.get("/",(req,res)=>{
  res.send("Hello From Express")
})

server.listen(3000)