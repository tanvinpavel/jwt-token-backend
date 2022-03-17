const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const PORT = 4500;
const {tokenValidator} = require('./middleware/jwtAuth');
//store token in cookie (name session work as cookie)
const cookieParser = require('cookie-parser');


const middleware = [
    cors(),
    express.json(),
    cookieParser('12345')
]
app.use(middleware);

app.get('/', (req, res) => {
    console.log('wow this get method is work fine');
    res.send('this is home');

})

app.get('/home', tokenValidator, (req, res) => {
    res.send('this is home');
})

// user jodi varifyed hoi tahole ei method a aste parbe
app.post('/api/posts', (req, res) => {

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



// login
// frontend sample
app.post('/api/login', (req, res) => {
    const inputvalue = req.body.inputValue;
    const passvalue = req.body.passValue;

    if(inputvalue === 'pavel@gmail.com' && passvalue === '12345'){
        //create jwt 
        // jwt.sign({
        //     inputvalue, passvalue
        // }, "privateKey", function (err, token) {
        //     if(err){
        //         res.status(504).json('authentication error');
        //     }else{
        //         req.session.isLoggedIn = true;
        //         // res.setHeader('Set-Cookie', 'isLoggedIn=true');
        //         res.send('login success');
        //     }
        // });
        res.cookie('username', 'john doe', { maxAge: 900000, httpOnly: true, signed: true, secret: '12345' });
        res.send('hello');
    }else{
        res.status(504).json('authentication error');
    }
})


app.listen(PORT, () => {
    console.log('server is runnnig ', PORT);
})
