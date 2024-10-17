
let mealContainer = document.querySelector(".ran-meal")
let favMealContainer = document.querySelector(".f-meal-section");
let searchBar = document.getElementById("searchBar");
let searchBtn = document.querySelector(".fa-search");
let popUpContainer = document.querySelector(".pop-up-container");
let lightTheme = document.querySelector(".light-theme");



async function getRandomMeal() {
    let data = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    let respData = await data.json();
    let randomMeal = respData.meals[0];
    console.log(randomMeal);
    addMeal(randomMeal)
};

async function getMealById(id) {
    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    let respData = await data.json();
    let meal = respData.meals[0];

    return meal;

}

async function getMealBySearch(search) {
    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`);
    let respData = await data.json();
    let meals = respData.meals;

    return meals;
}

getRandomMeal();

function addMeal(meal) {


    let mealCard = document.createElement("div");
    mealCard.classList.add("meal-card");

    mealCard.innerHTML = `
    <div class="meal-card-img">
                        <img src="${meal.strMealThumb}">
                    </div>
                    <div class="meal-name">
                        <p>${meal.strMeal}</p>
                        <i class="fa fa-heart" aria-hidden="true"></i>
                    </div>
    `
    mealContainer.appendChild(mealCard);

    let btn = mealCard.querySelector(".fa-heart");
    btn.addEventListener("click", () => {
        if (btn.style.color === "red") {
            btn.style.color = "white";
            removeMeal(meal.idMeal);
        }
        else {
            btn.style.color = "red";
            addMeals(meal.idMeal);
        }
        fetchFavMeal();
    });

    let mealImg = mealCard.querySelector(".meal-card-img");

    mealImg.addEventListener("click", ()=>{
        popUpMeal(meal)
    })

};

// set and remove meals in the local storage

function addMeals(mealID) {
    let mealIds = getMeals();
    mealIds.push(mealID);
    localStorage.setItem("mealIds", JSON.stringify(mealIds));
}

function removeMeal(mealID) {
    let mealIds = getMeals();
    mealIds = mealIds.filter(id => id !== mealID);
    localStorage.setItem("mealIds", JSON.stringify(mealIds));
}

function getMeals() {
    let mealIds = JSON.parse(localStorage.getItem("mealIds"));
    return mealIds === null ? [] : mealIds;
}


// now we well fetch meals from localStorage

async function fetchFavMeal() {
    favMealContainer.innerHTML = "";
    let mealIds = getMeals();
    let meals = [];
    for (i = 0; i < mealIds.length; i++) {
        let mealID = mealIds[i];
        let meal = await getMealById(mealID)
        addToFavMeal(meal);
        meals.push(meal);
    }
};

fetchFavMeal();

function addToFavMeal(meal) {
    let favMeal = document.createElement("div");
    favMeal.classList.add("meal");
    favMeal.innerHTML = `
    <div class="img-des">
        <img src="${meal.strMealThumb}" id="img1" alt="">
        <div class="des">${meal.strMeal}</div>
    </div>
    <div class="cross">
        <i class="fa fa-times" aria-hidden="true"></i>
    </div>
    `

    let x = favMeal.querySelector(".cross");
    x.addEventListener("click", () => {
        removeMeal(meal.idMeal);

        let heartBtn = document.querySelectorAll(".fa-heart");
        heartBtn.forEach((e) => {
            e.style.color = "white";
        })

        fetchFavMeal();
    })

    favMeal.querySelector(".img-des").addEventListener("click", ()=>{
        popUpMeal(meal);
    })

    favMealContainer.appendChild(favMeal);
    
}




searchBtn.addEventListener("click", async () => {
    mealContainer.innerHTML = "";
    searchVal = searchBar.value;
    if(searchVal === ""){
        alert("please enter the food");
    }
    let meals = await getMealBySearch(searchVal);
    if (meals) {
        meals.forEach((meal) => {
            addMeal(meal);
        })
        document.querySelector(".bottom > h2").innerHTML = "Search Result...";
    }
    else {
        document.querySelector(".bottom > h2").innerHTML = "No Meals Found..."
    }


})



// function popUpMeal(meal) {
//     let newPopUp = document.createElement("div");
//     newPopUp.classList.add("pop-up");
//     let ingrediants = [];
//     for (i = 0; i <= 20; i++) {
//         if (meal[`strIngrediant${i}`]) {
//             ingrediants.push(`${meal[`strIngrediant${i}`]} - ${meal[`strMeasure${i}`]}`);
//         }
//         else {
//             break;
//         }
//     }



//     newPopUp.innerHTML = ` <i class="fa fa-times fa-lg" aria-hidden="true"></i>
//     <div class="left-pop-up">
//         <div class="meal-card">
//             <div class="meal-card-img">
//                 <img src="${meal.strMealThumb}">
//             </div>
//             <div class="meal-name">
//                 <p>Meal Name</p>
//                 <i class="fa fa-heart" aria-hidden="true"></i>
//             </div>
//         </div>
//     </div>
//     <div class="right-pop-up">
//         <div class="instructions">
//             <h2>Instrunctions</h2>
//             <p>${meal.strInstructions}</p>
//         </div>
//         <div class="ingrediants">
//             <h2>ingrediants / Measures</h2>
//             <div class="li-lists">
//                 ${ingrediants.map(e => `<li>${e}</li>`).join("")}
//             </div>
//         </div>

//     </div>
//     `
//     popUpContainer.innerHTML = "";
//     popUpContainer.appendChild(newPopUp);
//     popUpContainer.style.display = "flex";

//     let cross = document.querySelector(".fa-lg");
//     cross.addEventListener("click", () => {
//         popUpContainer.style.display = "none";
//     })
// }

function popUpMeal(meal) {
    let newPopUp = document.createElement("div");
    newPopUp.classList.add("pop-up");

    let ingredientsList = ""; // Initialize an empty string to store the list of ingredients and measures

    // Loop through the ingredients and measures and construct the list
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        // Check if both ingredient and measure exist
        if (ingredient && measure) {
            ingredientsList += `<li>${ingredient} - ${measure}</li>`;
        } else {
            // If either ingredient or measure is missing, exit the loop
            break;
        }
    }

    // Construct the HTML content for the popup
    newPopUp.innerHTML = `
        <i class="fa fa-times fa-lg" aria-hidden="true"></i>
        <div class="left-pop-up">
            <div class="meal-card">
                <div class="meal-card-img">
                    <img src="${meal.strMealThumb}">
                </div>
                <div class="meal-name">
                    <p>${meal.strMeal}</p>
                    <i class="fa fa-heart" aria-hidden="true"></i>
                </div>
            </div>
        </div>
        <div class="right-pop-up">
            <div class="instructions">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
            </div>
            <div class="ingredients">
                <h2>Ingredients / Measures</h2>
                <div class="li-lists">
                   <ul> ${ingredientsList} </ul>
                </div>
            </div>
        </div>
    `;

    // Append the popup to the container and display it
    popUpContainer.innerHTML = "";
    popUpContainer.appendChild(newPopUp);
    popUpContainer.style.display = "flex";

    // Add event listener to hide the popup when the close button is clicked
    let cross = newPopUp.querySelector(".fa-lg");
    cross.addEventListener("click", () => {
        popUpContainer.style.display = "none";
    });
}

lightTheme.addEventListener("click", ()=>{
    if(lightTheme.classList.contains("fa fa-sun")){
        lightTheme.setAttribute("class", "fa fa-moon")
    }else{

    }
})
