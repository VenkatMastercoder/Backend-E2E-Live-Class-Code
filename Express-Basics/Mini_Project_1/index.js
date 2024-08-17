const express = require("express");

// Instance of HTTP Server
const app = express();

require("dotenv").config()

// http://localhost:3000/app
app.get("/app",(req,res)=>{
  // From Client 


  // DB Logic 


  // to Frontend
  res.json({message:"Get Method"})

});

app.post("/", (req, res) => {
  const data = req.body;

  console.log(data);

  res.json({ message: "Data Recived" });
});

app.put("/tools", (req, res) => {
  // DATA
  const data = req.body;

  //DB Logic

  

  //Send Res
  res.json({ message: "Put Data Updated" });
});

app.delete("/del", (req, res) => {
  // Data
  const dataId = req.body;

  // DB Logic

  // Send
  res.json({ message: "Data deleted Sucessfully - 1" });
});

app.delete("/del", (req, res) => {
  // Data
  const dataId = req.body;

  // DB Logic

  // Send
  res.json({ message: "Data deleted Sucessfully - 2" });
});

app.get("/params", (req, res) => {

  // DATA [ Optional ] , header , params [ Query ]
  const data = req.query

  // DB LOGIC
  console.log(data)

  // SEND
  res.json({ svgjhksgfs: "sdjhfjkredhg" });
});

app.get("/header", (req, res) => {

  // DATA [ Optional ] , header , params [ Query ]
  const data = req.headers

  // DB LOGIC
  console.log(data)

  // SEND
  res.json({ message: "header" });
});

app.listen(process.env.PORT);
