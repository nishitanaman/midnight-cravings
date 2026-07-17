document.addEventListener('DOMContentLoaded', () => {
    const ingredientInput = document.getElementById('ingredient-input');
    const tagsWrapper = document.getElementById('tags-wrapper');
    const suggestBtn = document.getElementById('suggest-btn');
    const tryAnotherBtn = document.getElementById('try-another-btn');
    
    const loadingSection = document.getElementById('loading-section');
    const resultSection = document.getElementById('result-section');
    
    const recipeNameEl = document.getElementById('recipe-name');
    const recipeIngredientsEl = document.getElementById('recipe-ingredients');
    const recipeStepsEl = document.getElementById('recipe-steps');

    let ingredients = [];

    // Render tags
    const renderTags = () => {
        tagsWrapper.innerHTML = '';
        ingredients.forEach((ing, index) => {
            const tag = document.createElement('div');
            tag.className = 'tag';
            
            const text = document.createElement('span');
            text.textContent = ing;
            
            const closeBtn = document.createElement('button');
            closeBtn.className = 'tag-close';
            closeBtn.innerHTML = '&times;';
            closeBtn.onclick = () => {
                ingredients.splice(index, 1);
                renderTags();
            };

            tag.appendChild(text);
            tag.appendChild(closeBtn);
            tagsWrapper.appendChild(tag);
        });
    };

    // Add tag on Enter or comma
    ingredientInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const val = ingredientInput.value.trim().replace(/,$/, '');
            if (val && !ingredients.includes(val)) {
                ingredients.push(val);
                ingredientInput.value = '';
                renderTags();
            } else {
                ingredientInput.value = '';
            }
        } else if (e.key === 'Backspace' && ingredientInput.value === '' && ingredients.length > 0) {
            ingredients.pop();
            renderTags();
        }
    });

    // Fetch Recipe
    const fetchRecipe = async () => {
        if (ingredients.length === 0) {
            alert('Please add at least one ingredient.');
            return;
        }

        loadingSection.classList.remove('hidden');
        resultSection.classList.add('hidden');
        suggestBtn.disabled = true;

        try {
            const response = await fetch('/api/ai-recipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ingredients })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to fetch recipe');
            }

            const data = await response.json();
            
            // Populate DOM
            recipeNameEl.textContent = data.recipeName;
            
            recipeIngredientsEl.innerHTML = '';
            data.ingredients.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                recipeIngredientsEl.appendChild(li);
            });

            recipeStepsEl.innerHTML = '';
            data.steps.forEach(step => {
                const li = document.createElement('li');
                li.textContent = step;
                recipeStepsEl.appendChild(li);
            });

            loadingSection.classList.add('hidden');
            resultSection.classList.remove('hidden');
        } catch (error) {
            console.error(error);
            alert('An error occurred while generating the recipe: ' + error.message);
            loadingSection.classList.add('hidden');
        } finally {
            suggestBtn.disabled = false;
        }
    };

    suggestBtn.addEventListener('click', fetchRecipe);
    tryAnotherBtn.addEventListener('click', fetchRecipe);
});
