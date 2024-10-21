// Utility function to get an element by selector
function get(selector, root = document) {
    return root.querySelector(selector);
}

// Utility function to format the current date and time
function formatDate(date) {
    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();
    return `${h.slice(-2)}:${m.slice(-2)}`;
}

// Get references to DOM elements
const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

// Constants for bot and user images and names
const BOT_IMG = "robot.jpg"; // Ensure this image is in the same directory as the HTML file
const PERSON_IMG = "humanimage.png"; // Ensure this image is in the same directory as the HTML file
const BOT_NAME = "Medical Bot";
const PERSON_NAME = "You";

// Arrays for bot's responses based on user input
const prompts = [
    ["hi", "hey", "hello", "good morning", "good afternoon"],  // Greetings
    ["how are you", "how is life", "how are things"],  // Asking how the bot is
    ["what are you doing", "what's going on", "what is up"],  // Asking about the bot's activity
    ["how old are you"],  // Asking about the bot's age
    ["who are you", "are you human", "are you a bot", "are you human or bot"],  // Asking about the bot's identity
    ["who created you", "who made you"],  // Asking about the bot's creator
    ["your name please", "your name", "may i know your name", "what is your name", "what do you call yourself"],  // Asking the bot's name
    ["i am feeling sick", "i feel unwell", "i am not feeling well"],  // General symptoms
    ["i have a headache", "headache", "migraine", "pain in my head"],  // Headache symptoms
    ["fever", "temperature", "hot body", "high temperature"],  // Fever symptoms
    ["cough", "sore throat", "difficulty breathing"],  // Respiratory symptoms
    ["stomach pain", "abdominal pain", "cramps", "nausea"],  // Stomach symptoms
    ["cold", "runny nose", "sneezing", "stuffed nose"],  // Cold symptoms
    ["back pain", "lower back pain", "spinal pain"],  // Back pain symptoms
    ["rash", "skin irritation", "red spots", "itchy skin"],  // Skin symptoms
    ["my name is", "i am", "call me"],  // User introducing themselves
    ["suggest medicine", "suggest a medicine"]  // Request for medicine suggestions
];

const replies = [
    // Greetings replies
    ["Hi, how can I assist you today?", "Hello! What can I do for you?", "Hey there! How can I help you?"],
    
    // Replies to "how are you"
    ["I'm fine, thank you. How are you?", "I'm doing well, how about you?", "I'm great, thanks for asking! How are you?"],
    
    // Replies to "what are you doing"
    ["I'm here to assist you with medical information.", "I'm ready to help you with your questions.", "Just waiting to provide some advice. How can I assist you today?"],
    
    // Replies to "how old are you"
    ["I am ageless.", "I exist outside the bounds of time."],
    
    // Replies to "who are you"
    ["I am a virtual medical assistant here to provide you with information.", "I'm a chatbot created to help with medical inquiries.", "I'm a digital assistant programmed to provide medical advice."],
    
    // Replies to "who created you"
    ["I was created by a software developer passionate about health technology.", "A team of engineers and medical professionals developed me.", "I was built to assist users with medical questions."],
    
    // Replies to "your name"
    ["I don't have a specific name, but you can call me Medical Bot.", "I'm known as the Medical Bot.", "I am your friendly medical assistant bot."],
    
    // General symptom replies
    ["I'm sorry to hear you're not feeling well. Could you please describe your symptoms?", "It sounds like you might need some rest. Can you tell me more about your symptoms?", "Please describe how you're feeling so I can assist you better."],
    
    // Headache-specific replies
    ["It sounds like you might have a tension headache or a migraine. You could consider taking a pain reliever like ibuprofen or acetaminophen. Resting in a quiet, dark room and staying hydrated might also help. If the pain persists, please consult a healthcare provider."],
    
    // Fever-specific replies
    ["Fever can often be a sign of an infection. It's important to stay hydrated, rest, and consider taking acetaminophen or ibuprofen to reduce your fever. If your temperature exceeds 102°F (39°C) or you experience additional symptoms, please consult a healthcare provider."],
    
    // Respiratory symptoms replies
    ["If you're experiencing a cough, sore throat, or difficulty breathing, it could be a sign of a respiratory infection. It's important to stay hydrated, use throat lozenges or cough suppressants, and rest. If symptoms worsen or persist, seek medical attention."],
    
    // Stomach symptoms replies
    ["Stomach pain, cramps, or nausea could be due to indigestion or a mild gastrointestinal issue. Over-the-counter medications like antacids (Tums, Pepto-Bismol) might help. If pain is severe or accompanied by other symptoms, consult a healthcare provider."],
    
    // Cold symptoms replies
    ["Cold symptoms like a runny nose, sneezing, or a stuffed nose can be managed with antihistamines or decongestants, as well as staying hydrated and resting. If symptoms persist, consider consulting a healthcare provider."],
    
    // Back pain symptoms replies
    ["Back pain could result from a strain or a minor injury. Over-the-counter pain relievers, applying heat or cold packs, and gentle stretching may provide relief. If the pain is severe or lasts longer than a few days, seek medical advice."],
    
    // Skin symptoms replies
    ["Skin irritations like rashes or itchy skin could be due to allergies or contact with irritants. Over-the-counter antihistamines or hydrocortisone cream may provide relief. If the rash persists or worsens, please consult a healthcare provider."],
    
    // User introduction replies
    ["Nice to meet you, [name]. How can I assist you today?", "Hello [name], how can I help you today?", "Hi [name], what can I do for you today?"],
    
    // Medicine suggestion clarification replies
    ["Please specify the symptoms for which you want a medicine suggestion, or describe how you're feeling for tailored advice."]
];

