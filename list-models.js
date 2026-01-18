
const fs = require('fs');
const path = require('path');

// Load env manually
const envPath = path.resolve(process.cwd(), '.env');
let apiKey = null;

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/GOOGLE_GENERATIVE_AI_API_KEY="?([^"\n]+)"?/);
    apiKey = match ? match[1] : null;
} catch (e) {
    console.error("Could not read .env file");
}

if (!apiKey) {
    console.error("API Key not found in .env");
    process.exit(1);
}

async function listModels() {
    console.log("Fetching models with key: " + apiKey.substring(0, 5) + "...");
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            console.log("Available Models for generateContent:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log("No models found or error structure:");
            console.log(JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error("Error fetching models:", error);
    }
}

listModels();
