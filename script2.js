document.addEventListener('DOMContentLoaded', () => {
    const mealContainer = document.querySelector('.ran-meal');
    const favMealContainer = document.querySelector('.f-meal-section');
    const searchBar = document.getElementById('searchBar');
    const searchBtn = document.querySelector('.fa-search');
    const popUpContainer = document.querySelector('.pop-up-container');

    async function getRandomMeal() {
        try {
            const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
            const data = await response.json();
            const randomMeal = data.meals[0];
            addMeal(randomMeal);
        } catch (error) {
            console.error('Error fetching random meal:', error);
        }
    }

    async function getMealById(id) {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
            const data = await response.json();
            return data.meals[0];
        } catch (error) {
            console.error(`Error fetching meal with ID ${id}:`, error);
        }
    }

    async function getMealBySearch(search) {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`);
            const data = await response.json();
            return data.meals;
        } catch (error) {
            console.error('Error searching for meals:', error);
        }
    }

    function addMeal(meal) {
        const mealCard = document.createElement('div');
        mealCard.classList.add('meal-card');
        mealCard.innerHTML = `
            <div class="meal-card-img">
                <img src="${meal.strMealThumb}">
            </div>
            <div class="meal-name">
                <p>${meal.strMeal}</p>
                <i class="fa fa-heart" aria-hidden="true"></i>
            </div>
        `;
        mealContainer.appendChild(mealCard);

        const btn = mealCard.querySelector('.fa-heart');
        btn.addEventListener('click', () => {
            btn.style.color = btn.style.color === 'red' ? 'white' : 'red';
            toggleMeal(meal.idMeal, btn.style.color === 'red');
        });
    }

    function toggleMeal(mealID, isFavorite) {
        const mealIds = getMeals();
        if (isFavorite) {
            mealIds.push(mealID);
        } else {
            const index = mealIds.indexOf(mealID);
            if (index !== -1) {
                mealIds.splice(index, 1);
            }
        }
        localStorage.setItem('mealIds', JSON.stringify(mealIds));
        fetchFavMeal();
    }

    function getMeals() {
        const mealIds = JSON.parse(localStorage.getItem('mealIds'));
        return mealIds || [];
    }

    async function fetchFavMeal() {
        favMealContainer.innerHTML = '';
        const mealIds = getMeals();
        for (const mealID of mealIds) {
            const meal = await getMealById(mealID);
            if (meal) {
                addToFavMeal(meal);
            }
        }
    }

    function addToFavMeal(meal) {
        const favMeal = document.createElement('div');
        favMeal.innerHTML = `
            <div class="meal">
                <div class="img-des">
                    <img src="${meal.strMealThumb}" id="img1" alt="">
                    <div class="des">${meal.strMeal}</div>
                </div>
                <div class="cross">
                    <i class="fa fa-times" aria-hidden="true"></i>
                </div>
            </div>
        `;
        const removeBtn = favMeal.querySelector('.fa-times');
        removeBtn.addEventListener('click', () => {
            toggleMeal(meal.idMeal, false);
        });

        favMeal.addEventListener('click', () => {
            popUpMeal(meal);
        });

        favMealContainer.appendChild(favMeal);
    }

    searchBtn.addEventListener('click', async () => {
        mealContainer.innerHTML = '';
        const searchVal = searchBar.value.trim();
        if (searchVal) {
            const meals = await getMealBySearch(searchVal);
            if (meals) {
                meals.forEach(addMeal);
                document.querySelector('.bottom > h2').textContent = 'Search Result...';
            } else {
                document.querySelector('.bottom > h2').textContent = 'No Meals Found...';
            }
        }
    });

    let cross = document.querySelector('.fa-times');
    cross.addEventListener('click', () => {
        popUpContainer.style.display = 'none';
    });

    function popUpMeal(meal) {
        const newPopUp = document.createElement('div');
        newPopUp.classList.add('pop-up');
        const ingrediants = [];
        for (let i = 1; i <= 20; i++) {
            if (meal[`strIngredient${i}`]) {
                ingrediants.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
            } else {
                break;
            }
        }

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
                    <h2>Ingredients/Measures</h2>
                    <div class="li-lists">
                        <ul>${ingrediants.map(ingredient => `<li>${ingredient}</li>`).join('')}</ul>
                    </div>
                </div>
            </div>
        `;
        popUpContainer.innerHTML = '';
        popUpContainer.appendChild(newPopUp);
        popUpContainer.style.display = 'flex';
    }

    getRandomMeal();
    fetchFavMeal();
});
