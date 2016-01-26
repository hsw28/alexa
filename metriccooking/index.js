
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
	if ("ConvertGTC" === intentName) {
		conversion(intent, session, callback);
	} else if ("SupportedItems" == intentName) {
		 handleSupportedItemsRequest(intent, session, callback);
    } else if ("AMAZON.HelpIntent" === intentName) {
        handleHelpRequest(intent, session, callback);
    } else if ("AMAZON.StopIntent" == intentName) {
        stop(intent, session, callback);
    } else if ("AMAZON.CancelIntent" == intentName) {
        cancel(intent, session, callback);
    } else {
        throw new SpeechletException ("Invalid intent");
    }
}



function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
                + ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(intent, session, callback) {
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "Welcome to grams to cups recipe converter. Ask me to convert common baking ingredients from grams to cups!";
    var repromptText = "I can convert ingredients from grams to cups. Ask me to convert an ingredient from grams to cups. To get a list of supported ingredients, ask which ingredients I can convert";
    var shouldEndSession = false;
    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    return newAskResponse(speechOutput, true, repromptText, false);
}

function handleHelpRequest(intent, session, callback) {
        var cardTitle = intent.name;
        var repromptText = null;
        var sessionAttributes = {};
        var shouldEndSession = false;
        var speechOutput = "Ask me to convert common baking ingredients from grams to cups! Try asking me to convert flour. To get a list of supported ingredients, ask which ingredients I can convert";
        callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        return newAskResponse(speechOutput, true, repromptText, false);
}

function stop(intent, session, callback) {
        var cardTitle = intent.name;
        var repromptText = null;
        var sessionAttributes = {};
        var shouldEndSession = true;
        var speechOutput = "Goodbye";
        callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        return newAskResponse(speechOutput, true, repromptText, false);
}

function cancel(intent, session, callback) {
        var cardTitle = intent.name;
        var repromptText = null;
        var sessionAttributes = {};
        var shouldEndSession = true;
        var speechOutput = "Goodbye";
        callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        return newAskResponse(speechOutput, true, repromptText, false);
}

function handleSupportedItemsRequest(intent, session, callback) {
        var cardTitle = intent.name;
        var repromptText = null;
        var sessionAttributes = {};
        var shouldEndSession = false;
        speechOutput = "Currently, I know conversion information for these ingredients: flour, bread flour, sugar, powdered sugar, brown sugar, and butter. Please ask me to convert one of these ingrediants from grams to cups";
        callback(sessionAttributes,
             buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
    }


function conversion ( intent, session, callback ) {
	var cardTitle = intent.name;
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = true;
    var speechOutput = "";
    var x = intent.slots.Grams.value;
    var y = parseInt(x);
    var item = intent.slots.Item.value; 
    if (item == "flour"){
		var a = (y/128);
		a = Math.floor(a * 100) / 100;
		speechOutput = "Converting " + y + " grams of flour is " + a + " cups of flour.";
	} else if (item == "sugar"){
		var b = (y/200);
		b = Math.floor(b * 100) / 100;
		speechOutput = "Converting " + y + " grams of sugar is " + b + " cups of sugar.";
	} else if (item == "powdered sugar"){
		var c = (y/128);
		c = Math.floor(c * 100) / 100;
		speechOutput = "Converting" + y + " grams of powdered sugar is " + c + " cups of powdered sugar.";
	} else if (item == "brown sugar") {
		var d = (y/220);
		d = Math.floor(d * 100) / 100;
		speechOutput = "Converting " + y + " grams of brown sugar is " + d + " cups of brown sugar.";
	} else if (item == "bread flour") {
		var e = (y/136);
		e = Math.floor(e * 100) / 100;
		speechOutput = "Converting " + y + " grams of bread flour is " + e + " cups of bread flour.";
	} else if (item == "butter") {
		var f = (y/227);
		f = Math.floor(f * 100) / 100;
		speechOutput = "Converting " + y + " grams of butter is " + f + " cups of butter.";
	} else {
		speechOutput = "I don't know that ingrediant! Currently, I know conversion information for these ingredients: flour, bread flour, sugar, powdered sugar, brown sugar, and butter.";
	}
	
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