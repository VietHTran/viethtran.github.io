var userHelp = function help(argv) {
    addLine("help - this help text");
    addLine("github - view my github profile");
    addLine("github [username] - view a user github profile");
    addLine("intro - print intro message");
    addLine("clear - clear screen");
    addLine("contact - list of ways to contact me")
}

var githubPage = function github(argv) {
    var username="VietHTran";
    for (var i=1; i<argv.length; i++) {
        if (argv[i]!="") {
            username=argv[i];
            break;
        }
    }
    window.open("https://www.github.com/"+username);
}

var introMessage = function printIntro(argv) {
    addLine("Welcome to Tran Shell!");
    addLine("Type 'help' to view all possible commands.");
}

var clearOutput = function clear(argv) {
    var output = document.getElementById("out");
    while (output.firstChild) {
        output.removeChild(output.firstChild);
    }
}

var contactInfo = function contact(argv) {
    addLine("Email: vht1@psu.edu");
    addLine("Alternative email: trantechenterprise@gmail.com");
    addLine("Linkedin: https://www.linkedin.com/in/viet-tran-8168a3122");
    addLine("Skype: viet.tran664");
    addLine("Github: VietHTran");
    addLine("Devpost: VietHTran");
}

var command; //Current command
//List of all available commands
var commandsList={
    "clear":clearOutput,
    "help": userHelp,
    "intro": introMessage,
    "github": githubPage,
    "contact": contactInfo,
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
   commandsList[argv[0]](argv);
}

function onKeyDown(ev) {
    if (ev.keyCode==13) {
        var textBox=document.getElementById("commandInp");
        command=textBox.value;
        addLine("$ "+command);
        textBox.value="";
        handleCommand();
    }
}
