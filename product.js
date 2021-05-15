const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const { response } = require('express');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
mongoose.set('useFindAndModify', false);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/UsersSinin", {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(() => {
    console.log("Database succussfull.");
}).catch((e) => {
    console.log("No connection");
})

const signInSchema = {
    UserName:{
        type : String,
        required : true
    },
    EmailAddress:{
        type : String,
        required : true
    },
    Password:{
        type : String,
        required : true
    },
    ConfPassword:{
        type : String
    }
}

const SignIn = mongoose.model("SignIn", signInSchema);

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/product', (req, res) => {
    res.render('product');
})

app.get('/signin', (req, res) => {
    res.render('signin');
})

app.post('/signin', (req, res) => {
    try{
        const userName = req.body.inputUserame;
        const email = req.body.inputEmail;
        const password = req.body.inputPassword;
        const confPassword = req.body.inputConfirmPassword;
        if(password === confPassword){
            SignIn.findOne({EmailAddress: email}, async (error, data) => {
                if(error){
                    console.log(error);
                } else {
                    if(!data){
                        const siginInData = new SignIn({
                            UserName: userName,
                            EmailAddress: email,
                            Password: password
                        })
                        const usersSignin = await siginInData.save();
                        console.log("Hola");
                        res.redirect('/');
                    } else {
                        console.log("Found");
                        res.redirect('/');
                    }
                }
            })
        }
    } catch (error) {
        res.status(400).send(error);
    }

})

// app.get('/signin', (req, res) => {
//     res.render('signup');
// })

app.listen(3000, () => {
    console.log("Server is running.");
})