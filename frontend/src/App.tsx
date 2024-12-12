import { useEffect, useState } from "react";
import "./index.css";
import axios from "axios";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import ImageList from "./components/ImageList";
import searchImages from "./api";
import { FaSearch, FaMicrophone, FaUpload } from "react-icons/fa";

function App() {
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const backgroundStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1, // Ensure the background stays behind all other content
    backgroundImage: `url('https://res.cloudinary.com/dzzxmgzqz/image/upload/v1733925447/17e86db384a81_xkuelp.png')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "blur(8px)",
  };

  const navbarStyle = {
    position: "sticky", // Ensures the navbar remains at the top
    top: 0,
    zIndex: 100, // Keep above other content
    backgroundColor: "#fff", // White background
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Add a subtle shadow for clarity
  };

  const contentStyle = {
    position: "relative",
    zIndex: 1, // Ensure the content stays above the background
    padding: "20px",
  };

  const recommendations = [
    {
      title: <b>For Diabetics</b>,
      description:
        "Explore low-sugar recipes to maintain a balanced diet without sacrificing flavor. Our top recommendation: Grilled Salmon with Steamed Veggies.",
      image: "https://res.cloudinary.com/dzzxmgzqz/image/upload/v1733927027/dia_epurbn.jpg",
    },
    {
      title: <b>For Vegetarians</b>,
      description:
        "Savor plant-based dishes packed with nutrients and delicious flavors. Try our favorite: Vegetarian Pesto Pasta.",
      image: "https://res.cloudinary.com/dzzxmgzqz/image/upload/v1733927028/vege_lbg44a.jpg",
    },
    {
      title: <b>Today's Special</b>,
      description: "Don’t miss out on our chef’s choice for the day: Lemon Butter Chicken.",
      image: "https://res.cloudinary.com/dzzxmgzqz/image/upload/v1733927028/spec_hybmsx.jpg",
    },
  ];

  // Animation Handlers
  const handleMouseEnter = (e) => {
    const card = e.currentTarget;
    card.style.transform = "translateY(-10px)";
    card.style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.2)";
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = "translateY(0)";
    card.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.1)";
  };

  useEffect(() => {
    console.log("App re-rendered");
  });

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle recorded audio
  const handleAudioRecording = async () => {
    if (isRecording) return; // Prevent multiple recordings

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      setIsRecording(true);

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        setIsRecording(false);
        stream.getTracks().forEach((track) => track.stop()); // Stop all tracks
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("file", audioBlob, "recorded_audio.webm");
        processAudio(formData);
      };

      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 5000); // Record for 5 seconds
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Failed to access microphone. Please check permissions.");
      setIsRecording(false);
    }
  };

  // Process uploaded or recorded audio
  const processAudio = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/predict/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setTitle(response.data.message);
      setIngredients(response.data.ingredients);
    } catch (error) {
      console.error("Error processing audio:", error);
      alert("Failed to process audio.");
    } finally {
      setLoading(false);
    }
  };

  // Handle audio file upload
  const sendAudio = () => {
    if (!selectedFile) {
      alert("Please upload an audio file.");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    processAudio(formData);
  };

  // Fetch related images
  useEffect(() => {
    if (title) {
      search(title + " food");
    }
  }, [title]);

  const search = async (term) => {
    try {
      const result = await searchImages(term);
      setImages(result);
    } catch (error) {
      console.error("Error fetching images:", error);
      alert("Failed to fetch images.");
    }
  };

  // Handle manual search
  const handleSearch = () => {
    searchRecipe();
  };

  const searchRecipe = async () => {
    if (searchTerm.trim() === "") {
      alert("Please enter ingredients to search.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/search/", {
        ingredients: searchTerm, // Envoyer les ingrédients saisis
      });

      setTitle(response.data.recipe); // Mettre à jour le titre de la recette
      setIngredients([]); // Réinitialiser la liste des ingrédients
      search(response.data.recipe + " food"); // Appeler la recherche d'images
    } catch (error) {
      console.error("Error searching for recipe:", error);
      alert("Failed to search for recipe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Background */}
      <div style={backgroundStyle}></div>

      <div style={navbarStyle}>
        <Navbar />
      </div>


      {/* Main content */}
      <div style={contentStyle}>
        <div className="container m-auto mt-8">
          <p className="text-lg mb-4 mt-10">
            Upload or record an audio file, or search by keyword to find recipes.
          </p>

          <div className="flex gap-4 items-center mb-4">
          <input
            type="text"
            placeholder="Enter a keyword to search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-lg border-2 border-[#F1797E] rounded-md p-2 w-full"
          />
          <button
            className="text-white rounded-md px-4 py-1 bg-[#F1797E] font-bold text-xl"
            onClick={handleSearch}
          >
            <FaSearch />
          </button>
        </div>

        <div className="flex gap-4 items-center">
          <input
            type="file"
            accept=".mp3,.wav,.webm"
            onChange={handleFileChange}
            className="text-lg border-2 border-[#F1797E] rounded-md p-2"
          />
          <button
            className="text-white rounded-md px-4 py-1 bg-[#F1797E] font-bold text-xl"
            onClick={sendAudio}
            disabled={loading || isRecording}
          >
            {loading ? (
              <span>Processing...</span> // Si en traitement, garde le texte pour l'animation
            ) : (
              <FaUpload /> // Remplace le texte par l'icône d'upload
            )}
          </button>
          <button
            className={`text-white rounded-md px-4 py-1 ${
              isRecording ? "bg-gray-400" : "bg-[#F1797E]"
            } font-bold text-xl`}
            onClick={handleAudioRecording}
            disabled={isRecording}
          >
            {isRecording ? (
              <span>Recording...</span> // Affiche "Recording..." pendant l'enregistrement
            ) : (
              <FaMicrophone /> // Remplace le texte par l'icône de microphone
            )}
          </button>
        </div>

        {title && (
          <div className="flex justify-between p-8">
            <div className="bg-opacity-80 h-auto rounded-md flex flex-col">
              <h2 className="text-black text-2xl font-bold mb-2">
                Recipe for
                <span className="text-[#F1797E] ml-2">{title}</span>
              </h2>

              {ingredients.length > 0 && (
                <div className="mt-4">
                  <p className="text-black font-semibold text-2xl">
                    Ingredients:
                  </p>
                  <ul className="list-disc ml-4 mt-4">
                    {ingredients.map((ingredient, index) => (
                      <li key={index} className="text-black text-xl uppercase">
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {searchTerm && !ingredients.length && (
                <div className="mt-4">
                  <p className="text-black font-semibold text-2xl">
                    Ingredients:
                  </p>
                  <ul className="list-disc ml-4 mt-4">
                    {searchTerm
                      .split(/[\s,]+/) // Sépare les ingrédients par espace ou virgule
                      .map((ingredient, index) => (
                        <li
                          key={index}
                          className="text-black text-xl uppercase"
                        >
                          {ingredient}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="w-1/2">
              <ImageList images={images} />
            </div>
          </div>
        )}
      </div>
          <h1
           style={{
            fontSize: "2.5rem", // Larger font size for emphasis
            fontWeight: "bold", // Make the text bold
            color: "#F1797E", // Retain the theme color
            textAlign: "center", // Center the text
            margin: "20px 0", // Add some spacing
            textTransform: "uppercase", // Make the title all uppercase for a professional look
            letterSpacing: "2px", // Add spacing between letters for clarity
          }}
        >
            Recommendations
          </h1>
          <p
            style={{
              fontSize: "1.25rem",
              color: "#555",
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            Discover curated recipes tailored for different dietary needs,
            including dishes for diabetics, vegetarians, and our daily specials.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {recommendations.map((item, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
                <div style={{ padding: "16px" }}>
                  <h3 style={{ fontSize: "1.25rem", color: "#F1797E" }}>
                    {item.title}
                  </h3>
                  <p style={{ color: "#555", lineHeight: "1.6" }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      

      {/* Footer */}
      <Footer />
    </>
  );
}

export default App;
