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
    Address:{
        type : String,
        // required : true
    },
    Contact:{
        type : String,
        // required : true
    },
    Pin:{
        type : String,
        // required : true
    },
    Pid : {
        type : String
    },
    Type : {
        type : String
    },
    CartItem : [],
    BaughtItem : [],
    Target : {
        type : String
    },
    Organization : {
        type : String
    },
    QuotedAmount : {
        type : String
    },
    Interest : {
        type : String
    },
    Description : {
        type : String
    }
}

const SignIn = mongoose.model("SignIn", signInSchema);

const ProductSchema = {
    Pid : {
        type : String
    },
    PdtOwner : {
        type : String
    },
    Stocks : {
        type : String
    },
    Review : {
        type : String
    },
    Description : {
        type : String
    }
}

const Product = mongoose.model("Product", ProductSchema);

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
        const pin = req.body.inputPin;
        const address = req.body.inputAddress;
        const contact = req.body.inputContact;
        const type = req.body.type;
        if(password === confPassword){
            SignIn.findOne({EmailAddress: email}, async (error, data) => {
                if(error){
                    console.log(error);
                } else {
                    if(!data){
                        const siginInData = new SignIn({
                            UserName: userName,
                            EmailAddress: email,
                            Password: password,
                            Address: address,
                            Contact: contact,
                            Pin: pin,
                            Type : type
                        })
                        const usersSignin = await siginInData.save();
                        console.log(req.body.type);
                        res.render('home', {email: email});
                    } else {
                        console.log("Found");
                        res.render('home', {email: email});
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
