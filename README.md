# NLP Recipe Title Prediction

This project leverages **Natural Language Processing (NLP)** and machine learning techniques to predict recipe titles based on a list of ingredients. It combines a **FastAPI backend** and a **React frontend** for a seamless user experience.

## Features

- **Recipe Title Prediction**: Enter a list of ingredients, and the model predicts the most suitable recipe title.
- 🎙️ **Audio Input**: Upload an audio file with ingredients, and the application transcribes it to predict a recipe title.
- 🤖 **Machine Learning Model**: Powered by TensorFlow, the `recipe_model.h5` uses LSTM layers for sequence processing.
- 🌐 **FastAPI Integration**: A lightweight and fast web API backend for handling predictions and audio processing.
- 🖼️ **Image Suggestions**: Automatically fetches related food images based on the predicted recipe title.
- 🔎 **Keyword Search**: Users can manually search for recipes by entering keywords or ingredients.

## Technologies Used

### Frontend
- **React.js**: Component-based library for building the user interface.
- **Axios**: For HTTP requests to communicate with the backend.
- **React Icons**: Provides modern and visually appealing icons.
- **CSS**: Custom styling for responsive and attractive designs.

### Backend
- **FastAPI**: Lightweight Python web framework for building APIs.
- **TensorFlow/Keras**: Framework for training and running deep learning models.
- **Pydub & SpeechRecognition**: Libraries for audio file processing and transcription.
- **JSON**: Used for managing resources like tokenizers and recipe titles.

## How It Works

1. **Frontend Input**:
   - The user uploads an audio file, records their voice, or enters a keyword search.
   - For audio inputs, the application converts speech into text using browser APIs and sends it to the backend.

2. **Backend Prediction**:
   - The backend processes the input and uses the TensorFlow model to predict the most relevant recipe title.

3. **Image Suggestions**:
   - Based on the predicted title, the frontend fetches related images and displays them.


## Setup Instructions

### Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
2. Install dependencies:
    ```bash
    npm install
3. Start the React application:
     ```bash
   npm start
5. Access the application:http://localhost:3000
### Backend Setup
Navigate to the backend folder:
cd backend

Install dependencies:
pip install -r requirements.txt

Start the FastAPI application:
uvicorn main:app --reload

Access the API at http://localhost:8000
### API Endpoints
Backend API
POST /predict/:
Accepts an audio file and returns the predicted recipe title and extracted ingredients.
POST /search/:
Accepts a keyword or ingredient list and returns the predicted recipe title.
### Future Enhancements
🌍 Add support for multiple languages.
📊 Provide nutritional information for predicted recipes.
📱 Deploy the app as a Progressive Web App (PWA) for offline functionality.
☁️ Host the application on a cloud platform like AWS or Azure.
Contributing
Contributions are welcome! You can help by:

### Reporting issues.
Suggesting new features.
Submitting pull requests.
Acknowledgements
Special thanks to everyone who contributed to this project.
     ![Capture d'écran 2024-12-12 170715](https://github.com/user-attachments/assets/4db70693-1366-4785-b7cd-8df737282577)

   
    
