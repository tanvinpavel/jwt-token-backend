const jwt = require('jsonwebtoken')

exports.tokenValidator = (req, res, next) => {
    const tokenStr = req.get('Authorization');
    if(!tokenStr) return res.send('token not found');
    
    const token = tokenStr.replace('Bearer ', '');

    try {
        const data = jwt.verify(token, 'jwtSecret');
        req.user = data;
    } catch (error) {
        res.sendStatus(403);
    }

    next();
}