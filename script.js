let smileCount = 0;

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

// Fetch a random joke from a randomly selected file
async function fetchNewJoke() {
    try {
        // Generate a random number within the range of available joke files
        const minFileNumber = 1;
        const maxFileNumber = 6;
        const randomFileNumber = Math.floor(Math.random() * (maxFileNumber - minFileNumber + 1)) + minFileNumber;
        
        // Construct the file path using the random number
        const selectedFile = `jokes/jokes${randomFileNumber}.json`;

        // Fetch jokes from the selected file
        const response = await fetch(selectedFile);
        const jokes = await response.json();

        // Pick a random joke from the array
        const randomJokeIndex = Math.floor(Math.random() * jokes.length);
        const joke = jokes[randomJokeIndex];

        document.getElementById("jokeContainer").innerText = joke || "Couldn't fetch a joke. Please try again!";
    } catch (error) {
        console.error("Error loading joke:", error);
        document.getElementById("jokeContainer").innerText = "Error loading joke. Please try again!";
    }
}

// Increment smile count and update display
function incrementSmileCounter() {
    smileCount++;
    document.getElementById("smileCount").innerText = `Total Smiles: ${smileCount}`;
}
