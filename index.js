// paspport dependencies

var passport = require('passport');
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

// linkedin app settings
var LINKEDIN_CLIENT_ID = "86ohdf7prp0tzb";
var LINKEDIN_CLIENT_SECRET = "ROlEp1aqBSzw6Out";
var Linkedin = require('node-linkedin')(LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET);

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(new LinkedInStrategy({
    clientID: LINKEDIN_CLIENT_ID,
    clientSecret: LINKEDIN_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/linkedin/callback",
    scope: ['r_emailaddress', 'r_basicprofile', 'rw_company_admin'],
    passReqToCallback: true
},
function (req, accessToken, refreshToken, profile, done) {
	req.session.accessToken = accessToken;
    process.nextTick(function () {
        return done(null, profile);
	});
}));

// for auth

get('/auth/linkedin',
  passport.authenticate('linkedin', { state: 'SOME STATE'  }),
  function(req, res){
    // The request will be redirected to LinkedIn for authentication, so this
    // function will not be called.
});

// for callback

get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/' }),
function (req, res) {
    res.redirect('/');
});

get('/companies', function (req, res) {

    var user_companies = null;
    if (req.session.accessToken != undefined) {
        var linkedin = Linkedin.init(req.session.accessToken);
        linkedin.companies.asAdmin(function (err, companies) {
            this.user_companies = companies;
            
            res.json(this.user_companies);
            // now use this data in view
            // e.g.
            // res.render('index', { companies: user_companies });
        });
    }
    else
    {
        res.render('index', { companies: user_companies });
    }
});

get('/company/:40062', function(req,res){
    if (req.session.accessToken != undefined) {
        var linkedin = Linkedin.init(req.session.accessToken);
        linkedin.companies.company(req.params.id, function (err, company) {
            console.log(company);
            res.json(company);
            // res.render('company', { company: company });
        });
    }
    else
    {
        console.log(req)
        res.send('not found');
    }
})