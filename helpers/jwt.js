// const expressJwt = require('express-jwt');
const { expressjwt } = require("express-jwt");

// function authJwt() {
//     const secret = process.env.secret; // Make sure to set this secret
//     return expressJwt({
//         secret,
//         algorithms: ['HS256']
//     })
// }

function authJwt() {
    const secret = process.env.secret;
    return expressjwt({
        secret, 
        algorithms: ['HS256']
    }).unless({
        path: [
            '/api/v1/users/login',
            '/api/v1/users/register'
        ]
    })
}

module.exports = authJwt