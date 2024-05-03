// Get references to DOM elements
const textInput = document.getElementById("textInput");
const audioInput = document.getElementById("audioInput");
const generateButton = document.getElementById("generateButton");
const visualization = document.getElementById("visualization");

// Function to handle audio file selection
function handleAudioUpload(event) {
  const audioFile = event.target.files[0];
  if (!audioFile) return;

  // Use Web Audio API to analyze audio
  const audioContext = new AudioContext();
  analyzeAudio(audioFile, audioContext);
}

// Function to analyze audio using Web Audio API
async function analyzeAudio(audioFile, audioContext) {
  const audioSource = await audioContext.decodeAudioData(await audioFile.arrayBuffer());
  const analyser = audioContext.createAnalyser();

  // Define analysis options (adjust as needed)
  analyser.fftSize = 2048; // Number of frequency bins to analyze

  const sourceNode = audioContext.createBufferSource();
  sourceNode.buffer = audioSource;
  sourceNode.connect(analyser);
  analyser.connect(audioContext.destination);

  // Function to capture frequency and tempo data
  function captureAudioFeatures() {
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(frequencyData);

    // Calculate average frequency (example)
    let averageFrequency = 0;
    for (let i = 0; i < frequencyData.length; i++) {
      averageFrequency += frequencyData[i];
    }
    averageFrequency /= frequencyData.length;

    // Analyze tempo (implementation depends on chosen method)
    const tempo = analyzeTempo(audioContext); // Replace with your tempo analysis logic

    // Use these features to animate the text
    animateText(averageFrequency, tempo);

    // Schedule capturing features again for animation
    requestAnimationFrame(captureAudioFeatures);
  }

  sourceNode.start(0); // Start playing the audio
  captureAudioFeatures(); // Start capturing audio features
}

// Function to analyze tempo (replace with your preferred method)
function analyzeTempo(audioContext) {
  // Replace this with your chosen tempo analysis logic
  // This example just returns a placeholder value
  return 120; // Placeholder tempo (beats per minute)
}

// Function to animate the text based on features
function animateText(averageFrequency, tempo) {
  const words = textInput.value.split(" ");

  visualization.innerHTML = ""; // Clear previous visualization

  for (let i = 0; i < words.length; i++) {
    const span = document.createElement("span");
    span.textContent = words[i];

    // Modify styles based on frequency and tempo (example)
    span.style.fontSize = averageFrequency / 255 * 2 + "em";
    span.style.color = `hsl(${tempo % 360}, 100%, 50%)`;

    visualization.appendChild(span);
  }
}

// Event listeners
audioInput.addEventListener("change", handleAudioUpload);
generateButton.addEventListener("click", () => {
  // Handle button click (optional - can be used for other actions)
});
