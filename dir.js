var fileHierarchy={};
const API_PREFIX="http://api.github.com/";

function  getRepos() {
    $.getJSON(API_PREFIX+"users/viethtran/repos", function (result) {
        if (result["message"]==="Not Found") {
            println("Error getting data from github");
            return;
        }
        for (var i=0; i<result.length; ++i) {
            fileHierarchy[result[i]["path"]]=result[i];
        }
    });
}

function getContent(repo,path) {
}

getRepos();
