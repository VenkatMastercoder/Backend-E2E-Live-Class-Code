const { PrismaClient } = require("@prisma/client")
const express = require("express")
const app = express()
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');
var cors = require('cors')
app.use(express.json())
var jwt = require('jsonwebtoken');
var cookie = require('cookie');
app.use(cors())

app.post("/register", async (req, res) => {
    const userdata = req.body

    const existinguser = await prisma.user.findUnique({
        where: {
            email: userdata.email
        }
    })
    if (existinguser === null) {
        const hashedpassword = await bcrypt.hash(userdata.password, 10)
        const newregister = await prisma.user.create({
            data: {
                name: userdata.name,
                email: userdata.email,
                phonenumber: userdata.phonenumber,
                password: hashedpassword
            }
        })
        res.json({
            message: "data stored",
            data: newregister
        })
    } else {
        res.json({
            message: "already existed"
        })
    }
})


app.post("/login", async (req, res) => {
    const userdata = req.body

    const existinguser = await prisma.user.findUnique({
        where: {
            email: userdata.email
        }
    })

    if (existinguser === null) {
        res.json({
            message: "go reg first"
        })
    } else {

        const user = await bcrypt.compare(userdata.password, existinguser.password)
      
        if (user) {

            var accesstoken = jwt.sign({ user_id: existinguser.user_id }, 'jarom',{
                expiresIn:'30s'
            });
            var refreshtoken = jwt.sign({ user_id: existinguser.user_id }, 'jarom',{
                expiresIn:'60s'
            });

            await prisma.token.create({
                data:{
                    user_id:existinguser.user_id,
                    refreshtoken:refreshtoken
                }
            })

            res.cookie("reftoken",refreshtoken,{
                sameSite:"strict",
                httpOnly:true,
                secure:true,
                maxAge:60*1000,
                path:"/"
            })
            res.cookie("acctoken", accesstoken, {
                sameSite: "strict",
                httpOnly: true,
                secure: true,
                maxAge: 30*1000, // 60 seconds
                path: "/"
              });
              

              const {password,...userdata}=existinguser
            res.json({
                message: "loged in",
                data:userdata,
                token:{
                    accesstoken,
                    refreshtoken
                }
            })
        } else {
            res.json({
                message: "invalid user name and password"
            })
        }

    }

})


app.post('/refresh',async(req,res)=>{
    const userdata = req.body

    const tokenvalid = await prisma.token.findFirst({
        where:{
            refreshtoken:userdata.refreshtoken
        }
    })

    if(tokenvalid===null){
        res.json({
            message:"token not available"
        })
    }else{
        jwt.verify(tokenvalid.refreshtoken, 'jarom', function(err) {
           if(err===null){
            var accesstoken = jwt.sign({ user_id: tokenvalid.user_id }, 'jarom',{
                expiresIn:'60s'
            });


            res.cookie("acctoken",accesstoken,{
                sameSite:"strict",
                httpOnly:true,
                secure:true,
                maxAge:30*1000,
                path:"/"
            })

            res.json({
                message:"refresh token",
                accesstoken
            })
           }else{
            res.json({
                message:"token is invalid",
              
            })
           }
          });
    }
})


app.get('/home',(req,res)=>{
    res.json({
        message:"welcome"
    })
})

function auth(req,res,next){
  
    const authtoken = req.headers['authorization']
    const token = authtoken && authtoken.split(' ')[1]
    
    console.log(token)

    if(!token){
        res.send("go login token is not available")
    }else{

        jwt.verify(token, 'jarom', function(err) {
            if(err){
                res.send("error")  
            }else{
               next()
            }
          });
      

    }
}

app.get('/homee',auth,(req,res)=>{
    res.json({
        message:"welcome"
    })
})


app.listen(5000)