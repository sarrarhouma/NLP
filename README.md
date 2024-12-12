NLP Recipe Title Prediction
This project leverages Natural Language Processing (NLP) and Deep Learning to predict recipe titles based on a list of ingredients. The project includes a full-stack implementation with a FastAPI backend and a React frontend for a seamless user experience.

Features
Frontend: React
🎙️ Audio Input:
Record or upload an audio file containing ingredients, which the application processes to predict a recipe.
🖼️ Image Suggestions:
Automatically fetches related food images using a search API based on the predicted recipe title.
🔎 Keyword Search:
Users can manually search for recipes by entering ingredients or keywords.
🎨 Interactive UI:
User-friendly design with visually appealing components such as navbar, recommendations, and animations.
Backend: FastAPI
🤖 Recipe Title Prediction:
Uses a TensorFlow-based machine learning model (recipe_model.h5) to predict recipe titles.
📝 Ingredient Extraction:
Extracts ingredients from text or audio inputs via speech-to-text processing.
🌐 API Integration:
Provides endpoints for handling audio processing and keyword-based recipe predictions.
Technologies Used
Frontend
React.js: Component-based library for building the user interface.
Axios: To send HTTP requests to the backend.
React Icons: For interactive and modern-looking icons.
CSS: Custom styling for responsive and attractive designs.
Backend
FastAPI: Lightweight web framework for API development.
TensorFlow/Keras: Framework for training and running deep learning models.
Pydub & SpeechRecognition: For audio file handling and transcription.
JSON: To manage model resources like the tokenizer and recipe titles.
How It Works
Frontend Input:

The user uploads an audio file, records their voice, or enters a keyword search.
For audio, the application converts the speech into text using browser APIs and sends it to the backend.
Backend Prediction:

The backend processes the ingredients and predicts the recipe title using a pre-trained TensorFlow model.
The result is returned to the frontend.
Image Suggestions:

Based on the predicted title, the application searches for related food images and displays them.
Setup Instructions
Frontend Setup
Navigate to the frontend folder:
cd frontend
Install dependencies:
npm install
Start the React application:
npm start
Access the application at http://localhost:3000.
Backend Setup
Navigate to the backend folder:
cd backend
Install dependencies:
pip install -r requirements.txt
Start the FastAPI application:
uvicorn main:app --reload
Access the API at http://localhost:8000.
Endpoints
Backend API
POST /predict/:
Accepts audio files for processing and returns the predicted recipe title and extracted ingredients.
POST /search/:
Accepts a keyword search or list of ingredients and returns the predicted recipe title.
Future Enhancements
🌍 Add support for multiple languages.
📊 Provide detailed nutritional information for recipes.
📱 Deploy the app as a Progressive Web App (PWA) for offline functionality.
☁️ Host the application on a cloud platform (AWS, Azure, etc.).
Contributing
Feel free to contribute to the project by:

Reporting issues.
Suggesting new features.
Submitting pull requests.
Acknowledgements
Special thanks to all contributors and developers who supported this project.
