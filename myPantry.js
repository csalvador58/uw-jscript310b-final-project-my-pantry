// Check that DOM content had all loaded before running code
// document.addEventListener('DOMContentLoaded', function() {

    
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

    const apple = new Ingredient('apple', 1, 'piece');
    const bread = new Ingredient('bread', 1, 'misc');
    console.log(apple)
    
    const applePie = new Recipe('Apple pie');
    const pecanPie = new Recipe('Pecan pie');


    pantryInput.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log(e.target)
        addToPantry(pantryItemName.value, parseFloat(pantryQuantity.value), pantryMeasureUnit.value);
        
        
        
    });
    recipeInput.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log(e.target)
        


    });




    function addToPantry(item, qty, unitOfMeasure) {
    
        if(pantry.some(ingredient => ingredient.name.includes(item))) {
            for (let ingredient of pantry) {
                if(ingredient.name === item) ingredient.qty += qty;
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
            newListItem.innerHTML = `\n<span>${ingredient.name} ${ingredient.qty} ${ingredient.unit}</span>\n<a class="delete">Delete</a>\n`;
            pantryList.appendChild(newListItem);
        }
    }

// });