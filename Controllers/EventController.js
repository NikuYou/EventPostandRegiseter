const EventRepo   = require('../Data/EventRepo');
const _eventRepo  = new EventRepo();
const Event       = require('../Models/Event');
const RequestService = require('../Services/RequestService');
const sortByDate = (events) => {
    return events.sort(function(a, b){
      return new Date(a.day) - new Date(b.day);
    });
  };
const sortID = (events) => {
    return events.sort(function(a, b){
      return  a._id -  b._id;
    });
  };

const UserRepo   = require('../Data/UserRepo');
const _userRepo  = new UserRepo();



exports.Index = async function(request, response){
    let reqInfo = RequestService.reqHelper(request);
    let events = await _eventRepo.allEvents();
    sortByDate(events);
    if(events!= null) {
        response.render('Event/Index', { events:events, reqInfo:reqInfo })
    }
    else {
        response.render('Event/Index', { events:[],reqInfo:reqInfo })
    }
};

exports.Detail = async function(request, response) {
    let reqInfo = RequestService.reqHelper(request);
    let eventID  = request.query._id; 
    let eventObj = await _eventRepo.getEvent(eventID);
    let users = await _userRepo.allUsers();
    console.log(users[0].firstName);
    response.render('Event/Detail', { event:eventObj, reqInfo:reqInfo, users:users });
}

exports.Create = async function(request, response) {
    let reqInfo = RequestService.reqHelper(request);
    response.render('Event/Create', { errorMessage:"", event:{}, reqInfo:reqInfo });
};

exports.CreateEvent = async function(request, response) {
    let reqInfo = RequestService.reqHelper(request);
    let events = await _eventRepo.allEvents();
    sortID(events);
    if (events.length != 0){
        console.log(events)
        var num = events[events.length-1]._id+1;
        //var num = 1;
    }
    else{
        var num = 1;
    }
    let tempEventObj  = new Event( {
        "_id":          num,
        "title":        request.body.title,
        "description":  request.body.description,
        "location":     request.body.location,
        "day":          request.body.day,
        "time":         request.body.time,
        "createdby":    reqInfo.username,
        "attendees":    []
    });

    let responseObject = await _eventRepo.create(tempEventObj);

    if(responseObject.errorMessage == "") {
        console.log('Saved without errors.');
        console.log(JSON.stringify(responseObject.obj));
        response.render('Event/Detail', { event:responseObject.obj, 
                                            errorMessage:"",reqInfo:reqInfo});
    }
    else {
        console.log("An error occured. Item not created.");
        response.render('Event/Create', {
                        event:responseObject.obj,
                        errorMessage:responseObject.errorMessage,
                        reqInfo:reqInfo});
    }
};

exports.Edit = async function(request, response) {
    let reqInfo = RequestService.reqHelper(request);
    let eventID  = request.query._id;
    console.log(eventID);
    let eventObj = await _eventRepo.getEvent(eventID); 
    console.log(eventObj);  
    response.render('Event/Edit', {event:eventObj, errorMessage:"",reqInfo:reqInfo});
}

exports.Update = async function(request, response) {
    let reqInfo = RequestService.reqHelper(request);
    let eventID = request.body._id;
    console.log("The posted id is: " + eventID);

    let tempEventObj  = new Event( {
        "_id":          eventID,
        "title":        request.body.title,
        "description":  request.body.description,
        "location":     request.body.location,
        "day":          request.body.day,
        "time":         request.body.time,
        "createdby":    request.body.createdby,
        "attendees":    request.body.attendees
    });

    let responseObject = await _eventRepo.update(tempEventObj);

    if(responseObject.errorMessage == "") {
        console.log('Saved without errors.');
        console.log(JSON.stringify(responseObject.obj));
        response.render('Event/Detail', { event:responseObject.obj, 
                                            errorMessage:"",
                                            reqInfo:reqInfo });
    }

    else {
        console.log("An error occured. Item not created.");
        response.render('Event/Edit', { 
            event:      responseObject.obj, 
            errorMessage: responseObject.errorMessage,
            reqInfo:reqInfo });
    }
}


exports.Delete = async function(request, response) {
    let reqInfo = RequestService.reqHelper(request);
    let id           = request.body._id;
    let deletedItem  = await _eventRepo.delete(id);

    console.log(JSON.stringify(deletedItem));
    let events     = await _eventRepo.allEvents();
    response.render('Event/Index', {events:events,reqInfo:reqInfo});
}



exports.Join = async function(request, response) {
    let reqInfo = RequestService.reqHelper(request);
    let eventID = request.body._id;
    let event = await _eventRepo.getEvent(eventID);
    let users = await _userRepo.allUsers();
    console.log("The posted id is: " + eventID);
    console.log(event);
    let newAttendee = reqInfo.username;
    console.log(newAttendee);
    console.log(reqInfo);
    let attendees = event.attendees;
    console.log(attendees);
    if(attendees == []){
        attendees = [newAttendee];
    } else {
        attendees.push(newAttendee);
    }


    let tempEventObj  = new Event( {
        "_id":          eventID,
        "title":        event.title,
        "description":  event.description,
        "location":     event.location,
        "day":          event.day,
        "time":         event.time,
        "createdby":    event.createdby,
        "attendees":    attendees
    });

    let responseObject = await _eventRepo.update(tempEventObj);

    console.log(responseObject);

    if(responseObject.errorMessage == "") {
        console.log('Saved without errors.');
        console.log(JSON.stringify(responseObject.obj));
        response.render('Event/Detail', { event:responseObject.obj, 
                                            errorMessage:"",
                                            reqInfo:reqInfo,users:users });
    }

    else {
        console.log("An error occured. Item not created.");
        response.render('Event/Detail', { 
            event:      responseObject.obj, 
            errorMessage: responseObject.errorMessage,
            reqInfo:reqInfo, users:users });
    }
}

exports.Withdraw = async function(request, response) {
    let reqInfo = RequestService.reqHelper(request);
    let eventID = request.body._id;
    let event = await _eventRepo.getEvent(eventID);
    let users = await _userRepo.allUsers();
    console.log("The posted id is: " + eventID);
    let withdrawAttendee = reqInfo.username;
    let attendees = event.attendees;
    attendees.splice( attendees.indexOf(withdrawAttendee), 1 );
    console.log(attendees);


    let tempEventObj  = new Event( {
        "_id":          eventID,
        "title":        event.title,
        "description":  event.description,
        "location":     event.location,
        "day":          event.day,
        "time":         event.time,
        "createdby":    event.createdby,
        "attendees":    attendees
    });

    let responseObject = await _eventRepo.update(tempEventObj);

    console.log(responseObject);

    if(responseObject.errorMessage == "") {
        console.log('Saved without errors.');
        console.log(JSON.stringify(responseObject.obj));
        response.render('Event/Detail', { event:responseObject.obj, 
                                            errorMessage:"",
                                            reqInfo:reqInfo,users:users });
    }

    else {
        console.log("An error occured. Item not created.");
        response.render('Event/Detail', { 
            event:      responseObject.obj, 
            errorMessage: responseObject.errorMessage,
            reqInfo:reqInfo, users:users });
    }
}
