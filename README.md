# uw-jscript310b-final-project-my-pantry
My Pantry - Chris Salvador



Description:

My Pantry tracks ingredients stored in your pantry by user entries. The user has the ability to add/remove ingredients, update the quantity, and change the unit of measurement. The user can also create recipes and fetch nutritional data.


Instructions:

1) Copy provided APP_ID and API_KEY into an 'api-key.js' file and place in root of project folder.

2) Run index.html


UI Description:

-Entering an ingredient:
Complete form fields in the input section then click 'Add to Pantry' which runs validation checks before listing the ingredient in the Pantry section.

-Updating quantity:
Complete form with same ingredient name. To add to current quantity, enter a positive number. To decrease quantity, enter a negative number.

-Create a Recipe:
Complete form fields in the input section and click 'Add ingredient' which runs validation checks before listing the item in the ingredient section. You can also click on the 'Add to recipe' button for any ingredient listed in the Pantry section to populate the name and unit of measure instead of manual typing. Click 'Submit Recipe' to run validation checks and store the recipe in the Recipe section.

-Recipe section:
The 'View' button allows to view the ingredients assigned to the stored recipe. The 'Data' button will run a fetch to the Nutritional Analysis API to gather nutritional information based on the individual ingredients in the recipe. The results are displayed in the Nutritional data section.

-Save/Load/Erase:
'Save Data' and 'Load Data' button will set and get the pantry and recipe data to/from local storage. 'Erase Data' will erase pantry, recipe, and local storage data.


Other Notes:

- Nutritional Analysis API
Source: https://www.edamam.com




