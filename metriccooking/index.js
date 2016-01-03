
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.[unique-value-here]") {
             context.fail("Invalid Application ID");
         }
        */

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                     event.session,
                     function callback(sessionAttributes, speechletResponse) {
                        context.succeed(buildResponse(sessionAttributes, speechletResponse));
                     });
        }  else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                     event.session,
                     function callback(sessionAttributes, speechletResponse) {
                         context.succeed(buildResponse(sessionAttributes, speechletResponse));
                     });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};



/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId
                + ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId
                + ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId
                + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers -- CHANGED
	if ("ConvertFlour" === intentName) {
        getFlour(intent, session, callback);
	} else if ("ConvertSugar" == intentName) {
		getSugar(intent, session, callback);
	} else if ("ConvertPowderedSugar" == intentName) {
		getPowderedSugar(intent, session, callback);
	} else if ("ConvertBrownSugar" == intentName) {
		getBrownSugar(intent, session, callback);
	} else if ("ConvertButter" == intentName) {
		getButter(intent, session, callback);
	} else if ("ConvertBreadFlour" == intentName) {
		getBreadFlour(intent, session, callback);
    } else if ("HelpIntent" === intentName) {
        getWelcomeResponse(callback);
    } else {
        throw "Invalid intent";
    }
}



function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
                + ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "Welcome to grams to cups recipe converter";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Please say what you'd like converted";
    var shouldEndSession = true;

    callback(sessionAttributes,
             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getFlour( intent, session, callback ) { 
    var cardTitle = intent.name;
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    var x = intent.slots.Grams.value;
    var y = parseInt(x);
	var z = (y/128);
	z = Math.floor(z * 100) / 100;
	speechOutput = "Converting " + y + " grams of flour is " + z + " cups of flour.";
	
    callback(sessionAttributes,
             buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));	
}
function getSugar( intent, session, callback ) { 
    var cardTitle = intent.name;
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    var x = intent.slots.Grams.value;
    var y = parseInt(x);
	var z = (y/200);
	z = Math.floor(z * 100) / 100;
	speechOutput = "Converting" + y + " grams of sugar is " + z + " cups of sugar.";
    callback(sessionAttributes,
             buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));	
}
function getPowderedSugar( intent, session, callback ) { 
    var cardTitle = intent.name;
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
     var x = intent.slots.Grams.value;
    var y = parseInt(x);
	var z = (y/128);
	z = Math.floor(z * 100) / 100;
	speechOutput = "Converting" + y + " grams of powdered sugar is " + z + " cups of powdered sugar.";
    callback(sessionAttributes,
             buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));	
}
function getBrownSugar( intent, session, callback ) { 
    var cardTitle = intent.name;
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    var x = intent.slots.Grams.value;
    var y = parseInt(x);
	var z = (y/220);
	z = Math.floor(z * 100) / 100;
	speechOutput = "Converting" + y + " grams of brown sugar is " + z + " cups of brown sugar.";
    callback(sessionAttributes,
             buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));	
}
function getBreadFlour( intent, session, callback ) { 
    var cardTitle = intent.name;
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    var x = intent.slots.Grams.value;
    var y = parseInt(x)
	var z = (y/136);
	z = Math.floor(z * 100) / 100;
	speechOutput = "Converting" + y + " grams of bread flour is " + z + " cups of bread flour.";
    callback(sessionAttributes,
             buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));	
}
function getButter( intent, session, callback ) { 
    var cardTitle = intent.name;
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    var x = intent.slots.Grams.value;
    var y = parseInt(x);
	var z = (y/227);
	z = Math.floor(z * 100) / 100;
	speechOutput = "Converting" + y + " grams of butter is " + z + " cups of butter.";
    callback(sessionAttributes,
             buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));	
}


// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: "SessionSpeechlet - " + title,
            content: "SessionSpeechlet - " + output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    }
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    }
}