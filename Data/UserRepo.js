const User = require('../Models/User');

class UserRepo {
    UserRepo() {        
    }
    async allUsers() {     
        let users = await User.find().exec();
        return   users;
    }

    async getUserByEmail(email) {
        var user = await User.findOne({email: email});
        if(user) {
            let respose = { obj: user, errorMessage:"" }
            return respose;
        }
        else {
            return null;
        }
    }
    async getUser(email) {  
        let user = await User.findOne({email:email}).exec();
        return   user;
    }

    async update(editedObj) {   
        let response = {
        obj:          editedObj,
        errorMessage: "" };

    try {
        var error = await editedObj.validateSync();
        if(error) {
            response.errorMessage = error.message;
            return response;
        }     
        let userObject = await this.getUser(editedObj.email);    
        if(userObject) {    
            let updated = await User.updateOne(
                { email: editedObj.email}, // Match email.
                {$set: {title:editedObj.title,
                        firstName:editedObj.firstName,
                        lastName:editedObj.lastName,
                        streetAddress:editedObj.streetAddress,
                        phoneNumber:editedObj.phoneNumber,
                        username:editedObj.username,
                        password:editedObj.password,}}); 
            if(updated.nModified!=0) {
                response.obj = editedObj;
                return response;
            }
            else {
                respons.errorMessage = 
                    "An error occurred during the update. The item did not save." 
            };
            return response; 
        }                
        else {
            response.errorMessage = "An item with this id cannot be found." };
            return response; 
        }    
    catch (err) {
        response.errorMessage = err.message;
        return  response;
    }    
}

}
module.exports = UserRepo;
