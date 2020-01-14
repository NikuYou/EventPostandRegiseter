var mongoose         = require('mongoose');

var eventSchema    = mongoose.Schema({
        _id:{type:Number,min:1,max:10000000},
        title:{type:String,required:true,minlength:3},
        description:{type:String},
        location:{type:String,required:true},
        day:{type:Date,required:true, min:"2000-01-01", max:"2100-12-31"},
        time:{type:String,required:true},
        createdby:{type:String,required:true},
        attendees:{type:Array}}, 
    {   
        versionKey:false 
    });
var Event    = mongoose.model('Event', eventSchema);
module.exports = Event;
