#!/usr/bin/env node

/*var utf8 = require('utf8');
 var wtf8 = require('wtf-8');
 console.log(wtf8.encode('\uD800\uDC01')+ wtf8.encode("\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644"));
 */
var encoding = require("encoding");
var fs = require('fs-extra');
var program = require('commander');

program
    .version('0.0.1')
    .option('-d, --decode [file]', 'decode [file]')
    .option('-e, --encode [file]', 'encode [file]')
    .parse(process.argv);

if(!process.argv.slice(2).length) {
    program.help();
}


if (program.decode){
  // var objet = require(program.input);
    console.log("Decoding  for file: " + program.decode);
    var output  = {};
    fs.readJSON(program.decode, function(err, packageObj) {

      var keys=  Object.keys(packageObj);

        keys.forEach(function(key){
            var formattedString = packageObj[key];
            var resultBuffer = encoding.convert(formattedString,"");

            output[key] = resultBuffer.toString('utf8');

        });

        fs.outputJSON('./humanreadable-dic.json', output, function(err) {

            if(err) {

                console.log(err)
            }else{
                console.log("Conversion results at humanreadable-dic.json")
            }
        })


    });
}

function toUnicode(theString) {
    var unicodeString = '';
    for (var i=0; i < theString.length; i++) {
        var theUnicode = theString.charCodeAt(i).toString(16).toUpperCase();
        while (theUnicode.length < 4) {
            theUnicode = '0' + theUnicode;
        }
        theUnicode = '\\u' + theUnicode;
        unicodeString += theUnicode;
    }
    return unicodeString;
}


if (program.encode){
    // var objet = require(program.input);
    console.log("Encoding to unicode. file : "+ program.encode);

    var output  = {};

    fs.readJSON(program.encode, function(err, packageObj) {

        var keys=  Object.keys(packageObj);
        keys.forEach(function(key){

            var resultBuffer = toUnicode(packageObj[key]);

            output[key] =resultBuffer;

        });
        //


        var tmp = JSON.stringify( output);
        var rex ='\\\\[u]';

        tmp=tmp.replace(new RegExp(rex,'g'),'u');

        fs.outputFile('./unicode-dictionary.json',tmp, function(err) {

            if(err) {
                console.log("error: "+err);
            }else{
               console.log("Conversion results at unicode-dictionary.json")
            }
        })
    });
}

module.exports = program;