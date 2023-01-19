const express = require('express');
const path = require(`path`)
const PORT = 8000;
const app = express();

app.use(express.static(path.join(__dirname, '/client')));

let messages = [];

app.get('/', (req, res) => {
    res.show('index.html');
});

app.listen(process.env.PORT || PORT, () => {
    console.log('Server is running on port: 8000');
});