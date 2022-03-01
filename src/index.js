const express = require('express');
const bodyParser = require('body-parser');

const app = express();

 
//ENTENDER A REQUISIÇÃO PARA A API
app.use(bodyParser.json());
//ENTENDER OS PARAMETROS VIA URL
app.use(bodyParser.urlencoded({extended: false}))


require('../controllers/authController')(app);





app.listen(8080);