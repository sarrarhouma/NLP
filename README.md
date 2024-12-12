# NLP Recipe Title Prediction

This project leverages Natural Language Processing (NLP) and machine learning techniques to predict recipe titles based on a list of ingredients. It combines data preprocessing, audio-to-text conversion, and deep learning to provide accurate and meaningful recipe suggestions.

## Features
- 🥗 **Recipe Title Prediction**: Enter a list of ingredients, and the model predicts the recipe title.
- 🎙️ **Audio Input**: Upload an audio file with ingredients, and the application transcribes it to text for prediction.
- 🤖 **Machine Learning Model**: Powered by TensorFlow, the `recipe_model.h5` uses LSTM layers for sequence processing.
- 🌐 **FastAPI Integration**: A lightweight and fast web API backend for handling predictions and data processing.

## Technologies Used
- **Python**: Core programming language.
- **FastAPI**: Web framework for API endpoints.
- **TensorFlow/Keras**: Deep learning framework for model training and inference.
- **Pydub & SpeechRecognition**: Libraries for audio processing and transcription.
- **JSON**: To manage model resources (tokenizer and recipe titles).

## How It Works
1. The user inputs ingredients (text or audio).
2. The ingredients are processed and tokenized using a pretrained tokenizer.
3. A trained LSTM model (`recipe_model.h5`) predicts the most probable recipe title.
4. The application returns the predicted title along with any processed inputs.

## Use Cases
- **Culinary Assistance**: Suggest recipes based on ingredients available in the kitchen.
- **Audio Recipe Search**: Use voice commands to find recipes quickly.
- **Food Blogging**: Automate the generation of recipe titles for blogs or apps.

## Getting Started
To set up and run the project, follow these steps:
1. Clone the repository:
   ```bash
   git clone git@github.com:sarrarhouma/NLP.git
   cd NLP
2. Install the dependencies:
 ```bash
pip install -r requirements.txt

3. Run the FastAPI application:
 ```bash
uvicorn main:app --reload

4. Access the API at http://127.0.0.1:8000
