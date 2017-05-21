var fileHierarchy={};
const API_PREFIX="https://api.github.com/";

//Get necessary information from repository
function extractRepoInfo(file) {
    var data={};
    data["language"]=file["language"];
    data["created_at"]=file["created_at"];
    data["updated_at"]=file["updated_at"];
    data["description"]=file["description"];
    return data;
}

//Get necessary information from file
function extractFileInfo(content) {
    var data={};
    data["path"]=content["path"];
    data["type"]=content["type"];
    data["html_url"]=content["html_url"];
    return data;
}

function  getRepos() {
    $.getJSON(API_PREFIX+"users/viethtran/repos", function (result) {
        if (result["message"]==="Not Found") {
            println("Error getting data from github");
            return;
        }
        for (var i=0; i<result.length; ++i) {
            fileHierarchy[result[i]["path"]]=extractRepoInfo(result[i]);
            getContent(result[i]["full_name"],"");
        }
    });
}

function getContent(repoName,path) {
    var contentUrl=API_PREFIX+"repos/"+repoName+"/contents/"+path;
    $.getJSON(contentUrl, function (result) {
        if (result["message"]==="Not Found") {
            println("Error getting content from repository");
            return;
        }
        for (var i=0; i<result.length; ++i) {
            fileHierarchy[repoName+"/"+result[i]["path"]]=extractFileInfo(result[i]);
            if (result[i]["type"]==="dir") {
                getContent(repoName,result[i]["path"]);
            }
        }
    });
}

//getRepos();
