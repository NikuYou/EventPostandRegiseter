var HomeController = require('./Controllers/HomeController');
var EventController = require('./Controllers/EventController');
var UserController = require('./Controllers/UserController');

// Routes
module.exports = function(app){  
    // Main Routes
    app.get('/',      HomeController.Index);    
    
    app.get('/Event/Index', EventController.Index); 
    app.get('/Event/Detail', EventController.Detail); 
    app.get('/Event/Create', EventController.Create);
    app.post('/Event/CreateEvent', EventController.CreateEvent);
    app.get('/Event/Edit', EventController.Edit);
    app.post('/Event/Update', EventController.Update);
    app.post('/Event/Delete', EventController.Delete);
    app.post('/Event/Join', EventController.Join);
    app.post('/Event/Withdraw', EventController.Withdraw);

    app.get('/User/Register', UserController.Register);
    app.post('/User/RegisterUser', UserController.RegisterUser);
    app.get('/User/Login', UserController.Login);
    app.post('/User/LoginUser', UserController.LoginUser);
    app.get('/User/Logout', UserController.Logout);
    app.get('/User/Profile', UserController.Profile);
    app.get('/User/Edit', UserController.Edit);
    app.post('/User/Update', UserController.Update);

};
