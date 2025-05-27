const { PrismaClient } = require("@prisma/client");
const express = require("express");

const app = express()

app.use(express.json());

const prisma = new PrismaClient()

app.get("/", async (req,res)=>{
  // DATA FROM FRONTEND [ Op ]


  // DB LOGIC
  const productData = await prisma.product.findMany({
    where : {
      is_deleted:false
    }
  })

  // DATA TO FRONTEND 
  res.send(productData)
})

app.delete("/",async (req,res)=>{
  // data from frontend
  const data = req.body

  // db logic
  await prisma.product.update({
    where: {
      product_id: data.product_id
    },
    data:{
      is_deleted:true,
      deletedAt: Date.now().toString()
    }
  })

  res.send("product delete")

})

app.listen(3000)