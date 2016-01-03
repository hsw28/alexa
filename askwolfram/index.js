

exports.handler = function( event, context ) {

    if ( event.request.intent ) {

        question = event.request.intent.slots.Question.value;
        getXML( question, context );

    } else output( 'What is your question?', context );

};

function getXML( input, context ) {

    var http = require( 'http' );
    
    var url = 'http://api.wolframalpha.com/v2/query?input=' + input;
    url += '&format=plaintext&podindex=1,2,3';
    url += '&appid=XXXXXX-XXXXXXXXXX';

    var request = http.get( url, function( response ) {
        
        var xml = '';
        
        response.on( 'data', function( x ) { xml += x; } );
        
        response.on( 'end', function() {
            
            xml = xml.replace( /\n/g, ' ' );

            var pattern = /plaintext>(.*?)<\/plaintext/g;
            var answers = [];
            
            while ( ( match = pattern.exec( xml )) !== null ) {
            
                answers.push( match[1] );
                
            }

            if ( answers[1] === '' ) output( answers[2], context );
            else output( answers[1], context );
        
        } );
        
    } );
  
    request.setTimeout( 4000, function() {
        
        output( 'Your request has timed out. Please try again.', context );
        
    } );
 
}
    
function output( text, context ) {

    var response = {
        outputSpeech: {
            type: "PlainText",
            text: text
        },
        card: {
            type: "Simple",
            title: "Wolfram",
            content: text
        },
        shouldEndSession: false
    };
    
    context.succeed( { response: response } );
    
}
