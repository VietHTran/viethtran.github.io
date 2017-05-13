//TODO: Implement auto complete with Tab
//TODO: Implement cd command 

var currentDir="~";
var HOME="~";

var userHelp = function (argv) {
    println("help - this help text");
    println("clear - clear screen");
    println("contact - list of ways to contact me");
    println("github - view my github profile");
    println("github [username] - view a user github profile");
    println("intro - print intro message");
    println("linkedin - view my linkedin profile");
    println("ls - view current files in directory");
    addTab(1);println("--created: view repositiory created time");
    addTab(1);println("--desc: view repository description");
    addTab(1);println("--lang: view repositiory main language");
    addTab(1);println("--updated: view latest updated time");
    println("pwd - view current directory");
    println("who - about me");
    addTab(1);println("--edu: my education information");
    addTab(1);println("--name: my full name");
    addTab(1);println("--work: my work experience");
};

var githubPage = function (argv) {
    var username="VietHTran";
    for (var i=1; i<argv.length; i++) {
        if (argv[i]!="") {
            username=argv[i];
            break;
        }
    }
    window.open("https://www.github.com/"+username);
};

var introMessage = function (argv) {
    println("Welcome to Tran Shell!");
    println("Type 'help' to view all possible commands.");
};

var clearOutput = function (argv) {
    var output = document.getElementById("out");
    while (output.firstChild) {
        output.removeChild(output.firstChild);
    }
};

var contactInfo = function (argv) {
    println("Email: vht1@psu.edu");
    println("Alternative email: trantechenterprise@gmail.com");
    println("Linkedin: https://www.linkedin.com/in/viet-tran-8168a3122");
    println("Skype: viet.tran664");
    println("Github: VietHTran");
    println("Devpost: VietHTran");
};

var ownerInfo = function (argv) {
    var isPrinted=false;
    if (argv.indexOf("--name")>-1) {
        isPrinted=true;
        println("Viet Hung Tran");
    }
    if (argv.indexOf("--edu")>-1) {
        isPrinted=true;
        println("Education: Penn State University    2016-2020    Computer Science    3.72/4.00");
    }
    if (argv.indexOf("--work")>-1) {
        isPrinted=true;
        println("Work Experience:");
        println("Mobile App Intern  (March 2017-Present)");
        println("Penn State Abington Campus");
        println("");
        println("Research Assistant (October 2016-Present)");
        println("Penn State Abington Campus");
        println("");
        println("Computer Lab Assistant (January 2017-May 2017)");
        println("Penn State Abington Campus");
        println("");
    }
    if (!isPrinted) {
        println("Viet Hung Tran\tPSU\t2016-08-21 08:30 (:0)");
    }
};

var printWorkingDir = function (argv) {
    filePath="VietHTran"+currentDir.substr(1);
    println("https://www.github.com/"+filePath);
};

var listFiles = function (argv) {
    if (currentDir===HOME) {
        $.getJSON("https://api.github.com/users/VietHTran/repos",function(result){
            for (var i=0; i<result.length; i++) {
                println(result[i]["name"]);
                if (argv.indexOf("--lang")>-1) {
                    addTab(1);
                    var lang= result[i]["language"]===null ? "None" : result[i]["language"];
                    println("Language: "+lang);
                }
                if (argv.indexOf("--created")>-1) {
                    addTab(1);
                    println("Created: "+result[i]["created_at"]);
                }
                if (argv.indexOf("--updated")>-1) {
                    addTab(1);
                    println("Updated: "+result[i]["updated_at"]);
                }
                if (argv.indexOf("--desc")>-1) {
                    addTab(1);
                    var desc= result[i]["description"]===null ? "None" : result[i]["description"];
                    println("Description: "+desc);
                }
            }
        });
    } else {
        filePath="VietHTran"+currentDir.substr(1);
        url="https://api.github.com/repos/"+currentDir+"/contents";
        $.getJSON(url,function(result){
            for (var i=0; i<result.length; i++) {
                println(result[i]["name"]);
            }
        });
    }
};

var linkedinPage = function (argv) {
    window.open("https://www.linkedin.com/in/viet-tran-8168a3122");
};

