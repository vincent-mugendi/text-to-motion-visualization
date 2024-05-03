document.addEventListener("DOMContentLoaded", function() {
    var soundInput = document.getElementById('soundInput');
    var audioFolder = "assets/audio/";
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();
    var audioBuffer = null;

    // Load the selected sound file
    function loadSound(url) {
        return fetch(url)
            .then(response => response.arrayBuffer())
            .then(buffer => audioContext.decodeAudioData(buffer));
    }

    audioContext.resume().then(() => {
        var audioFiles = [
            "sound1.wav",
            "sound2.wav",
            "sound3.wav"
        ];
        audioFiles.forEach(function(file) {
            var option = document.createElement("option");
            option.text = file;
            option.value = audioFolder + file;
            soundInput.appendChild(option);
        });
    });

    soundInput.addEventListener('change', function() {
        var selectedSound = soundInput.value;
        loadSound(selectedSound)
            .then(function(decodedBuffer) {
                audioBuffer = decodedBuffer;
            });
    });

    document.getElementById('generateButton').addEventListener('click', function() {
        var text = document.getElementById('textInput').value;
        if (!audioBuffer) {
            alert("Please select a sound.");
            return;
        }

        var visualization = document.getElementById('visualization');
        visualization.textContent = "Text: " + text + "\nSound: " + soundInput.value;

        var source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();

        // Animate the visualization
        var colors = ['#ff0000', '#00ff00', '#0000ff']; // Red, Green, Blue
        var chars = text.split('');
        var index = 0;
        var interval = setInterval(function() {
            if (index >= chars.length) {
                clearInterval(interval);
                return;
            }

            visualization.style.color = colors[index % colors.length];
            visualization.textContent = chars[index];
            index++;
        }, 200); // Change the interval as needed
    });
});
