var userHelp = function help(argv) {
    addLine("help - this help text");
    addLine("github - view my github profile");
    addLine("github [username] - view a user github profile");
    addLine("intro - print intro message");
    addLine("clear - clear screen");
    addLine("contact - list of ways to contact me");
    addLine("who - about me (flags: edu, name, work, etc.)");
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

var ownerInfo = function who(argv) {
    var isPrinted=false;
    if (argv.indexOf("--name")>-1) {
        isPrinted=true;
        addLine("Viet Hung Tran");
    }
    if (argv.indexOf("--edu")>-1) {
        isPrinted=true;
        addLine("Education: Penn State University    2016-2020    Computer Science    3.72/4.00");
    }
    if (argv.indexOf("--work")>-1) {
        isPrinted=true;
        addLine("Work Experience:");
        addLine("Mobile App Intern  (March 2017-Present)");
        addLine("Penn State Abington Campus");
        addLine("");
        addLine("Research Assistant (October 2016-Present)");
        addLine("Penn State Abington Campus");
        addLine("");
        addLine("Computer Lab Assistant (January 2017-Present)");
        addLine("Penn State Abington Campus");
        addLine("");
    }
    if (!isPrinted) {
        addLine("Viet Hung Tran\tPSU\t2016-08-21 08:30 (:0)");
    }
}

var command; //Current command
var commandHistory=[""];//List of enterred commands
var histIndex=0; //Current index in the list
//List of all available commands
var commandsList={
    "clear":clearOutput,
    "help": userHelp,
    "intro": introMessage,
    "github": githubPage,
    "contact": contactInfo,
    "who": ownerInfo,
}; 

function addLine(text) {
    var newSpan = document.createElement("SPAN");
    var newLine = document.createElement("BR");
    var textNode = document.createTextNode(text);
    newSpan.appendChild(textNode);
    document.getElementById("out").appendChild(newSpan);
    document.getElementById("out").appendChild(newLine);
}

function getArgs() {
    argv=[];
    arr=command.split(" ");
    for (i=0;i<arr.length;i++) {
        if (arr[i]!=="") {
            argv.push(arr[i]);
        }
    }
    return argv;
}

function handleCommand() {
    argv=getArgs();
    if (argv.length===0) {
        return;
    }

    histIndex=commandHistory.length;
    commandHistory[histIndex-1]=command;
    commandHistory.push("");

    if (!(argv[0] in commandsList)) {
        addLine(argv[0]+": command not found");
        return;
    }
    commandsList[argv[0]](argv);
}

function onKeyDown(ev) {
    var textBox=document.getElementById("commandInp");
    if (ev.keyCode===13) { //Enter key pressed
        command=textBox.value;
        addLine("$ "+command);
        textBox.value="";
        handleCommand();
    } else if (ev.keyCode===38 && histIndex!==0) { //Up key pressed
        if (histIndex===commandHistory.length-1) {
            commandHistory[commandHistory.length-1]=textBox.value;
        }
        textBox.value=commandHistory[--histIndex];
    } else if (ev.keyCode===40 && histIndex<commandHistory.length-1) { //Down key pressed
        textBox.value=commandHistory[++histIndex];
    } else if (ev.keyCode===76 && ev.ctrlKey) { //Ctrl + L key pressed
        ev.preventDefault(); //Avoid trigger default browser shortcut
        clearOutput();
        textBox.focus();
    }
}
