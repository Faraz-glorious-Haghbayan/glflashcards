const images = {
    apple: "https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg",
    banana: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg",
    dog: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Golden_Retriever_1.jpg",
    cat: "https://upload.wikimedia.org/wikipedia/commons/a/a3/June_odd-eyed-cat.jpg",
    car: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Car.jpg",
};




document.getElementById("flashcard-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const term = document.getElementById("term").value.trim().toLowerCase();
    const translation = document.getElementById("translation").value.trim().toLowerCase();

    if (term && translation) {
        const flashcard = document.createElement("div");
        flashcard.classList.add("flashcard");

        const termElem = document.createElement("div");
        termElem.classList.add("term");
        termElem.textContent = term;

        const translationElem = document.createElement("div");
        translationElem.classList.add("translation");
        translationElem.textContent = translation;

        flashcard.appendChild(termElem);
        flashcard.appendChild(translationElem);

        // Check if the term has an associated image
        if (images[term]) {
            const imgElem = document.createElement("img");
            imgElem.src = images[term];
            imgElem.alt = term;
            flashcard.appendChild(imgElem);
        }

        const buttonsElem = document.createElement("div");

        const speakButton = document.createElement("button");
        speakButton.textContent = "Speak";
        speakButton.classList.add("speak");
        speakButton.addEventListener("click", function() {
            readOutLoud(term, translation);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function() {
            flashcard.remove();
        });

        buttonsElem.appendChild(speakButton);
        buttonsElem.appendChild(deleteButton);
        flashcard.appendChild(buttonsElem);

        document.getElementById("flashcards-list").appendChild(flashcard);

        document.getElementById("term").value = "";
        document.getElementById("translation").value = "";
    }
});

function readOutLoud(term, translation) {
    const utteranceTerm = new SpeechSynthesisUtterance(`English: ${term}`);
    const utteranceTranslation = new SpeechSynthesisUtterance(`German: ${translation}`);
    
    utteranceTerm.lang = 'en-US';
    utteranceTranslation.lang = 'de-DE';
    
    utteranceTerm.pitch = 1.1;
    utteranceTerm.rate = 0.9;
    utteranceTerm.volume = 1;
    
    utteranceTranslation.pitch = 1.1;
    utteranceTranslation.rate = 0.9;
    utteranceTranslation.volume = 1;
    
    const voices = speechSynthesis.getVoices();
    utteranceTerm.voice = voices.find(voice => voice.lang === 'en-US' && voice.name.includes('Google')) || voices[0];
    utteranceTranslation.voice = voices.find(voice => voice.lang === 'de-DE' && voice.name.includes('Google')) || voices[0];
    
    speechSynthesis.speak(utteranceTerm);
    speechSynthesis.speak(utteranceTranslation);
}
document.getElementById('search-bar').addEventListener('input', function() {
    const query = this.value.toLowerCase();

    document.querySelectorAll('.flashcard').forEach(card => {
        const termElem = card.querySelector('.term');
        const translationElem = card.querySelector('.translation');

        if (termElem && translationElem) {
            const term = termElem.textContent.toLowerCase();
            const translation = translationElem.textContent.toLowerCase();

            if (term.includes(query) || translation.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
});
document.getElementById("dark-mode-toggle").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");

    document.querySelectorAll('.flashcard').forEach(card => {
        card.classList.toggle("dark-mode");
    });
});
const startQuizBtn = document.getElementById('start-quiz');
const quizSection = document.getElementById('quiz-section');
const quizCard = document.getElementById('quiz-card');
const showAnswerBtn = document.getElementById('show-answer');
const nextQuestionBtn = document.getElementById('next-question');

let flashcards = []; // Store flashcards here
let currentCardIndex = 0;

startQuizBtn.addEventListener('click', function() {
    flashcards = Array.from(document.querySelectorAll('.flashcard'));
    currentCardIndex = 0;
    showQuizCard();
    quizSection.style.display = 'block';
});

showAnswerBtn.addEventListener('click', function() {
    const translationElem = flashcards[currentCardIndex].querySelector('.translation');
    quizCard.textContent = `Answer: ${translationElem.textContent}`;
});

nextQuestionBtn.addEventListener('click', function() {
    currentCardIndex++;
    if (currentCardIndex >= flashcards.length) {
        currentCardIndex = 0; // Restart the quiz
    }
    showQuizCard();
});

function showQuizCard() {
    const termElem = flashcards[currentCardIndex].querySelector('.term');
    quizCard.textContent = `Question: What is the translation for "${termElem.textContent}"?`;
}


let points = 0;

nextQuestionBtn.addEventListener('click', function() {
    const translationElem = flashcards[currentCardIndex].querySelector('.translation');
    if (quizCard.textContent.includes(translationElem.textContent)) {
        points += 10;
    }
    updatePointsDisplay();
});

function updatePointsDisplay() {
    document.getElementById('points-display').textContent = `Points: ${points}`;
}
function checkForBadges() {
    if (points >= 100 && !document.getElementById('badge-100')) {
        const badge = document.createElement('div');
        badge.id = 'badge-100';
        badge.textContent = '🏅 100 Points Badge!';
        document.getElementById('quiz-section').appendChild(badge);
    }
}

function updatePointsDisplay() {
    document.getElementById('points-display').textContent = `Points: ${points}`;
    checkForBadges();
}
