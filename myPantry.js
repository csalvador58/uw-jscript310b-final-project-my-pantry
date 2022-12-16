// Check that DOM content had all loaded before running code
// document.addEventListener('DOMContentLoaded', function() {

    const pantryInput = document.getElementById('input-pantry');
    const recipeInput = document.getElementById('input-recipe');

    const recipes = [];

    class Ingredient {
        constructor(name, type, quantity, unit) {
            this.name = name;
            this.type = type;
            this.quantity = quantity;
            this.unit = unit;
        }
    
    }

    class Recipe {
        constructor(name) {
            this.name = name;
            this.ingredients = [];
        }
        add(ingredient, quantity, unit) {
            const recipeIngredient = {
                name: ingredient.name,
                type: ingredient.type,
                quantity: quantity,
                unit: unit
            }
            this.ingredients.push(recipeIngredient);
        }
        delete(ingredient) {
            let index = this.ingredients.indexOf(ingredient.name); // find index of ingredient
            this.ingredients.splice(index, 1);  // remove ingredient from array
        }
    }

    const apple = new Ingredient('apple', 'fruit', 1, 1);
    const bread = new Ingredient('bread', 'grain', 1, 'misc');
    console.log(apple)
    
    const applePie = new Recipe('Apple pie');
    const pecanPie = new Recipe('Pecan pie');


    pantryInput.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log(e.target)

    });
    recipeInput.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log(e.target)

    });




    function addToPantry(item, quantity) {

    }



// });