// Conversation state to handle follow-ups
let lastBotQuestion = "";

// **Bot starts the conversation**
document.addEventListener("DOMContentLoaded", () => {
    botMessage("Hi, welcome to the chatbot! Go ahead and send a message. 🙂");
});

// Event listener for the form submission
msgerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const userInput = msgerInput.value.toLowerCase().trim();
    if (!userInput) return;

    addChat(PERSON_NAME, PERSON_IMG, "right", userInput);
    msgerInput.value = "";

    // Handle response generation
    setTimeout(() => {
        generateResponse(userInput);
    }, 1000);
});

// Function to generate a response from the bot
function generateResponse(input) {
    let response;
    
    // Handle follow-up response if the last question from the bot was "How are you?"
    if (lastBotQuestion === "how are you" && input.match(/\bfine\b|\bgood\b|\bgreat\b/)) {
        response = "Nice to hear that.";
        lastBotQuestion = ""; // Reset state
        addChat(BOT_NAME, BOT_IMG, "left", response);
        return;
    }

    // Check if the input includes "my name is" and extract the name
    if (input.includes("my name is")) {
        const name = input.split("my name is ")[1];
        response = `Hi ${name.charAt(0).toUpperCase() + name.slice(1)}, how can I assist you?`;
        addChat(BOT_NAME, BOT_IMG, "left", response);
        lastBotQuestion = input; // Update state
        return;
    }

    // Check if input requests for medicine suggestions
    if (input.includes("suggest medicine") || input.includes("suggest a medicine")) {
        response = "Please specify the symptom for which you want a medicine suggestion, or describe how you're feeling for tailored advice.";
        addChat(BOT_NAME, BOT_IMG, "left", response);
        lastBotQuestion = ""; // Reset state
        return;
    }

    // Standard responses based on matching prompts
    for (let i = 0; i < prompts.length; i++) {
        if (prompts[i].some(p => input.includes(p))) {
            response = replies[i][Math.floor(Math.random() * replies[i].length)];
            
            if (response.includes("[name]")) {
                response = response.replace("[name]", input.split("my name is ")[1]);
            }
            
            addChat(BOT_NAME, BOT_IMG, "left", response);
            if (prompts[i].includes("how are you")) {
                lastBotQuestion = "how are you"; // Track state for follow-up
            } else {
                lastBotQuestion = ""; // Reset state for other responses
            }
            return;
        }
    }
    
    // Default fallback response if no prompt matches
    response = "I'm not sure how to respond to that. Can you please clarify?";
    addChat(BOT_NAME, BOT_IMG, "left", response);
    lastBotQuestion = ""; // Reset state
}

// Function to add chat bubbles to the chat area
function addChat(name, img, side, text) {
    const msgHTML = `
        <div class="msg ${side}-msg">
            <div class="msg-img" style="background-image: url(${img})"></div>
            <div class="msg-bubble">
                <div class="msg-info">
                    <div class="msg-info-name">${name}</div>
                    <div class="msg-info-time">${formatDate(new Date())}</div>
                </div>
                <div class="msg-text">${text}</div>
            </div>
        </div>
    `;
    
    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTop += 500;
}

// Voice recognition setup
function startVoiceRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        addChat(PERSON_NAME, PERSON_IMG, "right", transcript);
        generateResponse(transcript);
    };
    
    recognition.onerror = (event) => {
        console.error("Voice recognition error:", event.error);
        botMessage("Sorry, I couldn't recognize what you said. Please try typing your response.");
    };
    
    recognition.start();
}

// Initialize voice recognition on button click
get(".mic-button").addEventListener("click", startVoiceRecognition);

// Function to display initial bot message
function botMessage(message) {
    addChat(BOT_NAME, BOT_IMG, "left", message);
}
