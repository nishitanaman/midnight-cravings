const express = require('express');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/ai-recipe', async (req, res) => {
    try {
        const { ingredients } = req.body;
        
        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({ error: 'Ingredients array is required' });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-3.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const prompt = `
        You are an expert chef. Create a recipe using some or all of the following ingredients: ${ingredients.join(', ')}.
        You can also include basic pantry staples like salt, pepper, oil, water, butter, etc.
        
        You MUST respond with a strictly valid JSON object matching this schema:
        {
            "recipeName": "String",
            "ingredients": ["String with measurements"],
            "steps": ["String"]
        }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const recipe = JSON.parse(responseText);

        res.json(recipe);
    } catch (error) {
        console.error("Error generating recipe:", error);
        res.status(500).json({ error: 'Failed to generate recipe' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
