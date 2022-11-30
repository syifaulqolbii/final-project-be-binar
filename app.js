require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const router = require('./routes')
const app = express()

const {
    PORT = 3000
}=process.env

app.use(express.json())
app.use(morgan('dev'))
app.use(router);

app.use((err, req, res, next) =>{
    console.log(err);
    return res.status(500).json({
        status: false,
        message: err.message
    });
})
app.listen(PORT, () => console.log('listening on PORT', PORT));
