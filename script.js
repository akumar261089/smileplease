// Initialize smile count from localStorage or set it to 0
let smileCount = parseInt(localStorage.getItem("smileCount")) || 0;
let userLocation = {};
let userIP = "";
// Retrieve previously displayed jokes from localStorage or initialize as an empty array
let displayedJokes = JSON.parse(localStorage.getItem("displayedJokes")) || [];

// Display the initial smile count on page load
document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById("smileCount").innerText = `Total Smiles: ${smileCount}`;
    await fetchUserLocation();  // Fetch location and joke after page loads
    fetchNewJoke();
    fetchRandomQuote();

    document.getElementById("smileButton").addEventListener("click", () => {
        incrementSmileCounter();
        fetchNewJoke();
    });

    document.getElementById("tryAgainButton").addEventListener("click", () => {
        fetchNewJoke();
    });
});

// Fetch user location data
async function fetchUserLocation() {
    try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        userLocation = {
            country: data.country_name || "Unknown",
            city: data.city || "Unknown",
            region: data.region || "Unknown",
        };
        console.log("User Location:", userLocation);
    } catch (error) {
        console.error("Error fetching user location:", error);
    }
}

// Fetch and display a random quote
async function fetchRandomQuote() {
    try {
        const response = await fetch('quotes.json');
        const quotes = await response.json();
        const randomIndex = Math.floor(Math.random() * quotes.length);
        document.getElementById("quote").textContent = `"${quotes[randomIndex]}"`;
    } catch (error) {
        console.error("Error fetching quotes:", error);
    }
}

// Fetch a new joke based on category (location-based, time-based, or common)
async function fetchNewJoke() {
    const maxRetries = 10;  // Prevent infinite loop if all jokes have been shown
    let joke = null;
    let selectedFile = "";
    let fileNumber, jokeIndex;
    let attempt = 0;

    try {
        while (attempt < maxRetries) {
            attempt++;

            // Randomly select a joke category: location-based, time-based, or common
            const jokeCategory = Math.floor(Math.random() * 5); // 0 for location, 1 for time, 3 for common, 2 for loaction + time . adding mjore weight to common

            if (jokeCategory === 0) {
                // Location-based joke
                if (userLocation.country === "India") {
                    selectedFile = "jokes/jokes_india.json";
                } else {
                    selectedFile = "jokes/jokes_world.json";  // Default for other countries
                }
            } else if (jokeCategory === 1) {
                // Time-based joke
                const currentHour = new Date().getHours();
                selectedFile = currentHour < 12 ? "jokes/jokes_morning.json" : "jokes/jokes_evening.json";
            } else if (jokeCategory === 2) {
                if (userLocation.country === "India") {
                    country = "india";
                } else {
                    country = "world";
                }

                // Time-based joke
                const currentHour = new Date().getHours();
                selectedFile = currentHour < 12 ? `jokes/jokes_${country}_morning.json` : `jokes/jokes_${country}_evening.json`;
            } else {
                // Common joke (jokes1 to jokes6)
                const minFileNumber = 1;
                const maxFileNumber = 6;
                fileNumber = Math.floor(Math.random() * (maxFileNumber - minFileNumber + 1)) + minFileNumber;
                selectedFile = `jokes/jokes${fileNumber}.json`;
            }

            // Fetch jokes from the selected file
            const response = await fetch(selectedFile);
            const jokes = await response.json();

            // Pick a random joke from the array
            jokeIndex = Math.floor(Math.random() * jokes.length);
            joke = jokes[jokeIndex];

            // Check if this joke has been displayed
            if (!isJokeDisplayed(selectedFile, jokeIndex)) {
                // Mark this joke as displayed
                displayedJokes.push({ file: selectedFile, index: jokeIndex });
                localStorage.setItem("displayedJokes", JSON.stringify(displayedJokes));
                break;
            }
        }

        // Display the selected joke or fallback text if all jokes have been shown
        document.getElementById("jokeContainer").innerText = joke || "No more new jokes available. Please try again!";
        
    } catch (error) {
        resetDisplayedJokes();
        console.log("Resetting jokes cache:", error);
    }
}

// Function to reset the displayed jokes array
function resetDisplayedJokes() {
    displayedJokes = [];  // Clear the in-memory array
    localStorage.setItem("displayedJokes", JSON.stringify(displayedJokes));  // Update localStorage
    console.log("Displayed jokes history has been reset.");
    alert("Joke history reset! Enjoy fresh jokes again.");  // Optional alert to confirm reset
}

// Check if the joke has already been displayed
function isJokeDisplayed(selectedFile, jokeIndex) {
    return displayedJokes.some(j => j.file === selectedFile && j.index === jokeIndex);
}

// Increment smile count, update display, and store it in localStorage
function incrementSmileCounter() {
    smileCount++;
    localStorage.setItem("smileCount", smileCount);
    document.getElementById("smileCount").innerText = `Total Smiles: ${smileCount}`;
}
