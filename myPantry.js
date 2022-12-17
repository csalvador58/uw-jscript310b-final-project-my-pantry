// Check that DOM content had all loaded before running code
// document.addEventListener('DOMContentLoaded', function() {

    const pantryDelete = document.getElementsByClassName('delete');
    const pantryInput = document.getElementById('input-pantry');
    const pantryItemName = document.getElementById('item-name');
    const pantryList = document.getElementById('pantry-list');
    const pantryQuantity = document.getElementById('quantity');
    const pantryMeasureUnit = document.getElementById('unit-of-measure');
    const recipeInput = document.getElementById('input-recipe');

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
        add(ingredient, qty, unit) {
            const recipeIngredient = {
                name: ingredient.name,
                qty: qty,
                unit: unit
            }
            this.ingredients.push(recipeIngredient);
        }
        delete(ingredient) {
            let index = this.ingredients.indexOf(ingredient.name); // find index of ingredient
            this.ingredients.splice(index, 1);  // remove ingredient from array
        }
    }

    // ***************TEST CODE
    const apple = new Ingredient('apple', 1, 'piece');
    const bread = new Ingredient('bread', 1, 'misc');
    console.log(apple)
    
    const applePie = new Recipe('Apple pie');
    const pecanPie = new Recipe('Pecan pie');

    // ***************TEST CODE


    // **************EVENT LISTENERS*************
    document.addEventListener('click', function(e) {
        console.log(e.target)
        console.log(e.target.className)
        console.log(e.target.id)
        if(e.target.className === 'delete') e.target.parentElement.remove();
        for (let ingredient of pantry) {
            if(ingredient.name === e.target.id) ingredient.delete();
        }
    });
    
    pantryInput.addEventListener('submit', function(e) {
        e.preventDefault();
        addToPantry(pantryItemName.value, parseFloat(pantryQuantity.value), pantryMeasureUnit.value);
    });



    recipeInput.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log(e.target)
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
            let newListItem = document.createElement('li');
            newListItem.innerHTML = `\n<span>• ${ingredient.name} ${ingredient.qty} ${ingredient.unit}</span>\n<a id="${ingredient.name}" class="delete">Delete</a>\n<a class="add-to-recipe">Add to recipe</a>\n`;
            pantryList.appendChild(newListItem);
        }
    }

// });