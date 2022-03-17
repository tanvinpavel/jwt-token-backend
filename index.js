const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const PORT = 4500;

app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
    console.log('wow this get method is work fine');

})

// user jodi varifyed hoi tahole ei method a aste parbe
app.post('/api/posts', varifyToken, (req, res) => {

    // AUthoraization
    // varify token sematricc from npm
    // req token  = function a banao token ta
    jwt.verify(req.token, 'privateKey', function (err, decoded) {

        if (err) {
            res.sendStatus(403)
        } else {
            res.json({message: 'post done', decoded})
        }

    });


    res.send('post it');

})


// token orginally like this
// Bearer
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6Impha
// 2lyIHVkZGluIiwiZW1haWwiOiJldmFuamFoaWQzMjFAZ21haWwuY
// 29tIn0sImlhdCI6MTY0NzM3Nzg2MH0.QlgveXdJqZ6IlZO4u0K4bBIjYGHk_-t9s6_T3atGYEU

function varifyToken(req, res, next) {
    const bearerHeader = req.headers.auth

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' '); // token fully array ke 2vag kore just token ta nibo
        const bearertoken = bearer[1];
        req.token = bearertoken;


        next();
    } else {
        res.sendStatus(403)
    }

}


// login
// frontend sample
app.post('/api/login', (req, res) => {
    // console.log('this is a post method');


    // sample user like frontend

    // const user = {
    //     id: 1,
    //     username: 'jakir uddin',
    //     email: 'evanjahid321@gmail.com'

    // }
   
    const inputvalue = req.body.inputValue
    const passvalue = req.body.passValue
    console.log(inputvalue, passvalue);


    // npm json website theka async newa

    jwt.sign({
        inputvalue, passvalue
    }, "privateKey", function (err, token) {
        res.send(token);
        console.log(token);
    });


})


app.listen(PORT, () => {
    console.log('server is runnnig ', PORT);
})
