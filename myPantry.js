// Check that DOM content had all loaded before running code
// document.addEventListener('DOMContentLoaded', function() {

    const allInputs = document.getElementsByTagName('input');
    const allSelects = document.getElementsByTagName('select');
    
    const pantryInput = document.getElementById('add-to-pantry');
    const pantryItemName = document.getElementById('item-name');
    const pantryList = document.getElementById('pantry-list');
    const pantryQuantity = document.getElementById('quantity');
    const pantryMeasureUnit = document.getElementById('unit-of-measure');
    
    const recipeInput = document.getElementById('add-recipe-item');
    const recipeItem = document.getElementById('recipe-item');
    const recipeItemQty = document.getElementById('recipe-item-qty');
    const recipeItemUnit = document.getElementById('recipe-item-unit');
    const recipeList = document.getElementById('recipe-list');
    const recipeName = document.getElementById('recipe-name');
    const recipeSubmit = document.getElementById('submit-recipe');
    const ingredientsList = document.getElementById('ingredients-list');

    const pantrySearch = document.getElementById('search-name');
    const recipeSearch = document.getElementById('recipe-search');

    const saveData = document.getElementById('save-data');
    const loadData = document.getElementById('load-data');
    const eraseData = document.getElementById('erase-data');


    const pantry = [];
    const recipes = [];
    

    class Ingredient {
        constructor(name, qty, unit) {
            this.name = name;
            this.qty = qty;
            this.unit = unit;
        }
        updateQty(qty) {
            this.qty += qty;
        }
        delete() {
            this.qty = null;
        }
    }

    class Recipe {
        constructor(name) {
            this.name = name;
            this.ingredients = [];
        }
        add(ingredientName, qty, unit) {
            const recipeIngredient = {
                name: ingredientName,
                qty: qty,
                unit: unit,
                nutrition: null
            }

            if(this.ingredients.some(ingredient => ingredient.name.includes(ingredientName))) {
                // Lookup object name in pantry array
                for (let ingredient of this.ingredients) {
                    if(ingredient.name === ingredientName) {
                        ingredient.qty = qty;
                        // Prompt user to confirm unit of measurement if already exists in database.
                        if(ingredient.unit !== unit) {
                            let response = confirm(`The unit of measurement for "${ingredientName}" already exists in the database. Do you want to update this from "${ingredient.unit}" to "${unit}"`);
                            if(response) {
                                ingredient.unit = unit;
                                alert(`The unit of measurement for ${ingredientName} has been updated to "${unit}".`)
                            } else alert(`The unit of measurement for ${ingredientName} was not updated.`)
                        }
                    }
                }
            } else {
                this.ingredients.push(recipeIngredient);
            }
        }
        // getNutritionalData() {

        // }
        delete(ingredient) {
            let index = this.ingredients.indexOf(ingredient); // find index of ingredient
            this.ingredients.splice(index, 1);  // remove ingredient from array
        }
    }
    const tempRecipe = new Recipe('temp_recipe');

    

    // **************EVENT LISTENERS*************

    // Search pantry ingredients
    pantrySearch.addEventListener('keydown', function(e) {
        // Delay needed to store search input accurately
        setTimeout( function() {
            const regex = e.target.value;
            console.log(`Regex ${regex}`);
            displayPantry(regex);
        }, 0); 
    });

    // Search recipes
    recipeSearch.addEventListener('keydown', function(e) {
        // Delay needed to store search input accurately
        setTimeout( function() {
    
            const regex = e.target.value;
            console.log(`Regex ${regex}`);
            displayRecipes(regex);
        }, 0); 
    });
    
    // Delete ingredients from pantry array. 
    // Add to recipe from pantry list to populate name and unit of ingredient when building a recipe.
    pantryList.addEventListener('click', function(e) {
        if(e.target.classList.contains('delete')) e.target.parentElement.remove();
        for (let ingredient of pantry) {
            if(ingredient.name === e.target.id) ingredient.delete();
        }

        if(e.target.classList.contains('add-to-recipe')) {
            const pantryLookup = pantry.find(item => item.name === e.target.previousElementSibling.id);
                
            recipeItem.value = pantryLookup.name;
            recipeItemUnit.value = pantryLookup.unit;
            resetInputsExceptFor('recipe-item', 'recipe-item-unit');
        }

        displayPantry();
    });

    // Delete ingredient from list when building a recipe.
    ingredientsList.addEventListener('click', function(e) {
        console.log(e.target)

        if(e.target.classList.contains('delete')) {
            e.target.parentElement.remove();
            for (let ingredient of tempRecipe.ingredients) {
                if(ingredient.name === e.target.id) tempRecipe.delete(ingredient);
            }
        }

        displayInputRecipe();
    });

    // Delete a recipe from Recipe list section.
    // Show list of ingredients for a recipe listed.
    recipeList.addEventListener('click', function(e) {   
        
        // Call function to fetch data from API
        if(e.target.classList.contains('view-nutrition')) {
            console.log(e.target)
            console.log(e.target.nextElementSibling)
            console.log(e.target.parentElement)

            getIngredientData(e.target.nextElementSibling.id);
        }

        // Map method used to return array of recipe names from object array. Splice and indexOf methods use to find location of specific recipe and remove from array.
        if(e.target.classList.contains('delete')) {
            e.target.parentElement.remove();
            // Remove recipe from recipes array
            recipes.splice(recipes.findIndex(recipe => recipe.name === e.target.id), 1);
            displayRecipes();
        }

        if(e.target.classList.contains('view-recipe')) {
            
            if (e.target.parentElement.classList.contains('recipe-view-enabled')) {
                e.target.innerText = 'View';
                e.target.parentElement.classList.remove('recipe-view-enabled');
                e.target.nextElementSibling.remove();

            } else {
                e.target.parentElement.classList.add('recipe-view-enabled');
                e.target.innerText = 'Hide';

                let newUL = document.createElement('ul');
                
                let recipeLookup = recipes.find(recipe => recipe.name === e.target.previousElementSibling.id);
                for (let ingredient of recipeLookup.ingredients) {
                    let newListItem = document.createElement('li');
                    newListItem.classList.add('tab');
                    newListItem.innerHTML = `\n• ${ingredient.name} ${ingredient.qty} ${ingredient.unit}\n`;
                    newUL.appendChild(newListItem);
                }
                e.target.parentElement.appendChild(newUL);
            }
        } 
        
    });

    // Add an item to pantry.
    pantryInput.addEventListener('click', function(e) {
        addToPantry(pantryItemName.value, parseFloat(pantryQuantity.value), pantryMeasureUnit.value);

        resetInputsExceptFor();
    });

    // Add an ingredient to a temp recipe array used for recipe building.
    recipeInput.addEventListener('click', function(e) {    
        tempRecipe.add(recipeItem.value, recipeItemQty.value, recipeItemUnit.value)

        displayInputRecipe();
        resetInputsExceptFor('recipe-name');
    });

    
    // Copy ingredients from temp recipe and create a new recipe object to store.
    recipeSubmit.addEventListener('click', function(e) {

        const newRecipe = new Recipe(recipeName.value);

        for(let ingredient of tempRecipe.ingredients) {
            newRecipe.add(ingredient.name, ingredient.qty, ingredient.unit);
        }

        recipes.push(newRecipe);

        

        // Clear temp recipe
        tempRecipe.name = null;
        tempRecipe.ingredients = [];
        
        ingredientsList.innerHTML = "";
        resetInputsExceptFor();
        displayRecipes();
    });

    // JSON.stringify turns an object to a string
    // JSON.parse turns a string to an object
    // localStorage.setItem(key, value);

    // Save pantry and recipe data to local storage.
    saveData.addEventListener('click', function(e) {

        const pantryData = JSON.stringify(pantry);
        const recipeData = JSON.stringify(recipes);

        localStorage.setItem('pantryData', pantryData);
        localStorage.setItem('recipeData', recipeData);
        
        resetInputsExceptFor();
        displayPantry();
        displayRecipes();
    });

    // Load pantry and recipe data from local storage.
    loadData.addEventListener('click', function(e) {
        // Reset arrays before loading data from local storage
        pantry.length = 0;
        recipes.length = 0;        

        const pantryData = JSON.parse(localStorage.getItem('pantryData'));
        for(let ingredient of pantryData) {
            addToPantry(ingredient.name, ingredient.qty, ingredient.unit);
        }

        const recipeDataParse = JSON.parse(localStorage.getItem('recipeData'));
        for (recipe of recipeDataParse) {
            recipes.push(recipe);
        }

        resetInputsExceptFor();
        displayPantry();
        displayRecipes();
    });

    // Erase data from local storage and pantry/recipe arrays.
    eraseData.addEventListener('click', function(e) {
        // Reset arrays before loading data from local storage
        pantry.length = 0;
        recipes.length = 0;    
        
        const pantryData = JSON.stringify(pantry);
        const recipeData = JSON.stringify(recipes);

        localStorage.setItem('pantryData', pantryData);
        localStorage.setItem('recipeData', recipeData);

        resetInputsExceptFor();
        displayPantry();
        displayRecipes();
    });



    // **************FUNCTIONS*************
    function addToPantry(item, qty, unitOfMeasure) {
    
        if(pantry.some(ingredient => ingredient.name.includes(item))) {
            // Lookup object name in pantry array
            for (let ingredient of pantry) {
                if(ingredient.name === item) {
                    ingredient.updateQty(qty);
                    // Prompt user to confirm unit of measurement if already exists in database.
                    if(ingredient.unit !== unitOfMeasure) {
                        let response = confirm(`The unit of measurement for "${ingredient.name}" already exists in the database. Do you want to update this from "${ingredient.unit}" to "${unitOfMeasure}"`);
                        if(response) {
                            ingredient.unit = unitOfMeasure;
                            alert(`The unit of measurement for ${ingredient.name} has been updated to "${unitOfMeasure}".`)
                        } else alert(`The unit of measurement for ${ingredient.name} was not updated.`)
                    }
                }
            }
        } else {
            pantry.push(new Ingredient(item, qty, unitOfMeasure))       
        }
        displayPantry();
    }

    function displayPantry(search) {
        pantryList.innerHTML = "";

        const regex = new RegExp(search, 'gi');
        for (let ingredient of pantry) {
            if(ingredient.qty) {
                if(search) {
                    if(regex.test(ingredient.name)) {
                        let newListItem = document.createElement('li');
                        newListItem.innerHTML = `\n<span>• ${ingredient.name} ${ingredient.qty} ${ingredient.unit} </span>\n<a id="${ingredient.name}" class="button delete">Delete</a>\n<a class="button add-to-recipe">Add to recipe</a>\n`;
                        pantryList.appendChild(newListItem);
                    }
                } else {
                    let newListItem = document.createElement('li');
                    newListItem.innerHTML = `\n<span>• ${ingredient.name} ${ingredient.qty} ${ingredient.unit} </span>\n<a id="${ingredient.name}" class="button delete">Delete</a>\n<a class="button add-to-recipe">Add to recipe</a>\n`;
                    pantryList.appendChild(newListItem);
                }
            }
        }

    

         
    }

    function displayInputRecipe() {
        ingredientsList.innerHTML = "";

        for (let ingredient of tempRecipe.ingredients) {
            if(ingredient.qty){
                let newListItem = document.createElement('li');
                newListItem.innerHTML = `\n<span>• ${ingredient.name} ${ingredient.qty} ${ingredient.unit} </span>\n<a id="${ingredient.name}" class="button delete">Delete</a>\n`;
                ingredientsList.appendChild(newListItem);
            }
        }
    }

    function displayRecipes(search) {
        recipeList.innerHTML = "";

        const regex = new RegExp(search, 'gi');

        for (let recipe of recipes) {
            if(search) {
                if(regex.test(recipe.name)) {
                    let newListItem = document.createElement('li');
                    newListItem.innerHTML = `\n<span>• ${recipe.name} </span>\n<a class="button view-nutrition">Data</a>\n<a id="${recipe.name}" class="button delete">Delete</a>\n<a class="button view-recipe">View</a>\n`;
                    recipeList.appendChild(newListItem);
                }
            } else {
                let newListItem = document.createElement('li');
                newListItem.innerHTML = `\n<span>• ${recipe.name} </span>\n<a class="button view-nutrition">Data</a>\n<a id="${recipe.name}" class="button delete">Delete</a>\n<a class="button view-recipe">View</a>\n`;
                recipeList.appendChild(newListItem);
            }
        }
    }

    function resetInputsExceptFor(...exceptions) {
        const inputs = Array.from(allInputs);
        const selects = Array.from(allSelects);
        
        inputs.forEach(input => {
            if(! exceptions.includes(input.id)) input.value = "";
        });

        selects.forEach(select => {
            if(! exceptions.includes(select.id)) select.value = "";
        });
    }

    function getIngredientData(recipe) {
        const BASE_URL = 'https://api.edamam.com/api/nutrition-data?';
        // const url = `${BASE_URL}app_id=${APP_ID}&app_key=${API_KEY}&nutrition-type=logging&ingr=${food}`;
        
        // let newUL = document.createElement('ul');
                
        let recipeLookup = recipes.find(element => element.name === recipe);
        
        
        for (let ingredient of recipeLookup.ingredients) {
            
            if(!ingredient.nutrition) {
                let ingredientToStr = `${ingredient.qty} ${ingredient.unit} ${ingredient.name}`;
                let url = `${BASE_URL}app_id=${APP_ID}&app_key=${API_KEY}&nutrition-type=logging&ingr=${ingredientToStr}`;

                fetch(url)
                .then(function(data) {
                    return data.json();
                })
                .then(function(responseJson) {
                    console.log(responseJson)
                    ingredient.nutrition = responseJson;

                    let textWithNoSpaces = ingredient.name.replace(" ", "")
                    let newListItem = document.createElement('li');
                    
                    newListItem.classList.add(textWithNoSpaces);

                    newListItem.innerHTML = `<br>• ${ingredient.nutrition.ingredients[0].text} <br>
                    Calories: ${ingredient.nutrition.calories} <br>
                    ${ingredient.nutrition.totalNutrients.PROCNT.label}: ${ingredient.nutrition.totalNutrients.PROCNT.quantity.toFixed(2)} ${ingredient.nutrition.totalNutrients.PROCNT.unit} <br>
                    ${ingredient.nutrition.totalNutrients.SUGAR.label}: ${ingredient.nutrition.totalNutrients.SUGAR.quantity.toFixed(2)} ${ingredient.nutrition.totalNutrients.SUGAR.unit} <br> <br>`;

                    document.getElementById('nutrition-data').appendChild(newListItem);

                });
            } else {
                let textWithNoSpaces = ingredient.name.replace(" ", "")
                let newListItem = document.createElement('li');
                    
                newListItem.classList.add(textWithNoSpaces);

                newListItem.innerHTML = `<br>• ${ingredient.nutrition.ingredients[0].text} <br>
                Calories: ${ingredient.nutrition.calories} <br>
                ${ingredient.nutrition.totalNutrients.PROCNT.label}: ${ingredient.nutrition.totalNutrients.PROCNT.quantity.toFixed(2)} ${ingredient.nutrition.totalNutrients.PROCNT.unit} <br>
                ${ingredient.nutrition.totalNutrients.SUGAR.label}: ${ingredient.nutrition.totalNutrients.SUGAR.quantity.toFixed(2)} ${ingredient.nutrition.totalNutrients.SUGAR.unit} <br> <br>`;

                document.getElementById('nutrition-data').appendChild(newListItem);

            }
        }

    }


// });