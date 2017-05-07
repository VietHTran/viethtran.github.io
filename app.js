var clearOutput = function clear() {
    var output = document.getElementById("out");
    while (output.firstChild) {
        output.removeChild(output.firstChild);
    }
}

var command; //Current command
//List of all available commands
var commandsList={
    "clear":clearOutput
}; 

function addLine(text) {
    var newSpan = document.createElement("SPAN");
    var newLine = document.createElement("BR");
    var textNode = document.createTextNode(text);
    newSpan.appendChild(textNode);
    document.getElementById("out").appendChild(newSpan);
    document.getElementById("out").appendChild(newLine);
}

function handleCommand() {
   argv=command.split(" ");
   if (!(argv[0] in commandsList)) {
       addLine(argv[0]+": command not found");
       return;
   }
   commandsList[argv[0]]();
}

function onKeyDown(ev) {
    if (ev.keyCode==13) {
        var textBox=document.getElementById("commandInp");
        command=textBox.value;
        textBox.value="";
        handleCommand();
    }
}
