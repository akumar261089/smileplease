let smileCount = 0;
let userLocation = {};
let userIP = "";



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

// Event listeners for buttons
document.addEventListener("DOMContentLoaded", async () => {

    fetchNewJokeOrImage();

    fetchRandomQuote();

    document.getElementById("smileButton").addEventListener("click", () => {
        incrementSmileCounter();
        fetchNewJokeOrImage();
    });

    document.getElementById("tryAgainButton").addEventListener("click", () => {
        fetchNewJokeOrImage();
    });
});

// Fetch a joke
async function fetchNewJokeOrImage() {
    try {
        const response = await fetch("https://v2.jokeapi.dev/joke/Any?type=single");
        const data = await response.json();
        document.getElementById("jokeContainer").innerText = data.joke || "Couldn't fetch a joke. Please try again!";
    } catch (error) {
        document.getElementById("jokeContainer").innerText = "Error loading joke. Please try again!";
    }
}

// Fetch user details
async function fetchUserDetails() {
    try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        userIP = data.ip;
        userLocation = { city: data.city, region: data.region, country: data.country_name };
    } catch (error) {
        console.error("Error fetching user details:", error);
    }
}

// Increment smile count and commit to GitHub
async function incrementSmileCounter() {
    smileCount++;
    document.getElementById("smileCount").innerText = `Total Smiles: ${smileCount}`;

}

