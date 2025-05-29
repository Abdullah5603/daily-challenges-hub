document.addEventListener('DOMContentLoaded', function() {
    // Initialize user data
    let userData = {
        loggedIn: false,
        username: '',
        streak: 0,
        totalPoints: 0,
        rank: '-',
        challengesCompleted: [],
        badges: []
    };
    
    // Initialize challenges data
    const challengesData = {
        wordGuess: {
            completed: false,
            points: 50,
            word: 'CHALK',
            attempts: 0,
            maxAttempts: 6
        },
        drawingPrompt: {
            completed: false,
            points: 40,
            prompt: 'A robot trying to eat ice cream on a hot summer day'
        },
        triviaDaily: {
            completed: false,
            points: 30,
            question: 'Which planet in our solar system rotates clockwise?',
            answer: 'Venus',
            options: ['Mars', 'Venus', 'Uranus', 'Mercury']
        },
        microStory: {
            completed: false,
            points: 45,
            theme: 'The Last Key'
        },
        emojiTranslation: {
            completed: false,
            points: 35,
            sequence: ['🧙‍♂️', '💍', '🌋', '🧝‍♂️'],
            answer: 'The Lord of the Rings'
        }
    };

    // Load saved data if available
    loadUserData();
    
    // Tab Navigation
    const tabBtns = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Word Guess Challenge
    initWordGuess();
    
    // Drawing Prompt Challenge
    initDrawingPrompt();
    
    // Trivia Challenge
    initTrivia();
    
    // Micro Story Challenge
    initMicroStory();
    
    // Emoji Translation Challenge
    initEmojiTranslation();
    
    // Initialize Progress Tab
    initProgressTab();
    
    // Login/Register System
    initAuthSystem();
    
    // Reminder System
    initReminderSystem();
    
    // Update UI based on user data
    updateUIWithUserData();

    // Word Guess Challenge Initialization
    function initWordGuess() {
        const wordGrid = document.querySelector('.word-grid');
        const keyboard = document.querySelector('.keyboard');
        
        // Create word grid
        for (let i = 0; i < challengesData.wordGuess.maxAttempts; i++) {
            const row = document.createElement('div');
            row.classList.add('word-row');
            
            for (let j = 0; j < 5; j++) {
                const box = document.createElement('div');
                box.classList.add('letter-box');
                row.appendChild(box);
            }
            
            wordGrid.appendChild(row);
        }
        
        // Create keyboard
        const keys = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
            ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
        ];
        
        keys.forEach(row => {
            const keyboardRow = document.createElement('div');
            keyboardRow.classList.add('keyboard-row');
            
            row.forEach(key => {
                const keyElement = document.createElement('div');
                keyElement.classList.add('key');
                keyElement.textContent = key;
                keyElement.dataset.key = key;
                
                if (key === 'ENTER' || key === 'BACK') {
                    keyElement.classList.add('wide');
                }
                
                keyElement.addEventListener('click', () => {
                    handleKeyPress(key);
                });
                
                keyboardRow.appendChild(keyElement);
            });
            
            keyboard.appendChild(keyboardRow);
        });
        
        // For demonstration, show completed challenge
        document.querySelector('.word-guess-result').style.display = 'block';
        
        // Listen for keyboard input
        window.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                handleKeyPress('ENTER');
            } else if (e.key === 'Backspace') {
                handleKeyPress('BACK');
            } else if (/^[a-zA-Z]$/.test(e.key)) {
                handleKeyPress(e.key.toUpperCase());
            }
        });
    }
    
    // Word Guess Game Logic
    let currentRow = 0;
    let currentCol = 0;
    let gameOver = false;

    function handleKeyPress(key) {
        if (gameOver) return;
        
        const rows = document.querySelectorAll('.word-row');
        
        if (key === 'BACK') {
            if (currentCol > 0) {
                currentCol--;
                rows[currentRow].children[currentCol].textContent = '';
            }
        } else if (key === 'ENTER') {
            if (currentCol === 5) {
                checkWord();
                currentRow++;
                currentCol = 0;
            }
        } else {
            if (currentCol < 5) {
                rows[currentRow].children[currentCol].textContent = key;
                currentCol++;
            }
        }
    }
    
    function checkWord() {
        const word = challengesData.wordGuess.word;
        const row = document.querySelectorAll('.word-row')[currentRow];
        const boxes = row.querySelectorAll('.letter-box');
        let guessWord = '';
        
        boxes.forEach(box => {
            guessWord += box.textContent;
        });
        
        for (let i = 0; i < 5; i++) {
            const letter = guessWord[i];
            
            if (letter === word[i]) {
                boxes[i].classList.add('correct');
                updateKeyboardKey(letter, 'correct');
            } else if (word.includes(letter)) {
                boxes[i].classList.add('present');
                updateKeyboardKey(letter, 'present');
            } else {
                boxes[i].classList.add('absent');
                updateKeyboardKey(letter, 'absent');
            }
        }
        
        challengesData.wordGuess.attempts++;
        
        if (guessWord === word) {
            gameOver = true;
            markChallengeCompleted('wordGuess');
        } else if (currentRow === 5) {
            gameOver = true;
        }
    }
    
    function updateKeyboardKey(letter, status) {
        const key = document.querySelector(`.key[data-key="${letter}"]`);
        
        if (key) {
            if (status === 'correct') {
                key.style.backgroundColor = '#6aaa64';
                key.style.color = 'white';
            } else if (status === 'present' && !key.style.backgroundColor.includes('6aaa64')) {
                key.style.backgroundColor = '#c9b458';
                key.style.color = 'white';
            } else if (status === 'absent' && !key.style.backgroundColor.includes('6aaa64') && !key.style.backgroundColor.includes('c9b458')) {
                key.style.backgroundColor = '#5c6170';
                key.style.color = 'white';
            }
        }
    }
    
    // Drawing Prompt Challenge Initialization
    function initDrawingPrompt() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('drawingUpload');
        const submitButton = document.getElementById('submitDrawing');
        
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });
        
        uploadArea.addEventListener('dragover', e => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--primary-color)';
            uploadArea.style.backgroundColor = 'rgba(76, 111, 255, 0.05)';
        });
        
        uploadArea.addEventListener('dragleave', e => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--gray-medium)';
            uploadArea.style.backgroundColor = '';
        });
        
        uploadArea.addEventListener('drop', e => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--gray-medium)';
            uploadArea.style.backgroundColor = '';
            
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                handleFileUpload();
            }
        });
        
        fileInput.addEventListener('change', handleFileUpload);
        
        submitButton.addEventListener('click', () => {
            if (fileInput.files.length) {
                markChallengeCompleted('drawingPrompt');
                document.querySelector('.drawing-result').style.display = 'block';
                uploadArea.style.display = 'none';
                submitButton.style.display = 'none';
            }
        });
        
        function handleFileUpload() {
            if (fileInput.files.length) {
                uploadArea.textContent = "File selected: " + fileInput.files[0].name;
                submitButton.disabled = false;
            }
        }
    }
    
    // Trivia Challenge Initialization
    function initTrivia() {
        const answerButtons = document.querySelectorAll('.answer-btn');
        
        answerButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const answer = btn.dataset.answer;
                
                if (answer === challengesData.triviaDaily.answer) {
                    document.querySelector('.trivia-result.correct').style.display = 'block';
                    markChallengeCompleted('triviaDaily');
                } else {
                    document.querySelector('.trivia-result.incorrect').style.display = 'block';
                }
                
                document.querySelector('.trivia-question').style.display = 'none';
            });
        });
        
        // Initialize stats chart (simplified)
        const statsChart = document.querySelector('.stats-chart');
        statsChart.innerHTML = `
            <div style="display: flex; justify-content: space-between; height: 100%; align-items: flex-end; padding: 1rem;">
                <div style="width: 40px; background-color: #dc3545; height: 30%;">
                    <div style="text-align: center; padding-top: 5px; color: white; font-size: 0.8rem;">30%</div>
                </div>
                <div style="width: 40px; background-color: #ffa940; height: 20%;">
                    <div style="text-align: center; padding-top: 5px; color: white; font-size: 0.8rem;">20%</div>
                </div>
                <div style="width: 40px; background-color: #ffa940; height: 15%;">
                    <div style="text-align: center; padding-top: 5px; color: white; font-size: 0.8rem;">15%</div>
                </div>
                <div style="width: 40px; background-color: #28a745; height: 35%;">
                    <div style="text-align: center; padding-top: 5px; color: white; font-size: 0.8rem;">35%</div>
                </div>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0 1rem;">
                <div style="width: 40px; text-align: center; font-size: 0.8rem;">Mars</div>
                <div style="width: 40px; text-align: center; font-size: 0.8rem;">Venus</div>
                <div style="width: 40px; text-align: center; font-size: 0.8rem;">Uranus</div>
                <div style="width: 40px; text-align: center; font-size: 0.8rem;">Mercury</div>
            </div>
        `;
    }
    
    // Micro Story Challenge Initialization
    function initMicroStory() {
        const storyInput = document.getElementById('storyInput');
        const wordCount = document.getElementById('wordCount');
        const submitButton = document.getElementById('submitStory');
        
        storyInput.addEventListener('input', () => {
            const text = storyInput.value.trim();
            const words = text === '' ? 0 : text.split(/\s+/).length;
            
            wordCount.textContent = words;
            
            if (words >= 10) {
                submitButton.disabled = false;
            } else {
                submitButton.disabled = true;
            }
        });
        
        submitButton.addEventListener('click', () => {
            document.querySelector('.story-result').style.display = 'block';
            storyInput.style.display = 'none';
            document.querySelector('.word-count').style.display = 'none';
            submitButton.style.display = 'none';
            markChallengeCompleted('microStory');
        });
    }
    
    // Emoji Translation Challenge Initialization
    function initEmojiTranslation() {
        const emojiGuess = document.getElementById('emojiGuess');
        const submitButton = document.getElementById('submitEmoji');
        
        submitButton.addEventListener('click', () => {
            const guess = emojiGuess.value.trim().toLowerCase();
            const answer = challengesData.emojiTranslation.answer.toLowerCase();
            
            if (guess === answer || guess.includes('lord') && guess.includes('ring')) {
                document.querySelector('.emoji-result.correct').style.display = 'block';
                markChallengeCompleted('emojiTranslation');
            } else {
                document.querySelector('.emoji-result.incorrect').style.display = 'block';
            }
            
            emojiGuess.style.display = 'none';
            submitButton.style.display = 'none';
        });
    }
    
    // Progress Tab Initialization
    function initProgressTab() {
        // Streak calendar (simplified)
        const streakCalendar = document.querySelector('.streak-calendar');
        streakCalendar.innerHTML = `
            <div style="display: flex; flex-wrap: wrap; padding: 1rem; gap: 0.5rem;">
                ${generateCalendarDays()}
            </div>
        `;
        
        // Badges
        const badgeContainer = document.querySelector('.badge-container');
        badgeContainer.innerHTML = `
            ${generateBadges()}
        `;
        
        // Overall leaderboard (simplified)
        const overallLeaderboard = document.querySelector('.overall-leaderboard');
        overallLeaderboard.innerHTML = `
            <div style="padding: 1rem;">
                <div class="leaderboard-entries">
                    <div class="leaderboard-entry">
                        <div class="rank">1</div>
                        <div class="user">PuzzleMaster</div>
                        <div class="score">1,245 pts</div>
                    </div>
                    <div class="leaderboard-entry">
                        <div class="rank">2</div>
                        <div class="user">ArtisticMind</div>
                        <div class="score">1,190 pts</div>
                    </div>
                    <div class="leaderboard-entry">
                        <div class="rank">3</div>
                        <div class="user">WordWeaver</div>
                        <div class="score">1,105 pts</div>
                    </div>
                    <div class="leaderboard-entry">
                        <div class="rank">4</div>
                        <div class="user">TriviaKing</div>
                        <div class="score">980 pts</div>
                    </div>
                    <div class="leaderboard-entry">
                        <div class="rank">5</div>
                        <div class="user">EmojiExpert</div>
                        <div class="score">945 pts</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    function generateCalendarDays() {
        let html = '';
        for (let i = 0; i < 30; i++) {
            const active = i < 7 || i % 5 === 0;
            html += `
                <div style="width: 30px; height: 30px; 
                            background-color: ${active ? 'var(--primary-color)' : 'var(--gray-light)'};
                            border-radius: 4px;
                            display: flex; align-items: center; justify-content: center;
                            color: ${active ? 'white' : 'var(--gray-dark)'};
                            font-size: 0.8rem;">
                    ${i + 1}
                </div>
            `;
        }
        return html;
    }
    
    function generateBadges() {
        const badges = [
            { name: 'Word Master', icon: '📝', unlocked: true, description: 'Guessed 5 words correctly' },
            { name: 'Artistic Eye', icon: '🎨', unlocked: true, description: 'Submitted 10 drawings' },
            { name: 'Trivia Genius', icon: '🧠', unlocked: false, description: 'Answered 15 trivia questions correctly' },
            { name: 'Storyteller', icon: '📖', unlocked: true, description: 'Wrote 7 micro stories' },
            { name: 'Emoji Wizard', icon: '😎', unlocked: false, description: 'Solved 12 emoji puzzles' },
            { name: '7-Day Streak', icon: '🔥', unlocked: true, description: 'Completed challenges for 7 consecutive days' }
        ];
        
        let html = '';
        badges.forEach(badge => {
            html += `
                <div class="badge" style="text-align: center; padding: 1rem; 
                                        background-color: white; 
                                        border-radius: var(--border-radius);
                                        box-shadow: var(--box-shadow);
                                        opacity: ${badge.unlocked ? '1' : '0.6'};
                                        filter: ${badge.unlocked ? 'none' : 'grayscale(1)'};
                                        ">
                    <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">${badge.icon}</div>
                    <h4 style="margin-bottom: 0.3rem;">${badge.name}</h4>
                    <p style="font-size: 0.8rem; color: var(--gray-dark); margin: 0;">${badge.description}</p>
                </div>
            `;
        });
        
        return html;
    }
    
    // Authentication System
    function initAuthSystem() {
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const loginModal = document.getElementById('loginModal');
        const registerModal = document.getElementById('registerModal');
        const closeBtns = document.querySelectorAll('.close');
        const showRegisterLink = document.getElementById('showRegister');
        const showLoginLink = document.getElementById('showLogin');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const logoutBtn = document.getElementById('logoutBtn');
        
        loginBtn.addEventListener('click', () => {
            loginModal.style.display = 'block';
        });
        
        registerBtn.addEventListener('click', () => {
            registerModal.style.display = 'block';
        });
        
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                loginModal.style.display = 'none';
                registerModal.style.display = 'none';
                document.getElementById('emailReminderModal').style.display = 'none';
                document.getElementById('discordReminderModal').style.display = 'none';
            });
        });
        
        showRegisterLink.addEventListener('click', e => {
            e.preventDefault();
            loginModal.style.display = 'none';
            registerModal.style.display = 'block';
        });
        
        showLoginLink.addEventListener('click', e => {
            e.preventDefault();
            registerModal.style.display = 'none';
            loginModal.style.display = 'block';
        });
        
        loginForm.addEventListener('submit', e => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Simulate login
            userData.loggedIn = true;
            userData.username = email.split('@')[0];
            loginModal.style.display = 'none';
            
            // Update UI
            updateUIWithUserData();
            saveUserData();
        });
        
        registerForm.addEventListener('submit', e => {
            e.preventDefault();
            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            
            // Simulate registration
            userData.loggedIn = true;
            userData.username = username;
            registerModal.style.display = 'none';
            
            // Update UI
            updateUIWithUserData();
            saveUserData();
        });
        
        logoutBtn.addEventListener('click', e => {
            e.preventDefault();
            userData.loggedIn = false;
            updateUIWithUserData();
            saveUserData();
        });
        
        // Close modals when clicking outside
        window.addEventListener('click', e => {
            if (e.target === loginModal) loginModal.style.display = 'none';
            if (e.target === registerModal) registerModal.style.display = 'none';
            if (e.target === document.getElementById('emailReminderModal')) document.getElementById('emailReminderModal').style.display = 'none';
            if (e.target === document.getElementById('discordReminderModal')) document.getElementById('discordReminderModal').style.display = 'none';
        });
    }
    
    // Reminder System
    function initReminderSystem() {
        const emailReminderBtn = document.querySelector('.email-reminder');
        const discordReminderBtn = document.querySelector('.discord-reminder');
        const emailModal = document.getElementById('emailReminderModal');
        const discordModal = document.getElementById('discordReminderModal');
        const emailForm = document.getElementById('emailReminderForm');
        const discordForm = document.getElementById('discordReminderForm');
        
        emailReminderBtn.addEventListener('click', () => {
            emailModal.style.display = 'block';
        });
        
        discordReminderBtn.addEventListener('click', () => {
            discordModal.style.display = 'block';
        });
        
        emailForm.addEventListener('submit', e => {
            e.preventDefault();
            alert('Email reminder set successfully!');
            emailModal.style.display = 'none';
        });
        
        discordForm.addEventListener('submit', e => {
            e.preventDefault();
            alert('Discord notifications connected successfully!');
            discordModal.style.display = 'none';
        });
        
        document.querySelector('.discord-join-btn').addEventListener('click', () => {
            window.open('https://discord.gg/dailychallenges', '_blank');
        });
    }
    
    // Helper Functions
    function markChallengeCompleted(challengeName) {
        if (!challengesData[challengeName].completed) {
            challengesData[challengeName].completed = true;
            userData.totalPoints += challengesData[challengeName].points;
            
            if (!userData.challengesCompleted.includes(challengeName)) {
                userData.challengesCompleted.push(challengeName);
            }
            
            // Update streak logic (simplified)
            userData.streak++;
            
            updateUIWithUserData();
            saveUserData();
        }
    }
    
    function updateUIWithUserData() {
        // Update user section
        if (userData.loggedIn) {
            document.getElementById('loginBtn').style.display = 'none';
            document.getElementById('registerBtn').style.display = 'none';
            document.querySelector('.user-profile').style.display = 'flex';
            document.getElementById('username').textContent = userData.username;
        } else {
            document.getElementById('loginBtn').style.display = 'inline-block';
            document.getElementById('registerBtn').style.display = 'inline-block';
            document.querySelector('.user-profile').style.display = 'none';
        }
        
        // Update stats
        document.getElementById('streakValue').textContent = userData.streak;
        document.getElementById('pointsValue').textContent = userData.totalPoints;
        
        // Update rank
        if (userData.totalPoints > 0) {
            if (userData.totalPoints > 1000) userData.rank = '1';
            else if (userData.totalPoints > 500) userData.rank = '2';
            else if (userData.totalPoints > 100) userData.rank = '3';
            else userData.rank = '4';
        }
        document.getElementById('rankValue').textContent = userData.rank;
    }
    
    function saveUserData() {
        localStorage.setItem('dailyChallengesUserData', JSON.stringify(userData));
        localStorage.setItem('dailyChallengesData', JSON.stringify(challengesData));
    }
    
    function loadUserData() {
        const savedUserData = localStorage.getItem('dailyChallengesUserData');
        const savedChallengesData = localStorage.getItem('dailyChallengesData');
        
        if (savedUserData) {
            userData = JSON.parse(savedUserData);
        }
        
        if (savedChallengesData) {
            Object.assign(challengesData, JSON.parse(savedChallengesData));
        }
    }
});
