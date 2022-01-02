var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var formSubmitHandler = function(event) {
  // prevent page from refreshing
  event.preventDefault();
  
  // provides value from input element; stores value in own variable name (username)
  // .trim removes consideration for accidental trailing spaces (" octocate" vs. "octocat")
  var username = nameInputEl.value.trim();

  if (username) {
    getUserRepos(username);

    // clear old content
    repoContainerEl.textContent = "";
    nameInputEl.value = "";
  } else {
    alert("Please enter a GitHub username");
  }
};

var getUserRepos = function(user) {
    // format the github api url
    var apiURL = "https://api.github.com/users/" + user + "/repos";

    // make a request to the url
    fetch(apiURL).then(function(response) {
      // if / else statement created to handle 404 errors
      if (response.ok) {
        console.log(response);
        response.json().then(function(data) {
          // send response dtat from getUsersRepos() to displayRepos() when response data is converted to JSON
          console.log(data);
          displayRepos(data, user);
        });
      } else {
        alert("Error: GitHub User Not Found");
      }
    })
    .catch(function(error) {
      // Notice this '.catch()' getting chained onto the end of the '.then()' method
      alert("Unable to connect to GitHub");
      console.log(error);
    });
};

var displayRepos = function(repos, searchTerm) {
  // check if api returned any repos
  if (repos.length === 0) {
    repoContainerEl.textContent = "No repositories found.";
    return;
  }
    repoSearchTerm.textContent = searchTerm;

  // loop over repos; take each repo & write some of its data to the page
  for (var i = 0; i < repos.length; i++) {
    // format repo name
    var repoName = repos[i].owner.login + "/" + repos[i].name;

    // create a container for each repo; "div" changed to "a" to establish link between index.html & single-repo.html; query for repo added (?repo=... +repoName)
    var repoEl = document.createElement("a");
    repoEl.classList = "list-item flex-row justify-space-between align-center";
    repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

    // create a span element to hold repository name
    var titleEl = document.createElement("span");
    titleEl.textContent = repoName;

    // append to container
    repoEl.appendChild(titleEl);

    // create a status element
    var statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";

    // check if current repo has issues or not
    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
    } else {
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    // append to container
    repoEl.appendChild(statusEl);
 
    // append contain to the dom
    repoContainerEl.appendChild(repoEl);
  }
}
// add event listeners to forms
userFormEl.addEventListener("submit", formSubmitHandler);