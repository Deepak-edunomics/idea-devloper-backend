const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport')
const cors = require('cors');


const dotenv = require('dotenv');
dotenv.config()


var app = express();

// const apiroutes = require('./api/user');
const userRoutes = require('./api/userApi')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cors());


//Static folder for uploading files/attachments
app.use('/uploads', express.static('uploads'))

//ROUTES


app.use(passport.initialize());

require('./config/passport')(passport)

app.use('/api/user', userRoutes)

// app.use('/api', apiroutes);





app.get("/", (req, res) => { res.send("Here") })

// mongoose.connect(
//         //    'mongodb+srv://admin-hrms:' + 'BUTTONS007' + '@cluster0-kldnh.mongodb.net/idea-deployer?retryWrites=true&w=majority', {
//         "mongodb+srv://root:Gattoo@123@cluster0.qagdc.mongodb.net/test", {
//             dbName: "ideadeployer",
//             useCreateIndex: true,
//             useNewUrlParser: true,
//             useFindAndModify: false,
//             useUnifiedTopology: true,
//         }
//     )
//     .then(console.log('Database Connected'))
    // 

    // .catch(err => console.log(err))

const PORT = process.env.PORT || 3001;

// mongoose.connect(process.env.MONGO_URL.replace("<password>", process.env.MONGO_PASSWORD)
//     , { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }).then(() => {
//         app.listen(PORT)
//         console.log("server Started")
//     }).catch((err) => {
//         console.log("Error in connecting to DataBase", err.message)
//     })




mongoose.connect("mongodb://127.0.0.1:27017/ideaDeveloper"
    , { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }).then(() => {
        app.listen(PORT)
        console.log("Database connected")
    }).catch((err) => {
        console.log("Error in connecting to DataBase", err.message)
    })    