var command; //Current command
var commandHistory=[""];//List of enterred commands
var histIndex=0; //Current index in the list

var tabHits=0; //Number of times the user hit tab
var possibilities=[] //List of possibilities for auto completion
var HEAD="head";

//List of all available commands
var commandsList={
    "clear": clearOutput,           
    "help": userHelp,             
    "intro": introMessage,         
    "github": githubPage,          
    "contact": contactInfo,        
    "who": ownerInfo,            
    "pwd": printWorkingDir,      
    "ls": listFiles,            
    "linkedin": linkedinPage,         
};

//List of all commands with flags 
var PS_ARGS= {
    "head" : ["clear","help","intro","github","contact","who","pwd","ls","linkedin"],
    "ls": ["--created","--desc","--lang","--updated"],
    "who": ["--edu","--name","--work"],
}

//Check if sub is prefix of str
function isPrefix(sub,str) {
    return str.lastIndexOf(sub,0)===0;
}

//Get minimum possible autocompletion for string sub based on stringlist
function getAutoComplete(sub,stringlist) {
    var res=stringlist[0].substr(sub.length);
    for (var i=1;i<stringlist.length;++i) {
        if (res==="") {break;}
        var tail=stringlist[i].substr(sub.length);
        var len=res.length>tail.length ? tail.length : res.length;
        for (var j=0; j<len; ++j) {
            if (res.charAt(j)!==tail.charAt(j)) {
                res=res.substr(0,j);
                break;
            }
        }
    }
    return res;
}

//Check possibilities to autocomplete a command
function checkPoss() {
    var textBox=document.getElementById("commandInp");
    command=textBox.value;
    argv=getArgs();
    if (argv.length===0) {
        return;
    } else {
        var poss=[], suffix="", index=0;
        var availableArgs;
        if (argv.length===1) {
            availableArgs=PS_ARGS[HEAD];
        } else {
            if ((argv[0] in commandsList) && 
                    (argv[0] in PS_ARGS) && 
                    (argv[0] !== HEAD)) {
                availableArgs=PS_ARGS[argv[0]];
                index=argv.length-1;
            } else {
                return;
            }
        }
        for (var i=0; i<availableArgs.length; ++i) {
            if (isPrefix(argv[index],availableArgs[i])) {
                poss.push(availableArgs[i]);
            }
        }
        suffix=getAutoComplete(argv[index],poss);
        if (suffix==="") {
            ++tabHits;
        } else {
            tabHits=0;
            textBox.value+=suffix;
            return;
        }

        if (tabHits>=2 && poss.length>1) {
            ++tabHits;
            println(currentDir+"$ "+command);
            for (var i=0; i<poss.length; ++i) {
                println(poss[i]);
            }
        }
    }
}

function gotoBottom() {
    window.scrollTo(0,document.body.scrollHeight);
}

function println(text) {
    var newSpan = document.createElement("SPAN");
    var newLine = document.createElement("BR");
    var textNode = document.createTextNode(text);
    newSpan.appendChild(textNode);
    document.getElementById("out").appendChild(newSpan);
    document.getElementById("out").appendChild(newLine);
    gotoBottom();
}

function print(text) {
    var newSpan = document.createElement("SPAN");
    var textNode = document.createTextNode(text);
    newSpan.appendChild(textNode);
    document.getElementById("out").appendChild(newSpan);
}

function addTab(tabs) {
    var newSpan = document.createElement("SPAN");
    var space=tabs*40;
    newSpan.style.marginLeft=""+space+"px";
    document.getElementById("out").appendChild(newSpan);
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
        println(argv[0]+": command not found");
        return;
    }
    commandsList[argv[0]](argv);
}

function onKeyDown(ev) {
    var textBox=document.getElementById("commandInp");
    if (ev.keyCode===13) { //Enter key pressed
        command=textBox.value;
        println(currentDir+"$ "+command);
        textBox.value="";
        handleCommand();
        textBox.focus();
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
    } else if (ev.keyCode===9) {
        ev.preventDefault(); //Avoid trigger default browser shortcut
        checkPoss();
    }
}
