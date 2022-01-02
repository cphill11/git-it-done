var repoNameEl = document.querySelector("repo-name");
var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

var getRepoIssues = function(repo) {
    // format the github api url
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    
    // make a get request to url
    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                // pass response data to dom function
                displayIssues(data);

                // check if api has paginated issues
                if (response.headers.get("Link")) {
                   displayWarning(repo);
                }
            });
        } else {
            // if not successful, redirect to home page
            document.location.replace("./index.html");
        }
    });
};

// function created to extract query value from query string in API call fxn 'getRepoIssues()'
var getRepoName = function() {
    // uses location & split() method to extract repo name from query string
    var queryString = document.location.search;

    // splitting on the ("="") creates an array w/ 2 elements, use [1] to indicate 2nd element w/ index notation (as bracket notation starts at zero)
    var RepoName = queryString.split("=")[1];

    // conditional statement that checks if repoName exists
    if (repoName) {
        // display repo name on the page
        repoNameEl.textContent = repoName;

        getRepoIssues(repoName);
    } else {
        // if no repo was given redirect to the homepage
        document.location.replate("./index.html");
    }
}

// add function that accepts issues as a parameter
var displayIssues = function(issues) {
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }

    // loop over given issues
    for (var i = 0; i < issues.length; i++) {
        // create a link element to take users to the issue on github
        var issueEl = document.createElement("a");        
        issueEl.classList = "list-item flex row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");
    
    // create span to hold issue title
    var titleEl = document.createElement("span");
    titleEl.textContent = issues[i].title;

    // append to container
    issueEl.appendChild(titleEl);

    // create a type element
    var typeEl = document.createElement("span");

    // check if issue is an actual issue or a pull request
    if (issues[i].pull_request) {
        typeEl.textContent = "(Pull request)";
    } else {
        typeEl.textContent = "(Issue)";
    }
    // append to container
    issueEl.appendChild(typeEl);
    
    // append to the DOM
    issueContainerEl.appendChild(issueEl);
    }
};

// create new displayWarning() function w/ a repo parameter
var displayWarning = function(repo) {
    // add text to warning container to update the textConent of limitWarningEl
    limitWarningEl.textContent = "To see more than 30 issues, visit ";

    // create link elment
    var linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on Github.com";
    linkEl.setAttribute("href", "https://github.com" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    // append to warning container
    limitWarningEl.appendChild(linkEl);
};

// function call for getRepoName
getRepoName();