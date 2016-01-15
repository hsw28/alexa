
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
	if ("ConvertG2C" === intentName) {
		return conversion(intent, session);
	} else if ("SupportedItems" == intentName) {
		 return handleSupportedItemsRequest(intent, session);
    } else if ("AMAZON.HelpIntent" === intentName) {
        return handleHelpRequest();
    } else if ("AMAZON.StopIntent".equals(intentName)) {
        PlainTextOutputSpeech outputSpeech = new PlainTextOutputSpeech();
        outputSpeech.setText("Goodbye");
 		return SpeechletResponse.newTellResponse(outputSpeech);
    } else if ("AMAZON.CancelIntent".equals(intentName)) {
        PlainTextOutputSpeech outputSpeech = new PlainTextOutputSpeech();
        outputSpeech.setText("Goodbye");
		return SpeechletResponse.newTellResponse(outputSpeech);
    } else {
        throw new SpeechletException("Invalid Intent");
        }
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
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "Welcome to grams to cups recipe converter. Ask me to convert common baking ingredients from grams to cups!";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "I can convert ingredients from grams to cups. Ask me to convert an ingredient from grams to cups. To get a list of supported ingredients, ask which ingredients I can convert";
    var shouldEndSession = false;

    callback(sessionAttributes,
             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

 private SpeechletResponse handleHelpRequest() {
        String repromptText = "Ask me to convert common baking ingredients from grams to cups! Try asking me to convert flour";
        String speechOutput =
                "I can convert ingredients from grams to cups. Ask me to convert an ingredient from grams to cups. To get a list of supported ingredients, ask which ingredients I can convert";
        return newAskResponse(speechOutput, repromptText);
    }


 private SpeechletResponse handleSupportedItemsRequest(final Intent intent,
            final Session session) {
        // get city re-prompt
        String speechOutput =
                "Currently, I know conversion information for these ingredients: flour, bread flour, sugar, powdered sugar, brown sugar, and butter. "
                        + repromptText;
        return newAskResponse(speechOutput, repromptText);
    }

/**
private SpeechletResponse conversion(final Intent intent,  final Session session) {
	try {
		item = getItemFromIntent(intent, false);
	} catch (Exception e) {
		String speechOutput = 
			"Currently, I know conversion information for these ingredients: flour, bread flour, sugar, powdered sugar, brown sugar, and butter.";
					+ "Please ask me to convert from grams to cups";
	}
*/	

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
		var z = (y/128);
		z = Math.floor(z * 100) / 100;
		speechOutput = "Converting " + y + " grams of flour is " + z + " cups of flour.";
	} else if (item == "sugar"){
		var z = (y/200);
		z = Math.floor(z * 100) / 100;
		speechOutput = "Converting " + y + " grams of sugar is " + z + " cups of sugar.";
	} else if (item == "powdered sugar"){
		var z = (y/128);
		z = Math.floor(z * 100) / 100;
		speechOutput = "Converting" + y + " grams of powdered sugar is " + z + " cups of powdered sugar.";
	} else if (item == "brown sugar") {
		var z = (y/220);
		z = Math.floor(z * 100) / 100;
		speechOutput = "Converting " + y + " grams of brown sugar is " + z + " cups of brown sugar.";
	} else if (item == "bread flour") {
		var z = (y/136);
		z = Math.floor(z * 100) / 100;
		speechOutput = "Converting " + y + " grams of bread flour is " + z + " cups of bread flour.";
	} else if (item == "butter") {
		var z = (y/227);
		z = Math.floor(z * 100) / 100;
		speechOutput = "Converting " + y + " grams of butter is " + z + " cups of butter.";
	} else {
		speechOutput = "Currently, I know conversion information for these ingredients: flour, bread flour, sugar, powdered sugar, brown sugar, and butter.";
					+ "Please ask me to convert from grams to cups";
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
   //     card: {
   //         type: "Simple",
 //           title: "SessionSpeechlet - " + title,
  //          content: "SessionSpeechlet - " + output
   //     },
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

