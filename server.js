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

        let result;
        try {
            const model = genAI.getGenerativeModel({
                model: "gemini-3.5-flash",
                generationConfig: { responseMimeType: "application/json" }
            });
            result = await model.generateContent(prompt);
        } catch (err) {
            console.warn("Primary model failed, falling back to gemini-1.5-flash due to high demand...");
            const fallbackModel = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                generationConfig: { responseMimeType: "application/json" }
            });
            result = await fallbackModel.generateContent(prompt);
        }
        let responseText = result.response.text();
        
        // Strip out markdown code blocks if the AI includes them
        responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        const recipe = JSON.parse(responseText);

        res.json(recipe);
    } catch (error) {
        console.error("Error generating recipe:", error);
        res.status(500).json({ error: 'Failed to generate recipe: ' + error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
