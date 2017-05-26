var currentDir="~";
var HOME="~";
var HOME_URL="https://api.github.com/users/VietHTran/repos";
var HOME_HTML_URL="https://www.github.com/VietHTran";

var userHelp = function (argv) {
    println("help - this help text");
    println("cd - change current directory");
    println("clear - clear screen");
    println("contact - list of ways to contact me");
    println("github - view my github profile");
    println("github [username] - view a user github profile");
    println("intro - print intro message");
    println("linkedin - view my linkedin profile");
    println("ls [directory] - view files in current or specified directory");
    addTab(1);println("--created: view repositiory created time (home directory only)");
    addTab(1);println("--desc: view repository description (home directory only)");
    addTab(1);println("--lang: view repositiory main language (home directory only)");
    addTab(1);println("--type: display file type");
    addTab(1);println("--updated: view latest updated time (home directory only)");
    println("pwd - view current directory");
    println("who - about me");
    println("xdg-open [file] - open a file in new tab");
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

//Fetching JSON data unsucessfully
function fetchFail(message) {
    return function () { println(message);  }
}

var listFiles = function (argv) {
    var invalidFlag=validateFlag(argv);
    if (invalidFlag!=="1") {
        alertInvalidFlag(argv[0],invalidFlag);
        return;
    }
    var pathStr=getTolerantPath(argv);
    var pathUrl;
    if (pathStr==="-1") {
        pathUrl=getDirHierarchy(currentDir);
    } else {
        pathUrl=getDirHierarchy(pathStr);
    }

    if (pathUrl==="https://api.github.com/users/VietHTran/repos") {
        $.getJSON(pathUrl,function(result){
            if (result["message"]==="Not Found") {
                println("Error fetching data from github");
                return;
            }
            var isLang=(argv.indexOf("--lang")>-1);
            var isCreated=(argv.indexOf("--created")>-1);
            var isUpdated=(argv.indexOf("--updated")>-1);
            var isDesc=(argv.indexOf("--desc")>-1);
            var isType=(argv.indexOf("--type")>-1);
            for (var i=0; i<result.length; ++i) {
                println(result[i]["name"]);
                if (isLang) {
                    addTab(1);
                    var lang= result[i]["language"]===null ? "None" : result[i]["language"];
                    println("Language: "+lang);
                }
                if (isCreated) {
                    addTab(1);
                    println("Created: "+result[i]["created_at"]);
                }
                if (isUpdated) {
                    addTab(1);
                    println("Updated: "+result[i]["updated_at"]);
                }
                if (isDesc) {
                    addTab(1);
                    var desc= result[i]["description"]===null ? "None" : result[i]["description"];
                    println("Description: "+desc);
                }
                if (isType) {
                    addTab(1);
                    println("Type: dir");
                }
            }
        }).fail(fetchFail("Error fetching data from Github"));
    } else if (pathUrl!=="-1") {
        $.getJSON(pathUrl,function(result){
            if ("type" in result) {
                println(pathStr);
                return;
            }
            var isType=(argv.indexOf("--type")>-1);
            for (var i=0; i<result.length; ++i)  {
                println(result[i]["name"]);
                if (isType) {
                    addTab(1);
                    var type= result[i]["type"]==="dir" ? "dir" : "file";
                    println("Type: "+type);
                }
            }
        }).fail(fetchFail("ls: cannot access \'"+pathStr+"\': No such file or directory"));
    } else {
        return;
    }
};

function getNewDir(pathUrl) {
    var REPO_INDEX=5, DIR_INDEX=7, TYPE_INDEX=3;
    var dirLst=pathUrl.split("/");
    var newDir="~";
    if (!(dirLst.length<=REPO_INDEX ||
            (dirLst[TYPE_INDEX]==="users" && 
             dirLst[REPO_INDEX]==="repos"))) {
        newDir+="/"+dirLst[REPO_INDEX];
        for (var i=DIR_INDEX; i<dirLst.length; ++i) {
            if (dirLst[i]==="") {break;}
            newDir+="/"+dirLst[i];
        }
    }
    return newDir;
}

function updateDir(pathUrl) {
    currentDir=getNewDir(pathUrl);
    document.getElementById("dir").innerHTML=currentDir+"$ ";
}

var changeDir = function (argv) {
    var invalidFlag=validateFlag(argv);
    if (invalidFlag!=="1") {
        alertInvalidFlag(argv[0],invalidFlag);
        return;
    }
    if (argv.length===1) {
        currentDir=HOME;
        document.getElementById("dir").innerHTML=currentDir+"$ ";
        return;
    }
    var pathStr=getTolerantPath(argv);
    var pathUrl=getDirHierarchy(pathStr);
    if (pathStr==="-1" || pathUrl==="-1") { return; }
    $.getJSON(pathUrl, function(result) {
        if ("type" in result && result["type"]==="file") {
            println("jash: cd: "+pathStr+": Not a directory");
            return;
        }
        updateDir(pathUrl);
    }).fail(fetchFail("jash: cd: "+pathStr+": No such file or directory"));
};

var openFile = function (argv) {
    var invalidFlag=validateFlag(argv);
    if (invalidFlag!=="1") {
        alertInvalidFlag(argv[0],invalidFlag);
        return;
    }
    if (argv.length===1) {
        window.open(HOME_HTML_URL);
        return;
    }
    var pathStr=getTolerantPath(argv);
    var pathUrl=getDirHierarchy(pathStr);
    if (pathStr==="-1" || pathUrl==="-1") { return; }
    $.getJSON(pathUrl, function(result) {
        if (("type" in result) && 
                (result["type"]==="file")) {
            window.open(result["html_url"]);
            return;
        }
        var newDir=getNewDir(pathUrl);
        window.open(HOME_HTML_URL+newDir.substr(1));
    }).fail(fetchFail("gvfs-open: "+pathStr+": error openning location: Error when getting information for file \'"+getNewDir(pathUrl)+"\': No such file or directory"));
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
    "cd": changeDir,
    "clear": clearOutput,           
    "help": userHelp,             
    "intro": introMessage,         
    "github": githubPage,          
    "contact": contactInfo,        
    "who": ownerInfo,            
    "pwd": printWorkingDir,      
    "ls": listFiles,            
    "linkedin": linkedinPage,         
    "xdg-open": openFile,
};

//List of all commands with flags 
var PS_ARGS= {
    "cd": [],
    "head" : ["cd","clear","help","intro","github","contact","who","pwd","ls","linkedin"],
    "ls": ["--created","--desc","--lang","--updated","--type"],
    "who": ["--edu","--name","--work"],
    "xdg-open": [],
}

//Check if sub is prefix of str
function isPrefix(sub,str) {
    return str.lastIndexOf(sub,0)===0;
}

//Get minimum possible autocompletion for string sub based on stringlist
function getAutoComplete(sub,stringlist) {
    if (stringlist.length===0) { return "-1"; }
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
        if (suffix==="-1") { return; }
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

function isFlag(str) {
    return str.length>2 && str[0]==="-" && str[1]==="-";
}

function validateFlag(argv) {
    if (!(argv[0] in PS_ARGS)) { return; }
    for (var i=0; i<argv.length; ++i) {
        if (!isFlag(argv[i])) {
            continue;
        } else if (!(PS_ARGS[argv[0]].includes(argv[i]))) {
            return argv[i];
        }
    }
    return "1";
}

function alertInvalidFlag(command,flag) {
    println(command+": unrecognized option \'"+flag+"\'");
    println("Try \'help\' for more information.");
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

//Get argument path without slash by check the commons flags
function getTolerantPath(argv) {
    var pathT="";
    for (var i=1; i<argv.length; ++i) {
        if (isFlag(argv[i])) {continue;}
        pathT+=argv[i];
        if (argv[i].charAt(argv.length-1)==="\\") {
            continue;
        }
        break;
    }
    return pathT==="" ? "-1" : pathT;
}

//Get argument path
function getPath(argv) {
    var pathIndex=0, startIndex=-1;
    var isSlashFound=false;
    for (var i=0; i<command.length; ++i) {
        if (command.charAt(i)==="/" ||
                (command.charAt(i)==="~" &&
                (i===-1 || i===0))) { 
            isSlashFound=true; 
        }
        if (command.charAt(i)===" " &&
                !(i>0 && command.charAt(i-1)==="\\")) {
            if (isSlashFound) {
                startIndex= startIndex===-1 ? 0 : startIndex;
                return command.substr(startIndex,i-startIndex);
            } else {
                startIndex=-1;
            }
        }
        if (startIndex===-1 && command.charAt(i)!==" ") {
            startIndex=i;
        }
    }
    if (!isSlashFound) { return "-1"; }
    return command.substr(startIndex,command.length-startIndex);
}

//Delete all backslash
function reformatPath(str) {
    return str.replace(/\\\//g, "/");
}

//Get repository contents URL
function getContentURL(pathLst) {
    if (pathLst.length===0) {return;}
    if (pathLst.length===1 && 
            pathLst[0] === "VietHTran") {
        return "https://api.github.com/users/VietHTran/repos";
    } else {
        if (pathLst[0] !== "VietHTran") {
            println("Access to user "+pathLst[0]+" denied");
            return;
        }
        var urlPref="https://api.github.com/repos/VietHTran/"+pathLst[1];
        var i=2;
        urlPref+="/contents/";
        for (; i<pathLst.length; ++i) {
            urlPref+=pathLst[i]+"/";
        }
        return urlPref;
    }
}

function getDirHierarchy(path) {
    if (path==="-1" || path.length===0) { return "-1"; }
    if (path.charAt(0)==="/") {
        println("Root access denied");
        return "-1";
    }
    var dirs=path.split("/");
    var pathIndex=-1, index=0, navDir=null;
    if (path[0]==="~") {
        navDir=["VietHTran"];
        index=1;
    } else {
        var currentDirLst="VietHTran"+currentDir.substr(1);
        navDir=currentDirLst.split("/");
    }
    for (;index<dirs.length;++index) {
        if (dirs[index]==="" && 
                index+1===dirs.length) { continue; }
        switch (dirs[index]) {
            case "..":
                if (navDir.length===1) {
                    println("Root access denied");
                    return "-1";
                }
                navDir.pop();
            case ".":
                continue;
            default:
                navDir.push(reformatPath(dirs[index]));
        }
    }
    return getContentURL(navDir);
}

//Check if current path is correct
function validatePath(argv) {
    var path=getPath();
    var pathUrl=getDirHierarchy(path);
    if (pathUrl==="-1" || pathUrl==="-1") {
        return;
    }
    $.getJSON(pathUrl,function(result){
        if ("type" in result) {
            println("jash: "+path+": Permission denied");
            return;
        }
        if (typeof(result)==="undefined" ||
                (("message" in result) &&
                result["message"]==="Not Found")) {
            println("jash: "+path+": No such file or directory");
        } else {
            println("jash: "+path+": Is a directory");
        }
    }).fail(function () {
        println("jash: "+path+": No such file or directory");
    });
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
    if (histIndex>1 &&
            commandHistory[histIndex-1]===commandHistory[histIndex-2]) {
        commandHistory[histIndex-1]="";
    } else {
        commandHistory[histIndex-1]=command;
        commandHistory.push("");
    }

    if (!(argv[0] in commandsList)) {
        if (argv[0].indexOf("/")!==-1) {
            validatePath(argv);
        } else {
            println(argv[0]+": command not found");
        }
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

