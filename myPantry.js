// Check that DOM content had all loaded before running code
// document.addEventListener('DOMContentLoaded', function() {

    const allInputs = document.getElementsByTagName('input');
    const allSelects = document.getElementsByTagName('select');
    // const deleteElement = document.getElementsByClassName('delete');
    const pantryInput = document.getElementById('add-to-pantry');
    const pantryItemName = document.getElementById('item-name');
    const pantryList = document.getElementById('pantry-list');
    const pantryQuantity = document.getElementById('quantity');
    const pantryMeasureUnit = document.getElementById('unit-of-measure');
    
    const recipeInput = document.getElementById('add-recipe-item');
    const recipeItem = document.getElementById('recipe-item');
    const recipeItemQty = document.getElementById('recipe-item-qty');
    const recipeItemUnit = document.getElementById('recipe-item-unit');
    const recipeName = document.getElementById('recipe-name');
    const recipeSubmit = document.getElementById('submit-recipe');
    const ingredientsList = document.getElementById('ingredients-list');

    const saveData = document.getElementById('save-data');
    const loadData = document.getElementById('load-data');


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
                unit: unit
            }

            if(this.ingredients.some(ingredient => ingredient.name.includes(ingredientName))) {
                // Lookup object name in pantry array
                for (let ingredient of this.ingredients) {
                    if(ingredient.name === ingredientName) {
                        ingredient.qty = qty;
                        // Prompt user to confirm unit of measurement if already exists in database.
                        if(ingredient.unit !== unit) {
                            let response = confirm(`The unit of measurement for "${ingredientName}" already exists in the database. Do you want to update the from "${ingredient.unit}" to "${unit}"`);
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
        delete(ingredient) {
            let index = this.ingredients.indexOf(ingredient); // find index of ingredient
            this.ingredients.splice(index, 1);  // remove ingredient from array
        }
    }
    const tempRecipe = new Recipe('temp_recipe');

    // ***************TEST CODE
    const apple = new Ingredient('apple', 1, 'piece');
    const bread = new Ingredient('bread', 1, 'misc');
    console.log(apple)
    
    const applePie = new Recipe('Apple pie');
    const pecanPie = new Recipe('Pecan pie');

    // ***************TEST CODE


    // **************EVENT LISTENERS*************
    
    
    pantryList.addEventListener('click', function(e) {
        console.log(e.target)
        // console.log(e.target.className)
        // console.log(e.target.id)
        if(e.target.className === 'delete') e.target.parentElement.remove();
        for (let ingredient of pantry) {
            if(ingredient.name === e.target.id) ingredient.delete();
        }
        displayPantry();
    });
    
    pantryInput.addEventListener('click', function(e) {
        console.log(e.target)
        addToPantry(pantryItemName.value, parseFloat(pantryQuantity.value), pantryMeasureUnit.value);

        resetInputsExceptFor();
    });


    recipeInput.addEventListener('click', function(e) {    
        tempRecipe.add(recipeItem.value, recipeItemQty.value, recipeItemUnit.value)

        displayInputRecipe();
        resetInputsExceptFor('recipe-name');
    });

    recipeSubmit.addEventListener('click', function(e) {
        console.log(e.target)
        
        
        console.log(recipeName.value)
        // console.log(recipeItem.value)
        // console.log(recipeItemQty.value)
        // console.log(recipeItemUnit.value)
        

        // console.log(tempRecipe)

        // Create new Recipe object

        // Read and store recipe name

        // Copy temp recipe data to new Recipe object

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
    });

    // JSON.stringify turns an object to a string
    // JSON.parse turns a string to an object
    // localStorage.setItem(key, value);

    saveData.addEventListener('click', function(e) {
        console.log(e.target)

        const pantryData = JSON.stringify(pantry);
        const recipeData = JSON.stringify(recipes);

        console.log(pantryData)
        console.log(recipeData)

        const pantryDataParse = JSON.parse(pantryData);
        const recipeDataParse = JSON.parse(recipeData);

        console.log(pantryDataParse)
        console.log(recipeDataParse)

        localStorage.setItem('pantryData', pantryData);
        localStorage.setItem('recipeData', recipeData);
        


    });

    loadData.addEventListener('click', function(e) {
        console.log(e.target)

        const pantryData = JSON.parse(localStorage.getItem('pantryData'));

        for(let ingredient of pantryData) {
            addToPantry(ingredient.name, ingredient.qty, ingredient.unit);
        }
        displayPantry();
        
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
                        let response = confirm(`The unit of measurement for "${ingredient.name}" already exists in the database. Do you want to update the from "${ingredient.unit}" to "${unitOfMeasure}"`);
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

    function displayPantry() {
        pantryList.innerHTML = "";

        for (let ingredient of pantry) {
            if(ingredient.qty){
                let newListItem = document.createElement('li');
                newListItem.innerHTML = `\n<span>• ${ingredient.name} ${ingredient.qty} ${ingredient.unit}</span>\n<a id="${ingredient.name}" class="button delete">Delete</a>\n<a class="button add-to-recipe">Add to recipe</a>\n`;
                pantryList.appendChild(newListItem);
            }
        }
    }

    function displayInputRecipe() {
        ingredientsList.innerHTML = "";

        for (let ingredient of tempRecipe.ingredients) {
            if(ingredient.qty){
                let newListItem = document.createElement('li');
                newListItem.innerHTML = `\n<span>• ${ingredient.name} ${ingredient.qty} ${ingredient.unit}</span>\n<a id="${ingredient.name}" class="button delete">Delete</a>\n`;
                ingredientsList.appendChild(newListItem);
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

    function readWriteData(action) {


    }

// });