var StateController = require('./svg_state_controller');
var fs = require('fs');
var path = require('path');
var readline = require("readline");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var fileToProcess;
rl.question("Please input the absolute or relative path of the file", function(filepath) {
    try{
        if(fs.existsSync(filepath)){
            fileToProcess = fs.readFileSync(filepath);
        }
        else if(fs.existsSync(path.join(__dirname, filepath))){
            fileToProcess = fs.readFileSync(path.join(__dirname, filepath));
        }
    } catch(e){
        console.log(`Error Reading File: ${filepath}`, e);
    }
    if(fileToProcess){
        rl.close();
    }
});

rl.on("close", function() {
    console.log(StateController.parseSVG(fileToProcess))
    process.exit(0);
});
