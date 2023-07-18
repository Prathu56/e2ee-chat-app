const express = require('express');
const { connect } = require('./helpers/mongoUtil');
require('dotenv').config();
const app = express();
app.use(express.json());

app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/chats', require('./routes/chats'));

connect();

app.listen(3000, () => {
    console.log('Server running on port 3000')
});