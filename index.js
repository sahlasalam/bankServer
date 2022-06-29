//import express
const express = require('express');
//import dataService
const dataService = require('./services/data.services')
//import jsonwebtoken
const jwt= require('jsonwebtoken');
//import cors
const cors=require('cors')



//server app creat using express
const app = express();

//cors use in server app
app.use(cors({
    origin:' http://localhost:4200'
}))

//parse JSON data
app.use(express.json());

//application specific middleware
const appMiddleware= (req, res, next)=>{
    console.log("Application specific middleware")
    next()
}
//use middleware in app
app.use(appMiddleware);

//bank server
const jwtMiddleware =(req,res,next)=>{
    //fetch token
    try{
        token=req.headers['token-access'];
        //verify token
        const data= jwt.verify(token,'supersecretkey1234');
        console.log(data);
        next()
    }
    catch{
        res.status(401).json({
            status: false,
            statusCode:401,
            message:'please login'
        })
    }
}

//register API
app.post('/register',(req,res)=>{
    //register solving-asynchronous
     dataService.register(req.body.username, req.body.acno, req.body.password)
     .then(result=>{
        res.status(result.statusCode).json(result)
     })
    
})

//login API
app.post('/login',(req,res)=>{
    //login solving
    dataService.login( req.body.acno, req.body.psw)
    .then(result=>{
        res.status(result.statusCode).json(result)

    })
})

//deposit API
app.post('/deposit',jwtMiddleware,(req,res)=>{
    //deposit solving
     dataService.deposit(req.body.acno, req.body.password,req.body.amnt)
     .then(result=>{
        res.status(result.statusCode).json(result)

     })
})

//withdraw API
app.post('/withdraw',jwtMiddleware,(req,res)=>{
    //deposit solving
     dataService.withdraw(req.body.acno, req.body.password,req.body.amnt)
     .then(result=>{
        res.status(result.statusCode).json(result)
     })
})

//transaction API
app.post('/transaction',jwtMiddleware,(req,res)=>{
    //transaction solving
     dataService.getTransaction(req.body.acno)
     .then(result=>{
        res.status(result.statusCode).json(result)

     })
})


//user requet resolving
//POST Request- to creat data
app.post('/',(req,res)=>{
    res.send("POST Request")
})

//GET request- to fetch data
app.get('/',(req,res)=>{
    res.send("GET Request")
})

//PUT Request-to modify entire data
app.put('/',(req,res)=>{
    res.send("PUT Request")
})
//PATCH Request- to modify partially
app.patch('/',(req,res)=>{
    res.send("PATCH Request")
})
//delete Request- to delete data
app.delete('/',(req,res)=>{
    res.send("DELETE Request")
})


//setup port number to the server app
app.listen(3000,()=>{
    console.log("server started at 3000");
})