exports.tokenValidator = (req, res, next) => {
    // console.log(req.headers);
    // const bearerHeader = req.headers.authorization;

    // if (typeof bearerHeader !== 'undefined') {
    //     const jwtToken = bearerHeader.split('bearer '); // token fully array ke 2vag kore just token ta nibo
        
    //     //verifying token
    //     jwt.verify(jwtToken, "privateKey", (err, decode) => {
    //         if(err){
    //             next('authentication token invalid');
    //         }else{
    //             console.log(decode);
    //             next();
    //         }
    //     });
    // } else {
    //     res.send('your are not logged in');
    // }
    console.log(req.signedCookies);
    console.log(req.cookies);
    next();
}