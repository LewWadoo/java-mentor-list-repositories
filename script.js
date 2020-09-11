const inputSearch = document.querySelector("input");
const inputContainer = document.querySelector(".dropdown");
const chosens = document.querySelector(".chosens");

chosens.addEventListener("click", function(event) {
    let target = event.target;
    if (!target.classList.contains("btn-close")) return;

    target.parentElement.remove();
});

inputContainer.addEventListener("click", function(event) {
    let target = event.target;
    if (!target.classList.contains("dropdown-content")) {
	return;
    }
    addChosen(target);
    inputSearch.value = "";
    removePredictions();
});

function removePredictions() {
    let dropdownPredictions = document.querySelectorAll(".dropdown-content");
    if (!dropdownPredictions) return;

    for (let dropdownPrediction of dropdownPredictions) {
	dropdownPrediction.remove();
    }
}

function showPredictions(repositories) {
    let dropdownPredictions = document.querySelectorAll(".dropdown-content");
    removePredictions();

    for (let repositoryIndex = 0; repositoryIndex < 5; repositoryIndex++) {
	let dropdownPrediction = document.createElement("div");
	dropdownPrediction.classList.add("dropdown-content");
	let name = repositories.items[repositoryIndex].name;
	let starsCount = repositories.items[repositoryIndex].stargazers_count;
	dropdownPrediction.textContent = name;
	dropdownPrediction.setAttribute("data-name", name);
	dropdownPrediction.setAttribute("data-owner", repositories.items[repositoryIndex].owner.login);
	dropdownPrediction.setAttribute("data-stars", starsCount);
	inputContainer.append(dropdownPrediction);
    }

}

function addChosen(target) {
    let chosen = document.createElement("div");
    chosen.innerHTML = "Name: " + target.dataset.name + "<br>" + "Owner: " + target.dataset.owner + "<br>" + "Stars: " + target.dataset.stars;
    chosen.classList.add("chosen");
    let button = document.createElement("button");
    button.classList.add("btn-close");
    chosen.append(button);
    chosens.append(chosen);
}

async function getPredictions() {
    const urlSearchRepositories = new URL("https://api.github.com/search/repositories");
    let repositoriesPart = inputSearch.value;
    if (repositoriesPart == "") {
	removePredictions();
	return;
    }

    urlSearchRepositories.searchParams.append("q", repositoriesPart)
    try {
	let response = await fetch(urlSearchRepositories);
	if (response.ok) {
	    let repositories = await response.json();
	    showPredictions(repositories);
	}
	else return null;
    } catch(error) {
	return null;
    }
}

function debounce(fn, timeout) {
    let timer = null;

    return (...args) => {
	clearTimeout(timer);
	return new Promise((resolve) => {
	    timer = setTimeout(
		() => resolve(fn(...args)),
		timeout,
	    );
	});
    };
}

const getPredictionsDebounce = debounce(getPredictions, 500);
inputSearch.addEventListener("keyup", getPredictionsDebounce);
