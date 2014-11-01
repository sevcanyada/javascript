var PUBNUB = require("../../pubnub.js")

function log(m) {
    return JSON.stringify(m, null, 4);
}
function onError(m) {
    //console.log("Error: - " + m.op + " at " + m.path + " - onSuccess: " + JSON.stringify(m));
    console.log('Error');
}

function onSuccess(m) {
    //console.log("Success: - " + m.op + " at " + m.path + " - onSuccess: " + JSON.stringify(m));
    console.log('Success');
}

function refLog(ref) {
    console.log("Action at node " + ref.path + ".");
    console.log("It was a " + ref.type + " kinda change.");
    console.log("The changed data is " + log(ref.delta.changes));
    console.log("The changed data is " + log(ref.delta.changes[0].value));
    console.log("The new raw object looks like: " + log(ref.value()));
}

var pubnub = PUBNUB.init({
    write_key: "pub-c-bf446f9e-dd7f-43fe-8736-d6e5dce3fe67",
    read_key: "sub-c-d1c2cc5a-1102-11e4-8880-02ee2ddab7fe",
    origin: "dara24.devbuild.pubnub.com"
});

var bedroom1 = {};
var light1 = {};
var light2 = {};
var garage = {};
var bathroom1 = {};
var kitchen = {};
var occupants = {};

var home = pubnub.sync('home');

home.on.change(function(ref){
    console.log("CHANGE");
    refLog(ref);
});

home.on.merge(function(ref) {
    console.log("MERGE");
    refLog(ref);
});

home.on.replace(function(ref) {
    console.log("REPLACE");
    refLog(ref);
});

home.on.remove(function(ref) {
    console.log("REMOVE");
    refLog(ref);
});


home.on.ready(function (ref) {
    //console.log("Home is Ready. Value: " + log(home.value()));

    occupants = pubnub.sync('home.occupants');
    garage = pubnub.sync('home.garage');
    bathroom1 = pubnub.sync('home.bathroom1');
    kitchen = pubnub.sync('home.kitchen');
    bedroom1 = pubnub.sync('home.bedroom1');
    light2 = pubnub.sync('home.bedroom1.light2');
    light1 = pubnub.sync('home.bedroom1.light1');


    light1.on.ready(function (ref) {

        setTimeout(function(){
            console.log("light1 Ready. Value: " + log(ref.value()));
            console.log("Now turning light1 on...");
            light1.replace({ status: 'on' }, onSuccess, onError);
            light1.replace({ config: {intensity: "low"} }, onSuccess, onError);
            light1.replace({ config: {color: "mauve"} }, onSuccess, onError);
        }, 2000);
    });

    occupants.on.change(function(ref) {
        console.log("Occupancy change: " + log(occupants.value()));
    })

    pubnub.snapshot({"object_id":"home", "path":"occupants", "callback":console.log, "error":console.log});
    pubnub.snapshot({"object_id":"home.occupants", "callback":console.log, "error":console.log});

});
