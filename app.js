//import React from 'react';
require('dotenv').config();
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const path = require('path');
const hbs = require('hbs');
const bcrypt = require('bcrypt');
require('./src/db/conn');
const Collection = require('./src/models/signup');
const FishTank = require('./src/models/tank');
const auth = require('./src/middleware/auth');
const forgotten = require('./src/models/forgotpassword');
const forgotPasswordRouter = require('./src/route/routes');
const passport = require('./src/passport-setup');
const moment = require('moment');
const uuid = require("uuid");
const methodOverride = require('method-override');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { error } = require('console');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');







const port = process.env.PORT || 3000;






app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}));


app.use(methodOverride('_method'));

app.use(flash());


//public static path
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");
app.use(express.json());
app.use(cookieparser());
app.engine('handlebars', exphbs.engine);
app.set('view engine', 'handlebars');
app.use(express.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(express.static(static_path));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', forgotPasswordRouter);



app.set('view engine', 'hbs');
app.set('views', template_path);
hbs.registerPartials(partials_path);






const isAuthenticated = (req, res, next) => {
    if (req.session.loggedIn) {
        // If user is authenticated, proceed to the next middleware or route handler
        next();
    } else {
        // If user is not authenticated, redirect to login page or send an error response
        res.redirect('/login'); // You can customize this redirection as needed
    }
};

app.use((req, res, next) => {
  if (req.url === '/') {
    res.redirect('/index');
  } else {
    next();
  }
});

//routing
app.get('/', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/index');
    } else {
        res.redirect('/index');
    }
});


app.get('/index', async (req, res) => {
    try {
        if (req.session.loggedIn) {
            // If user is logged in, fetch user data from the database
            const user = await Collection.findOne();
            res.render('home', { name: user.name, loggedIn: true });
        } else {
            // If user is not logged in, render the index page
            res.render('index', { loggedIn: false });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send('Internal Server Error');
    }
});


app.get("/dailydata", (req, res) => {
    res.render('dailydata', { loggedIn: true });
});

app.get("/saveddata", async (req, res) => {
    try {

        const data = await FishTank.find().sort({ date: -1 }); // Fetch all data from MongoDB
        //data.forEach(item => {
        // Assuming 'date' field is a Date object
        // item.formattedDate = formatDate(item.date);
        //});
        data.forEach(item => {
            item.formattedDate = item.date.toLocaleDateString('en-GB');
        });
        res.render('saveddata', { data, loggedIn: true }); // Render savedata.hbs with fetched data
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});



app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => {
    req.session.loggedIn = true
    // Successful authentication, create session
    req.session.user = req.user;
    res.redirect('http://prideaquaculture.com/index');

});

app.get('/api/user', (req, res) => {
    res.json(req.session.user || null);
});

app.use((req, res, next) => {
    res.locals.currentUser = req.session.user;
    next();
});




app.get('/register', (req, res) => {
    res.render('register', { error: req.flash('error') });
});

app.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/login');
    });
});


app.get("/login", (req, res) => {
    res.render('login')
});

// Route to render the edit form with data
app.get('/edit/:id', async (req, res) => {
    try {
        const tankId = req.params.id; // Get the tank ID from the URL params
        const tank = await FishTank.findById(tankId); // Fetch the tank data from the database

        if (!tank) {
            return res.status(404).send('Tank not found');
        }

        res.render('edit', { tank }); // Render the edit form with the tank data
    } catch (error) {
        console.error('Error fetching tank data:', error);
        res.status(500).send('Internal Server Error');
    }
});

const isLoggedIn = (req, res, next) => {
    if (req.session && req.session.loggedIn) {
        // User is logged in
        return true;
    } else {
        // User is not logged in
        return false;
    }
};


app.get("/aboutus", (req, res) => {
    res.render('aboutus', { loggedIn: isLoggedIn(req) })
});

app.get("/service", (req, res) => {
    res.render('service', { loggedIn: isLoggedIn(req) })
});

app.get("/calculation", isAuthenticated, (req, res) => {
    res.render('calculation', { loggedIn: true })
});

app.get("/fish", isAuthenticated, (req, res) => {
    res.render('fish', { loggedIn: true })
});

app.get("/parameters", isAuthenticated, (req, res) => {
    res.render('parameters', { loggedIn: true })
});

app.get("/contactus", (req, res) => {
    res.render('contactus', { loggedIn: isLoggedIn(req) })
});

