const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require("path");

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect("mongo_url", {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log("Connected");
}).catch(err => {
    console.log(err);
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join('images')));

app.use('/user', userRoutes);

app.use('/posts', postsRoutes);


app.listen(3000, () => {
    console.log("Listening");
});