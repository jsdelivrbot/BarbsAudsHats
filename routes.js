module.exports = function(app, passport) {


const Fascinator       		= require('./models/fascinator');

    // =====================================
    // ============== ROUTES ===============
    // =====================================

    // =====================================
    // HOME PAGE ===========================
    // =====================================
    app.get('/', function (req, res) {
        var title = "Barbs & Auds Hats and Facinators"
        var tagline = "Bespoke hats & facinators tailored to the event you're lucky enough to be attending"
    res.render('pages/index', {
            title: title, 
            tagline: tagline,
            error: null
            });
    });
    // =====================================
    // ABOUT PAGE ==========================
    // =====================================
    app.get('/about', function(req, res) {
        res.render('pages/about');
    });
    // =====================================
    // FASCINATORS PAGE ====================
    // =====================================
    app.get('/fascinators', function(req, res) {
        Fascinator.find({}, function(err, fascinators) {
        if (err) throw err;

        res.render('pages/fascinators', {
        "fascinators" : fascinators
        });
        // object of all the users
        console.log(fascinators);
        });
    });
    // =====================================
    // LOGIN PAGE ==========================
    // =====================================
    app.get('/login', function(req, res) {
        res.render('pages/login',{ message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
        // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('pages/signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('pages/profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

}