app.get("*", (req, res) => {
    res.status(404).render('404error')
});

// Route to handle deleting a tank
app.delete('/delete/:id', async (req, res) => {
    try {
        const tankId = req.params.id;
        await FishTank.findByIdAndDelete(tankId);
        res.status(200).send('Tank deleted successfully');
    } catch (error) {
        console.error('Error deleting tank:', error);
        res.status(500).send('Internal Server Error');
    }
});





//search data by date
// Route to handle search
app.post('/search', async (req, res) => {
    try {
        // Retrieve search query from request body
        const searchDate = req.body.searchDate;

        // Perform search query using Mongoose
        const searchData = await FishTank.find({ date: searchDate });

        searchData.forEach(item => {
            item.formattedDate = item.date.toLocaleDateString('en-GB');
        });

        // Render the saveddata.hbs template with search results
        res.render('saveddata', { searchData });
    } catch (error) {
        // Handle any errors
        console.error('Error occurred during search:', error);
        res.status(500).send('An error occurred during search.');
    }
});

// Logout route
app.get('/logout', (req, res) => {
    // Clear session data
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            //res.status(500).send('Internal Server Error');
        } else {
            // Redirect the user to the home page or login page
            res.redirect('login');
        }
    });
});


app.post("/index", async (req, res) => {

    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const phonenumber = req.body.phonenumber;
        const authType = req.body.authType;

        const userAuthType = authType || 'normal';

        const signupsave = new Collection({
            name: name,
            email: email,
            password: userAuthType === 'normal' ? password : undefined,
            phonenumber: userAuthType === 'normal' ? phonenumber : undefined,
            authType: userAuthType

        });

        const token = await signupsave.generateAuthToken();
        res.cookie("jwt", token);



        const savedata = await signupsave.save();
        if (savedata) {
            res.render('login');
        }
    }
    catch (error) {
        res.status(401).send(error);
    }
});



app.post('/home', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Retrieve user from the database based on the provided email
        const user = await Collection.findOne({ email });

        // Check if a user with the provided email exists
        if (!user) {
            // If no user found, render the login page again with an error message
            return res.render('login', { error: 'Invalid email or password' });
        }

        // Compare the provided password with the hashed password stored in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            // If passwords don't match, render the login page again with an error message
            return res.render('login', { error: 'Invalid email or password' });
        }

        // If email and password are correct, set the loggedIn session variable to true
        req.session.loggedIn = true;

        // Redirect the user to the home page
        res.redirect('/index');
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send('Internal Server Error');
    }
});


// Update the tank document in the database
// Route to handle form submission and save edits
app.post('/edit/:id', async (req, res) => {
    try {
        const tankId = req.params.id;
        const { tank, date, time, ph, temperature, dissolvedoxygen, nitrate, nitrite, ammonia } = req.body;

        const updatedTankData = {
            tank,
            date,
            time,
            ph,
            temperature,
            dissolvedoxygen,
            nitrate,
            nitrite,
            ammonia
        };

        const updatedTank = await FishTank.findByIdAndUpdate(tankId, updatedTankData, { new: true });

        if (!updatedTank) {
            return res.status(404).send('Tank not found');
        }

        res.redirect('/saveddata'); // Redirect to the saved data page after successful update
    } catch (error) {
        console.error('Error updating tank:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Daily Data Monitoring..

// Save data
app.post('/save', (req, res) => {

    const { tank } = req.body;
    const date = req.body.date;
    const time = req.body.time;
    const ph = req.body.ph;
    const temperature = req.body.temperature;
    const dissolvedoxygen = req.body.dissolvedoxygen;
    const nitrate = req.body.nitrate;
    const nitrite = req.body.nitrite;
    const ammonia = req.body.ammonia;



    const newEntry = new FishTank({
        id: uuid.v4(),
        tank,
        date: date,
        time: time,
        ph: ph,
        temperature: temperature,
        dissolvedoxygen: dissolvedoxygen,
        nitrate: nitrate,
        nitrite: nitrite,
        ammonia: ammonia
    });
    newEntry.save()
        .then(result => {
            res.json((200), ({ message: 'Saved Successfully' }, newEntry));

        })
        .catch(err => {
            res.json((500), ({ error: 'Error saving data' }));

        });



});
app.get('/save', async (req, res) => {
    try {
        const tanks = await FishTank.find({ user: req.user._id });
        res.status(200).json(tanks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve tanks data' });
    }
});


app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});

