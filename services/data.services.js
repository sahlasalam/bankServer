//import jsonwebtoken
const jwt = require('jsonwebtoken');
//import db model
const db = require('./db')

//database
// db ={
//     1000:{"acno":1000, "username":"Array", "password":1000, "balance":5000, transaction:[]},
//     1001:{"acno":1001, "username":"Anagha", "password":1001, "balance":3000, transaction:[]},
//     1002:{"acno":1002, "username":"Ammu", "password":1002, "balance":5000, transaction:[]},

//   }

//register
const register = (username, acno, password) => {
    //asynchronous
    return db.User.findOne({
        acno
    }).then(user => {
        console.log(user);
        if (user) {
            return {
                status: false,
                message: "Already registered..please login",
                statusCode: 401
            }
        }
        else {
            //insert in db
            const newUser = new db.User({
                acno,
                username,
                password,
                balance: 0,
                transaction: []

            })
            newUser.save()
            return {
                status: true,
                message: "Register successfully",
                statusCode: 200
            }

        }
    })
}

    //login- asynchronous
    const login = (acno, psw) => {
        return db.User.findOne({
            acno,
            password:psw
        }).then(user=>{
            if(user){
                currentUser = user. username
                currentAcno = acno;
                //token generation
                token = jwt.sign({
                    //store account number inside token
                    currentAcno: acno
                }, 'supersecretkey1234')
                return {
                    status: true,
                    message: "Login successfully",
                    statusCode: 200,
                    currentUser,
                    currentAcno,
                    token

                }

            }
            else{
                return {
                    status: false,
                    message: "Invalid account number or password",
                    statusCode: 401
                }
    
            }
        })


    }

    //deposit- asynchronous
    const deposit = (acno, password, amnt) => {
        var amount = parseInt(amnt);
        return db.User.findOne({
            acno,password
        }).then(user=>{
            if(user){
                user.balance += amount;
                user.transaction.push({
                    type: "Credit",
                    amount: amount
                })
                user.save()
                return {
                    status: true,
                    message: amount + "deposited successfully..new balance is" + user.balance,
                    statusCode: 200
                }

            }
            else{
                return {
                    status: false,
                    message: "Invalid account number or password",
                    statusCode: 401
                }
     
            }
        })

    }

    //withdraw - asynchronous
    const withdraw = (acno, password, amnt) => {
        var amount = parseInt(amnt);
        return db.User.findOne({
            acno,password
        }).then(user=>{
            if(user){
                if(user.balance>amount){
                    user.balance -= amount;
                    user.transaction.push({
                        type: "Debit",
                        amount: amount
                    });
                    user.save()
                    return {
                        status: true,
                        message: amount + "debited successfully..new balance is" + user.balance,
                        statusCode: 200
                    }


                }else{
                    return {
                        status: false,
                        message: "Insufficient balance",
                        statusCode: 401
                    }
    
                }

            }else{
                return {
                    status: false,
                    message: "Invalid account number or password",
                    statusCode: 401
                }

            }
        })
    }

    //transaction
    const getTransaction = (acno) => {
        return db.User.findOne({
            acno
        }).then(user=>{
            if(user){
                return {
                    status: true,
                    statusCode: 200,
                    transaction: user.transaction
                }
    
            }
            else{
                return {
                    status: false,
                    message: "User does not exist",
                    statusCode: 401
                }
  
            }
        })


        if (acno in db) {
        }
        else {
            return {
                status: false,
                message: "User does not exist",
                statusCode: 401
            }
        }
    }




    //export
    module.exports = {
        register,
        login,
        deposit,
        withdraw,
        getTransaction
    }