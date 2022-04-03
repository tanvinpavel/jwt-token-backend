const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const PORT = 4500;
const {tokenValidator} = require('./middleware/jwtAuth');
//store token in cookie (name session work as cookie)
const cookieParser = require('cookie-parser');

const users = [
    {
        id: '1',
        username: 'pavel',
        password: '12345',
        isAdmin: true
    },
    {
        id: '2',    
        username: 'tanvir',
        password: '12345',
        isAdmin: false
    }
];

let refreshTokens = [];

const whiteList = ['http://127.0.0.1:4500', 'http://localhost:3000'];

const corsOption = {
    origin: (origin, callback) => {
        if(whiteList.indexOf(origin) !== -1 || !origin){
            callback(null, true);
        }else{
            callback(new Error(`Not allowed by CORS, ${origin}`));
        }
    },
    credentials: true,
    optionSuccessStatus: 200
}

const middleware = [
    cors(corsOption),
    express.json(),
    cookieParser(),
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

})

app.get('/api/refresh', (req, res) => {
    const cookies = req.cookies;
    // console.log(cookies);
    if(!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;

    if(!refreshTokens.includes(refreshToken)) return res.send('token not found in server');
    jwt.verify(refreshToken, 'jwtsecret', (err, data) => {
        if(err){
            res.sendStatus(403);
        }else{
            try {
                const newAccessToken = jwt.sign({id: data.id, isAdmin: data.isAdmin}, 'jwtSecret', { expiresIn: '15s' });
                res.json({
                    token: newAccessToken
                });
            }
            catch (error) {
                res.status(500).json('internal server error');
            }
        }
    })
});

// login
// frontend sample
app.post('/api/login', async (req, res) => {
    const {username, password} =  req.body;
    // console.log(req.body);
    const auth = users.find(u => {
        return u.username === username && u.password === password;
    });

    if(auth){
        try {
            const token = jwt.sign({ id: auth.id, isAdmin: auth.isAdmin }, 'jwtSecret', { expiresIn: '5s' });
            const refresh = jwt.sign({ id: auth.id, isAdmin: auth.isAdmin }, 'jwtsecret', {expiresIn: '1d'});
            refreshTokens.push(refresh);

            res.cookie('jwt', refresh, {httpOnly: true, maxAge: 24*60*60*1000});
            // console.log({
            //     id: auth.id,
            //     username: auth.username,
            //     isAdmin: auth.isAdmin,
            //     token
            // });
            res.json({
                id: auth.id,
                username: auth.username,
                isAdmin: auth.isAdmin,
                token
            });
        }
        catch (error) {
            res.status(500).json('internal server error');
        }
    }else{
        res.status(401).json('authentication failed');
    }
});

app.delete('/api/delete/:id', tokenValidator, (req, res) => {
    const id = req.params.id;
    // console.log(id);

    if(id === req.user.id || req.user.isAdmin){
        res.send(`id=${req.user.id} is delete id=${id} successfully`);
    }else{
        res.send('you are not allow to delete this user');
    }
});

app.get('/api/logout', (req, res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies?.jwt;

    if(refreshTokens.indexOf(refreshToken) !== -1){
        refreshTokens = refreshTokens.filter(token => token !== refreshToken);

        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true});
        res.sendStatus(204);
    }
})


app.listen(PORT, () => {
    console.log('server is runnnig ', PORT);
})
