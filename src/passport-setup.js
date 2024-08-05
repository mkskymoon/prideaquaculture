const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Collection = require('./models/signup');
require('dotenv').config();
const LocalStrategy = require('passport-local').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:3000/auth/google/callback`
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if the user already exists in the database by Google ID
            let user = await Collection.findOne({ googleId: profile.id });

            if (!user) {
                // If the user doesn't exist, check if the email already exists
                const existingUserByEmail = await Collection.findOne({ email: profile.emails[0].value });

                if (existingUserByEmail) {
                    // If email exists, send a message indicating the email is already in use
                    return done(null, false, { message: 'Email already associated with an account. Please use a different email.' });
                } else {
                    // If neither Google ID nor email exists, create a new user document
                    user = new Collection({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        authType: 'google'
                    });
                    await user.save();
                }
            }

            // Pass the user to the next middleware
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }));


passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
            const user = await Collection.findOne({ email });

            if (!user) {
                return done(null, false, { message: 'Incorrect email' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return done(null, false, { message: 'Incorrect password' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await Collection.findById(id); // Correctly reference the Collection model
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});



module.exports = passport;
