const express = require('express');
var app = express();
const router = require("./src/routes/index")


// set the view engine to ejs
app.use(express.json());
app.use('/public', express.static('public'))
app.use('/forms', express.static('forms'))
app.set('view engine', 'ejs');




app.use('/', router);





app.listen(8080);
console.log('Server is listening on port 8080');