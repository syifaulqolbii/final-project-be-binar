require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./api-docs.yaml');
const cors = require('cors')
const methodOverride = require('method-override');
const router = require('./routes')

const app = express()

const {
    PORT = 3000
}=process.env

app.use(express.json())
app.use(express.urlencoded({ extended: true}));
app.use(morgan('dev'))
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(methodOverride('_method'));
app.use(router);


app.use((err, req, res, next) =>{
    console.log(err);
    return res.status(500).json({
        status: false,
        message: err.message
    });
})

app.set('view engine', 'ejs');

app.listen(PORT, () => console.log('listening on PORT', PORT));
