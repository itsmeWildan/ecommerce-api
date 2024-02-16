const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
// require('dotenv/config')   
require('dotenv').config();
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler')


app.use(cors())
app.options('*', cors())

// middleware
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(authJwt());
app.use(errorHandler)


// routes
const categoriesRoutes = require('./routes/categories')
const productsRoutes = require('./routes/products')
const usersRoutes = require('./routes/users')
const ordersRoutes = require('./routes/orders')


const api = process.env.API_URL

app.use(`${api}/categories`, categoriesRoutes)
app.use(`${api}/products`, productsRoutes)
app.use(`${api}/users`, usersRoutes)
app.use(`${api}/orders`, ordersRoutes)
    
    // database
    // const PORT = process.env.PORT||3000
    // const MONGOURL = process.env.MONGO_URL

    // mongoose.connect(MONGOURL).then(()=>{
    //         console.log('Database connection Successfully...')
    //         app.listen(PORT, ()=>{
    //                 console.log(`Server is running http://localhost:${PORT}`)
    //             })
    //         }).catch((err)=>{
    //                 console.log(err)
    //             })
                
    // mongoose.connect('mongodb://localhost:3000/ecommerce1'); // new method connect mongoose

    mongoose.connect(process.env.CONNECTION_STRING, {
        dbName: 'ecommerce1'
    })
    .then(() => {console.log('Database connection ready...')
    })
    .catch((err) => {
        console.log(err)
    })

    // server
    app.listen(3000, () => {

        console.log('Server is running http://localhost:3000')
})