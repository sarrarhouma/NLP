from fastapi import FastAPI, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydub import AudioSegment #pydub Manipule et convertit des fichiers audio.
import os
import speech_recognition as sr # Convertit des fichiers audio en texte
import tensorflow as tf #pour prédire les titres de recettes
from tensorflow.keras.models import load_model
from keras.preprocessing.text import tokenizer_from_json
from tensorflow.keras.preprocessing.sequence import pad_sequences
from pydantic import BaseModel #Gère les structures de données et les validations
import json

app = FastAPI() #Permet de créer une application web pour gérer des requêtes HTTP.

class IngredientRequest(BaseModel):
    ingredients: str

#Autorise toutes les origines et méthodes pour faciliter les tests locaux ou les intégrations
# Configure CORS => est un mécanisme de sécurité utilisé par les navigateurs web
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the TensorFlow model and tokenizer
model = load_model("recipe_model.h5")
with open("tokenizer.json", "r") as json_file:
    tokenizer_json = json_file.read()
    tokenizer = tokenizer_from_json(tokenizer_json)
    print(model.summary())

# Load titles from the JSON file
try:
    with open("titles.json", "r") as title_file:
        titles_json = title_file.read()
        if titles_json:
            titles_list = json.loads(titles_json)  # A list of recipe titles
        else:
            titles_list = []
            print("The file 'titles.json' is empty.")
except json.decoder.JSONDecodeError as e:
    print(f"Error decoding JSON: {e}")
except FileNotFoundError:
    titles_list = []
    print("File 'titles.json' not found.")

# Utility functions for audio processing
def convert_audio_to_wav(audio_file_path, wav_file_path, input_format):
    audio = AudioSegment.from_file(audio_file_path, format=input_format)
    audio.export(wav_file_path, format="wav")
    return wav_file_path

def audio_to_text(file_path: str) -> str:
    recognizer = sr.Recognizer()
    with sr.AudioFile(file_path) as source:
        audio_data = recognizer.record(source)
        try:
            # Recognize speech using Google Web Speech API
            text = recognizer.recognize_google(audio_data)
            print("Transcribed Text:", text)  # For debugging
            return text
        except sr.UnknownValueError:
            raise HTTPException(status_code=400, detail="Could not understand the audio")
        except sr.RequestError:
            raise HTTPException(status_code=500, detail="Speech Recognition service unavailable")

def extract_ingredients_from_text(text: str) -> list:
    # Tokenize the input text
    words = text.split()  # Split by spaces, you can improve this for better tokenization
    # Convert tokenizer word list to a set for quick lookup
    tokenizer_words = set(tokenizer.word_index.keys())  # Extract words from tokenizer
    ingredients_found = []

    # Compare each word in the transcribed text with tokenizer words
    for word in words:
        if word.lower() in tokenizer_words:  # Compare in lowercase to handle case sensitivity
            ingredients_found.append(word)

    return ingredients_found

def get_ingredient_indices(ingredient_sequence):
    """
    Cette fonction prend une séquence d'indices et retourne les ingrédients correspondants.
    """
    ingredients = []
    # word_index contient la correspondance entre les mots et leurs indices
    reverse_word_index = {v: k for k, v in tokenizer.word_index.items()}
    
    for index in ingredient_sequence:
        if index in reverse_word_index:
            ingredients.append(reverse_word_index[index])  # Ajouter l'ingrédient (mot) à la liste
        else:
            ingredients.append("<unknown>")  # Si l'indice n'a pas de correspondance

    return 
    

# Routes
@app.get("/")
def get_prediction(ingredients: str):
    new_ingredients_sequence = tokenizer.texts_to_sequences([ingredients])
    new_ingredients_sequence_padded = pad_sequences(new_ingredients_sequence, maxlen=90)
    predicted_title_index = int(model.predict(new_ingredients_sequence_padded).argmax())
    predicted_title = titles_list[predicted_title_index]
    return {"message": predicted_title}

@app.post("/predict/")
async def predict_from_audio(file: UploadFile = None): #uploadFile Gère les fichiers uploadés via une requête HTTP
    if not file:
        raise HTTPException(status_code=400, detail="No file provided.")

    allowed_extensions = [".mp3", ".wav", ".webm"]
    if not any(file.filename.endswith(ext) for ext in allowed_extensions):
        raise HTTPException(status_code=400, detail="Invalid file type. Supported formats: mp3, wav, webm.")

    file_location = f"temp_{file.filename}"
    with open(file_location, "wb") as buffer:
        buffer.write(await file.read())

    wav_file_location = file_location.replace(".mp3", ".wav").replace(".webm", ".wav")
    if file.filename.endswith(".mp3"):
        file_location = convert_audio_to_wav(file_location, wav_file_location, "mp3")
    elif file.filename.endswith(".webm"):
        file_location = convert_audio_to_wav(file_location, wav_file_location, "webm")

    ingredients_text = audio_to_text(file_location)
    os.remove(file_location)

    if ingredients_text in ["Speech not understood", "API error"]:
        return {"error": ingredients_text}

    # Extraire les ingrédients du texte
    ingredients = extract_ingredients_from_text(ingredients_text)

    # Tokenisation et prédiction du titre
    new_ingredients_sequence = tokenizer.texts_to_sequences([ingredients_text])
    new_ingredients_sequence_padded = pad_sequences(new_ingredients_sequence, maxlen=90)
    predicted_title_index = int(model.predict(new_ingredients_sequence_padded).argmax())
    predicted_title = titles_list[predicted_title_index]

    return {"message": predicted_title, "text": ingredients_text, "ingredients": ingredients}


@app.post("/search/")
async def search_recipe(data: IngredientRequest):
    try:
        # Extract the ingredients from the request body
        ingredients = data.ingredients

        # Tokenize the ingredients input
        sequence = tokenizer.texts_to_sequences([ingredients])
        padded_sequence = pad_sequences(sequence, maxlen=90)  # Utilisez maxlen=90 ici

        # Predict using the model
        prediction = model.predict(padded_sequence)

        # Get the index of the highest probability (most likely recipe)
        predicted_index = prediction.argmax()  # Assuming the model outputs probabilities

        # Return the predicted recipe title
        if 0 <= predicted_index < len(titles_list):
            recipe_title = titles_list[predicted_index]
            return {"recipe": recipe_title}
        else:
            raise HTTPException(status_code=404, detail="Recipe not found")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
