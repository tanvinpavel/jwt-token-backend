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

})

app.post('/api/refresh', (req, res) => {
    const rToken = req.body.refreshToken;
    if(!rToken) return res.send('token not found');
    if(!refreshTokens.includes(rToken)) return res.send('token not found in server');
    jwt.verify(rToken, 'jwtsecret', (err, data) => {
        if(err){
            res.send(err);
        }else{
            refreshTokens = refreshTokens.filter(token => token !== rToken);
            try {
                const newToken = jwt.sign({id: data.id, isAdmin: data.isAdmin}, 'jwtSecret', { expiresIn: '15s' });
                const newRefresh = jwt.sign({id: data.id, isAdmin: data.isAdmin}, 'jwtsecret');
                refreshTokens.push(newRefresh);
                res.json({
                    'new': true,
                    'token': newToken,
                    'refresh': newRefresh
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

    const auth = users.find(u => {
        return u.username === username && u.password === password;
    });

    if(auth){
        try {
            const token = jwt.sign({ id: auth.id, isAdmin: auth.isAdmin }, 'jwtSecret', { expiresIn: '15s' });
            const refresh = jwt.sign({ id: auth.id, isAdmin: auth.isAdmin }, 'jwtsecret');
            refreshTokens.push(refresh);
            res.json({
                id: auth.id,
                username: auth.username,
                isAdmin: auth.isAdmin,
                token,
                refresh
            });
        }
        catch (error) {
            res.status(500).json('internal server error');
        }
    }else{
        res.status(401).json('authentication failed');
    }
})

app.delete('/api/delete/:id', tokenValidator, (req, res) => {
    const id = req.params.id;

    if(id === req.user.id || req.user.isAdmin){
        res.send(`id=${req.user.id} is delete id=${id} successfully`);
    }else{
        res.send('you are not allow to delete this user');
    }
});

app.post('/api/logout', tokenValidator, (req, res) => {
    const refreshToken = req.body.refresh;

    refreshTokens = refreshTokens.filter(token => token !== refreshToken);

    res.send('you are logout');
})


app.listen(PORT, () => {
    console.log('server is runnnig ', PORT);
})
