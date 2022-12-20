// Need to comment out the following line in myPantry.js before running test:
// document.addEventListener('DOMContentLoaded', function() { .. })

describe('Tests for My Pantry project', () => {

    describe('Tests for the prototype updateQty method on an instance of the class Ingredient', () => {

        it('Should increase the ingredient quantity if a positive number is passed as an argument', () => {
            const apple = new Ingredient('apple', 1, 'piece(s)');
            apple.updateQty(5);
            let value = apple.qty;
            expect(value).toBe(6);
        })

        it('Should decrease the ingredient quantity if a negative number is passed as an argument', () => {
            const banana = new Ingredient('banana', 5, 'piece(s)');
            banana.updateQty(-2);
            let value = banana.qty;
            expect(value).toBe(3);
        })

    });
});