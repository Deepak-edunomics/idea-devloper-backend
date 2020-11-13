const Router = require("express").Router();
// const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//     const authHeader = req.get('Authorization');
//     if (!authHeader) {
//         const error = new Error('Not authenticated');
//         error.statusCode = 401;
//         return res.status(401).json({
//             sucess: 'false',
//             message: 'Not authenticated'
//         })
//     }
//     const token = req.get('Authorization').split(' ')[1];
//     let decodedtoken;
//     try {
//         decodedtoken = jwt.verify(token, 'secretkey');
//     } catch (err) {
//         err.statusCode = 500;
//         console.log(err)
//         return res.status(500).json({
//             sucess: 'false',
//             message: 'Some Error Occurred'
//         })
//     }
//     if (!decodedtoken) {
//         const error = new Error('Not Authenticated');
//         error.statusCode = 401;
//         return res.status(401).json({
//             sucess: 'false',
//             message: 'Not authenticated'
//         })
//     }
//     //console.log('hii' +decodedtoken);
//     req.email = decodedtoken.email;
//     req.userId = decodedtoken.userId;
//     req.role = decodedtoken.role;
//     req.organization = decodedtoken.organization;
//     next();
// }
// Token verification
Router.use((req, res, next) => {
    const token = req.headers["x-access-token"];
    if (!token) return res.status(403).send({ msg: "Token not provided!" });
    jwt.verify(token.split(" ")[1].toString(), 'secret', process.env.SALT, (err, user) => {
        if (err) {
            return res.status(500).send({ msg: "Failed to authenticate token." });
        }
        req.user = {...user };
        next();
    });
});