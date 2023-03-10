let searchTextElement = document.getElementById("search-meal-input");
const searchButton = document.getElementById("search-button");
const mealSearchResultsContainer = document.getElementById("meal");
const mealDetailsContainer = document.getElementById("meal-details-container");
const backButton = document.getElementsByClassName("back-button")[0];

searchButton.addEventListener("click", searchForMeal);
searchTextElement.addEventListener("input", searchForMeal);
backButton.addEventListener("click", closeRecipeDetails);
mealSearchResultsContainer.addEventListener("click", getRecipeDetails);
mealSearchResultsContainer.addEventListener("click", addToFavourites);

function searchForMeal() {
  let searchText = searchTextElement.value;
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchText}`)
    .then((response) => response.json())
    .then((data) => {
      let list = "";
      if (data.meals) {
        data.meals.forEach((meal) => {
          list += `
              <div class = "meal-item d-flex flex-column align-items-center" id = "${meal.idMeal}">
                  <div class = "meal-img">
                      <img src = "${meal.strMealThumb}" alt = "food">
                  </div>
                  <div class = "meal-name">
                      <h3>${meal.strMeal}</h3>
                      <a href = "#" class = "recipe-button">Get the Recipe</a>
                  </div>
            
          `;

          let favs = JSON.parse(localStorage.getItem("favourites"));
          let addedCheck = false;
          if(favs != null)
            addedCheck = favs.includes(meal.idMeal);

          if(addedCheck){
            list += `
            <button type="button" class="btn btn-sm btn-danger added-button"><a  href="./favourite/favourite.html" style="text-decoration:none; color:inherit;"><i class="fa-solid fa-heart"></i> Added to Favourites</a></a></button>
            </div>`;
          }
          else{
            list += `<button type="submit" class="btn btn-sm btn-outline-primary favourite-button"> Add To Favourites </button>
            </div>`;
          }


        });
      }
      mealSearchResultsContainer.innerHTML = list;
    });
}

//Recipe details
function getRecipeDetails(event) {
  if (event.target.classList.contains("recipe-button")) {
    let mealItem = event.target.parentElement.parentElement;
    const mealId = mealItem.id;
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
      .then((response) => response.json())
      .then((data) => addRecipeDetail(data.meals[0]));
  }
}

function addRecipeDetail(meal) {
  let content = `
    <h2 class = "recipe-title">${meal.strMeal}</h2>
    <div class = "recipe-instructions">
        
        <p>${meal.strInstructions}</p>
    </div>
    <div class = "recipe-meal-img">
        <img src = "${meal.strMealThumb}" alt = "">
    </div>
    <div class = "recipe-link">
        <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
    </div>`;
  mealDetailsContainer.innerHTML = content;
  mealDetailsContainer.parentElement.classList.add("show-recipe");
}

function closeRecipeDetails() {
  mealDetailsContainer.parentElement.classList.remove("show-recipe");
}

function addToFavourites(event) {
  if (!event.target.classList.contains("favourite-button")) {
    return;
  }

  console.log(event.target);

  let mealId = event.target.parentElement.id;
  let favouriteMeals;

  if (localStorage.getItem("favourites") === null) {
    favouriteMeals = [];
  } else {
    favouriteMeals = JSON.parse(localStorage.getItem("favourites"));
  }
  if (favouriteMeals.indexOf(mealId) !== -1) {
    return;
  }
  favouriteMeals.push(mealId);
  localStorage.setItem("favourites", JSON.stringify(favouriteMeals));

  event.target.classList.remove("favourite-button");
  event.target.classList.remove("btn-outline-primary");
  event.target.classList.add("btn-danger");
  event.target.classList.add("added-button");
  event.target.innerHTML = `<a  href="./favourite/favourite.html" style="text-decoration:none; color:inherit;"><i class="fa-solid fa-heart"></i> Added to Favourites</a></a>`;

}


