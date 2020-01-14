const User           = require('../Models/User');
var   passport       = require('passport');
const RequestService = require('../Services/RequestService');
const UserRepo   = require('../Data/UserRepo');
const _userRepo  = new UserRepo();

// Displays registration form.
exports.Register = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    res.render('User/Register', {errorMessage:"", user:{}, reqInfo:reqInfo})
};

// Handles 'POST' with registration form submission.
exports.RegisterUser  = async function(req, res){
   
    var password        = req.body.password;
    var passwordConfirm = req.body.passwordConfirm;

    if (password == passwordConfirm) {

        // Creates user object with mongoose model.
        // Note that the password is not present.
        var newUser = new User({
            firstName:    req.body.firstName,
            lastName:     req.body.lastName,
            email:        req.body.email,
            username:     req.body.username,
            streetAddress:req.body.streetAddress,
            phoneNumber:  req.body.phoneNumber,
     //       password:     req.body.password,
        });
       
        // Uses passport to register the user.
        // Pass in user object without password
        // and password as next parameter.
        User.register(new User(newUser), req.body.password, 
                function(err, account) {
                    // Show registration form with errors if fail.
                    if (err) {
                        let reqInfo = RequestService.reqHelper(req);
                        return res.render('User/Register', 
                        { user : newUser, errorMessage: err, 
                          reqInfo:reqInfo });
                    }
                    // User registered so authenticate and redirect to secure 
                    // area.
                    passport.authenticate('local') (req, res, 
                            function () { res.redirect('/User/Profile'); });
                });

    }
    else {
      res.render('User/Register', { user:newUser, 
              errorMessage: "Passwords do not match.", 
              reqInfo:reqInfo})
    }
};

// Shows login form.
exports.Login = async function(req, res) {
    let reqInfo      = RequestService.reqHelper(req);
    let errorMessage = req.query.errorMessage; 

    res.render('User/Login', { user:{}, errorMessage:errorMessage, 
                               reqInfo:reqInfo});
}

// Receives login information & redirects 
// depending on pass or fail.
exports.LoginUser = (req, res, next) => {

  passport.authenticate('local', {
      successRedirect : '/User/Profile', 
      failureRedirect : '/User/Login?errorMessage=Invalid login.', 
  }) (req, res, next);
};

// Log user out and direct them to the login screen.
exports.Logout = (req, res) => {
    req.logout();
    let reqInfo = RequestService.reqHelper(req);

    res.render('User/Login', { user:{}, isLoggedIn:false, errorMessage : "", 
                               reqInfo:reqInfo});
};

// This displays a view called 'securearea' but only 
// if user is authenticated.
exports.Profile  = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    let userEmail  = reqInfo.email;
    let userObj = await _userRepo.getUser(userEmail);
    if(reqInfo.authenticated) {
        res.render('User/Profile', {errorMessage:"", reqInfo:reqInfo, user:userObj})
    }
    else {
        res.redirect('/User/Login?errorMessage=You ' + 
                     'must be logged in to view this page.')
    }
    
}

exports.Edit = async function(request, response) {
    let reqInfo = RequestService.reqHelper(request);
    let email = reqInfo.email;
    let userObj = await _userRepo.getUser(email);   
    response.render('User/Edit', {user:userObj, errorMessage:"",reqInfo:reqInfo});
}

exports.Update = async function(request, response) {
    let reqInfo = RequestService.reqHelper(request);
    let email = reqInfo.email;
    let userObj = await _userRepo.getUser(email);   
    console.log("The posted email is: " + email);

    let tempUserObj  = new User( {
        firstName:    request.body.firstName,
        lastName:     request.body.lastName,
        email:        email,
        username:     userObj.username,
        streetAddress:request.body.streetAddress,
        phoneNumber:  request.body.phoneNumber,
        password:     userObj.password,
    });

    let responseObject = await _userRepo.update(tempUserObj);

    if(responseObject.errorMessage == "") {
        console.log('Saved without errors.');
        console.log(JSON.stringify(responseObject.obj));
        response.render('User/Profile', { user:responseObject.obj, 
                                            errorMessage:"", reqInfo:reqInfo});
    }

    else {
        console.log("An error occured. Item not created.");
        response.render('User/Edit', { 
            user:      responseObject.obj, 
            errorMessage: responseObject.errorMessage, reqInfo:reqInfo });
    }
}

