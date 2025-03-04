// Bolivia Discovery Game - Main Game Logic

class BoliviaDiscoveryGame {
    constructor() {
        // Game state management
        this.gameState = {
            currentPlayer: null,
            currentRegion: null,
            currentChallenge: null,
            totalPoints: 0,
            unlockedRegions: [],
            earnedBadges: []
        };

        // Initialize event listeners
        this.initializeEventListeners();
    }

    // Initialize all event listeners
    initializeEventListeners() {
        // Navigation events
        this.setupNavigationEvents();

        // Profile creation events
        this.setupProfileCreationEvents();

        // Map interaction events
        this.setupMapInteractionEvents();

        // Challenge events
        this.setupChallengeEvents();
    }

    // Navigation between pages
    setupNavigationEvents() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = e.target.getAttribute('href').substring(1);
                this.navigateToPage(targetPage);
            });
        });
    }

    // Page navigation method
    navigateToPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    }

    // Profile Creation Logic
    setupProfileCreationEvents() {
        const profileForm = document.getElementById('profile-creation-form');
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.createPlayerProfile();
        });
    }

    // Create Player Profile
    createPlayerProfile() {
        const username = document.getElementById('username').value;
        const avatar = document.querySelector('input[name="avatar"]:checked')?.value;
        const difficulty = document.getElementById('difficulty').value;

        // Validate inputs
        if (!username || !avatar) {
            this.showErrorMessage('Please complete all profile details');
            return;
        }

        // Create player profile
        this.gameState.currentPlayer = {
            username,
            avatar,
            difficulty,
            createdAt: new Date()
        };

        // Update UI
        this.updateUserStatus();
        this.navigateToPage('map');
    }

    // Update user status in navigation
    updateUserStatus() {
        const usernameDisplay = document.getElementById('username-display');
        const pointsDisplay = document.getElementById('points-display');

        if (this.gameState.currentPlayer) {
            usernameDisplay.textContent = this.gameState.currentPlayer.username;
            pointsDisplay.textContent = `${this.gameState.totalPoints} Knowledge Points`;
        }
    }

    // Map Interaction Events
    setupMapInteractionEvents() {
        const regions = document.querySelectorAll('.region');
        regions.forEach(region => {
            region.addEventListener('click', (e) => {
                const regionId = e.target.dataset.region;
                this.selectRegion(regionId);
            });
        });
    }

    // Region Selection
    selectRegion(regionId) {
        // Check if region is unlocked
        if (!this.isRegionUnlocked(regionId)) {
            this.showErrorMessage('This region is not yet unlocked!');
            return;
        }

        this.gameState.currentRegion = regionId;
        this.updateRegionDetails(regionId);
        this.loadRegionChallenges(regionId);
    }

    // Check if region is unlocked
    isRegionUnlocked(regionId) {
        return this.gameState.unlockedRegions.includes(regionId) || 
               this.gameState.unlockedRegions.length === 0; // First region always unlocked
    }

    // Update Region Details
    updateRegionDetails(regionId) {
        const regionNameElement = document.getElementById('selected-region-name');
        const regionDescriptionElement = document.getElementById('region-description');

        // Region details (would typically come from a data source)
        const regionDetails = {
            'la-paz': {
                name: 'La Paz',
                description: 'The administrative capital of Bolivia, known for its unique geography and cultural richness.'
            },
            'santa-cruz': {
                name: 'Santa Cruz',
                description: 'The largest city in Bolivia, a hub of economic activity and biodiversity.'
            }
        };

        const details = regionDetails[regionId];
        regionNameElement.textContent = details.name;
        regionDescriptionElement.textContent = details.description;
    }

    // Load Region Challenges
    loadRegionChallenges(regionId) {
        const challengeList = document.getElementById('challenge-list');
        challengeList.innerHTML = ''; // Clear previous challenges

        // Example challenges (would typically come from a data source)
        const challenges = {
            'la-paz': [
                { id: 'history-quiz', name: 'La Paz Historical Quiz' },
                { id: 'geography-challenge', name: 'Geographic Landmarks' }
            ],
            'santa-cruz': [
                { id: 'biodiversity-quiz', name: 'Biodiversity Challenge' },
                { id: 'economic-history', name: 'Economic Development' }
            ]
        };

        const regionChallenges = challenges[regionId];
        regionChallenges.forEach(challenge => {
            const challengeItem = document.createElement('li');
            challengeItem.textContent = challenge.name;
            challengeItem.dataset.challengeId = challenge.id;
            challengeItem.addEventListener('click', () => this.startChallenge(challenge.id));
            challengeList.appendChild(challengeItem);
        });
    }

    // Challenge Setup
    setupChallengeEvents() {
        const submitAnswerBtn = document.getElementById('submit-answer-btn');
        const nextQuestionBtn = document.getElementById('next-question-btn');

        submitAnswerBtn.addEventListener('click', () => this.submitAnswer());
        nextQuestionBtn.addEventListener('click', () => this.loadNextQuestion());
    }

    // Start a Challenge
    startChallenge(challengeId) {
        this.gameState.currentChallenge = challengeId;
        this.navigateToPage('challenge');
        this.loadChallengeQuestions();
    }

    // Load Challenge Questions
    loadChallengeQuestions() {
        // Placeholder for question loading logic
        const questions = {
            'history-quiz': [
                {
                    text: 'When did Bolivia gain independence?',
                    options: ['1825', '1900', '1776', '1810'],
                    correctAnswer: '1825'
                }
                // More questions...
            ]
        };

        const currentChallengeQuestions = questions[this.gameState.currentChallenge];
        this.displayQuestion(currentChallengeQuestions[0]);
    }

    // Display Question
    displayQuestion(question) {
        const questionTextElement = document.getElementById('question-text');
        const answerOptionsElement = document.getElementById('answer-options');

        questionTextElement.textContent = question.text;
        
        // Clear previous options
        answerOptionsElement.innerHTML = '';

        // Create answer options
        question.options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('answer-option');
            
            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.name = 'challenge-answer';
            radioInput.value = option;
            radioInput.id = `option-${option}`;

            const label = document.createElement('label');
            label.htmlFor = `option-${option}`;
            label.textContent = option;

            optionElement.appendChild(radioInput);
            optionElement.appendChild(label);
            answerOptionsElement.appendChild(optionElement);
        });
    }

    // Submit Answer
    submitAnswer() {
        const selectedAnswer = document.querySelector('input[name="challenge-answer"]:checked');
        
        if (!selectedAnswer) {
            this.showErrorMessage('Please select an answer');
            return;
        }

        // Validate answer (placeholder logic)
        const isCorrect = this.checkAnswer(selectedAnswer.value);
        
        if (isCorrect) {
            this.gameState.totalPoints += 10;
            this.showSuccessMessage('Correct Answer! +10 Points');
        } else {
            this.showErrorMessage('Incorrect Answer');
        }

        this.updateUserStatus();
    }

    // Check Answer
    checkAnswer(selectedAnswer) {
        // Placeholder answer checking logic
        return selectedAnswer === '1825';
    }

    // Load Next Question
    loadNextQuestion() {
        // Placeholder for next question logic
        this.showErrorMessage('More questions coming soon!');
    }

    // Error Message Display
    showErrorMessage(message) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('error-message');
        messageContainer.textContent = message;
        document.body.appendChild(messageContainer);

        // Remove message after 3 seconds
        setTimeout(() => {
            document.body.removeChild(messageContainer);
        }, 3000);
    }

    // Success Message Display
    showSuccessMessage(message) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('success-message');
        messageContainer.textContent = message;
        document.body.appendChild(messageContainer);

        // Remove message after 3 seconds
        setTimeout(() => {
            document.body.removeChild(messageContainer);
        }, 3000);
    }

    // Initialize Game
    initializeGame() {
        // Initial setup when game loads
        this.navigateToPage('landing');
    }
}

// Initialize the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const boliviaGame = new BoliviaDiscoveryGame();
    boliviaGame.initializeGame();
});