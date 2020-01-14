const Event = require('../Models/Event');

class EventRepo {
    
    EventRepo() {        
    }

    async allEvents() {     
        let events = await Event.find().exec();
        return   events;
    }

    async getEvent(id) {  
        let event = await Event.findOne({_id:id}).exec();
        return   event;
    }

    async create(eventObj) {
        try {
            var error = await eventObj.validateSync();
    
            if(error) {
                let response = {
                    obj:          eventObj,
                    errorMessage: error.message };
    
                return response; // Exit if the model is invalid.
            } 
    
            const result = await eventObj.save();
    
            let response = {
                obj:          result,
                errorMessage: "" };
    
            return response;
        } 
        catch (err) {
            let response = {
                obj:          eventObj,
                errorMessage: err.message };
    
            return  response;
        }    
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
            let eventObject = await this.getEvent(editedObj.id);    
            if(eventObject) {    
                let updated = await Event.updateOne(
                    { _id: editedObj.id}, // Match id.
                    {$set: {title:editedObj.title,
                            description:editedObj.description,
                            location:editedObj.location,
                            day:editedObj.day,
                            time:editedObj.time,
                            createdby:editedObj.createdby,
                            attendees: editedObj.attendees }}); 
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
    
    async delete(id) {
        console.log("Id to be deleted is: " + id);
        let deletedItem =  await Event.find({_id:id}).remove().exec();
        console.log(deletedItem);
        return deletedItem;
    }
    
}

module.exports = EventRepo;