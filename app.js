require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const router = require('./routes')
const port = process.env.HTTP_PORT;
const app = express()

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
app.listen(port, () => console.log('listening on port', port));

module.exports = app