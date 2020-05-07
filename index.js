const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 4000;

const indexRoute = require('./routes/index');

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// Logging Request
app.use((req, res, next) => {
    console.log(`${req.method}: ${req.url}`, req.body);
    next();
});

// Set mongoose connection
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/iconnect");

app.use('/api', indexRoute);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const code = 404;
    const message = 'Not Found';
    console.log(`Response: ${code}`, message);
    res.status(code).send(message);
});

// error handler
app.use((err, req, res, next) => {
    console.log('Error=====>', err);
    res.status(err.status || 500).json({
        message: 'Something broke!',
        error: err || {}
    });
});

app.listen(port, () => console.log(`IConnect API is listening on port ${port}!`));
