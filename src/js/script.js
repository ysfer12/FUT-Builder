document.addEventListener('DOMContentLoaded', function() {
    // Form and step elements
    const form = document.getElementById('playerRegistrationForm');
    const steps = document.querySelectorAll('.step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const playerTypeSelect = document.getElementById('playerType');
    const positionSelect = document.getElementById('position');
    const outfieldStats = document.getElementById('outfieldStats');
    const goalkeeperStats = document.getElementById('goalkeeperStats');
    
    // Array to store players, initialized from local storage
    let playersList = JSON.parse(localStorage.getItem('playersList')) || [];
    let currentStep = 0;

    // Player position definitions
    const outfieldPositions = [
        'CB', 'LB', 'RB', 'CM', 'CAM', 'CDM', 
        'LM', 'RM', 'LW', 'RW', 'ST'
    ];

    const goalkeeperPositions = ['GK'];

    // Player type selection handler
    playerTypeSelect.addEventListener('change', function() {
        const selectedType = this.value;
        positionSelect.innerHTML = '<option value="">Sélectionner une position</option>';
        
        if (selectedType === 'outfield') {
            outfieldPositions.forEach(pos => {
                const option = document.createElement('option');
                option.value = pos;
                option.textContent = pos;
                positionSelect.appendChild(option);
            });
            outfieldStats.style.display = 'block';
            goalkeeperStats.style.display = 'none';
        } else if (selectedType === 'goalkeeper') {
            goalkeeperPositions.forEach(pos => {
                const option = document.createElement('option');
                option.value = pos;
                option.textContent = pos;
                positionSelect.appendChild(option);
            });
            outfieldStats.style.display = 'none';
            goalkeeperStats.style.display = 'block';
        }
    });

    // Generic field validation
    function validateField(input) {
        if (!input) return true;
        
        const errorElement = document.getElementById(`${input.id}Error`);
        if (!errorElement) return true;
        
        // Check for required fields
        if (input.validity.valueMissing) {
            errorElement.textContent = 'Ce champ est requis';
            errorElement.style.display = 'block';
            return false;
        }

        // Check pattern mismatches
        if (input.validity.patternMismatch) {
            errorElement.style.display = 'block';
            return false;
        }

        // Check number ranges
        if (input.type === 'number') {
            const value = parseInt(input.value);
            if (value < parseInt(input.min) || value > parseInt(input.max)) {
                errorElement.textContent = `Valeur entre ${input.min} et ${input.max}`;
                errorElement.style.display = 'block';
                return false;
            }
        }

        errorElement.style.display = 'none';
        return true;
    }

    // Validate current step
    function validateCurrentStep() {
        const currentStepElement = steps[currentStep];
        const requiredInputs = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        requiredInputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Move to next step
    function moveToNextStep(event) {
        event.preventDefault();
        
        if (validateCurrentStep()) {
            steps[currentStep].classList.remove('active');
            progressSteps[currentStep].classList.remove('active');
            
            currentStep++;
            
            steps[currentStep].classList.add('active');
            progressSteps[currentStep].classList.add('active');
        }
    }

    // Move to previous step
    function moveToPreviousStep(event) {
        event.preventDefault();
        
        steps[currentStep].classList.remove('active');
        progressSteps[currentStep].classList.remove('active');
        
        currentStep--;
        
        steps[currentStep].classList.add('active');
        progressSteps[currentStep].classList.add('active');
    }

    // Attach next step buttons
    const nextButtons = document.querySelectorAll('.btn-next');
    nextButtons.forEach(btn => {
        btn.addEventListener('click', moveToNextStep);
    });

    // Attach previous step buttons
    const prevButtons = document.querySelectorAll('.btn-prev');
    prevButtons.forEach(btn => {
        btn.addEventListener('click', moveToPreviousStep);
    });

    // Form submission handler
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Final form validation
        const allInputs = form.querySelectorAll('input, select');
        let isFormValid = true;

        allInputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });

        // Process form if valid
        if (isFormValid) {
            const formData = new FormData(form);
            const playerData = {
                id: Date.now(), // Unique identifier
                createdAt: new Date().toISOString() // Timestamp
            };

            // Convert FormData to object
            for (let [key, value] of formData.entries()) {
                playerData[key] = value;
            }

            // Collect stats based on player type
            if (playerData.playerType === 'outfield') {
                playerData.stats = {
                    pace: formData.get('pace'),
                    shooting: formData.get('shooting'),
                    passing: formData.get('passing'),
                    dribbling: formData.get('dribbling'),
                    defending: formData.get('defending'),
                    physical: formData.get('physical')
                };
            } else if (playerData.playerType === 'goalkeeper') {
                playerData.stats = {
                    diving: formData.get('diving'),
                    handling: formData.get('handling'),
                    kicking: formData.get('kicking'),
                    reflexes: formData.get('reflexes'),
                    speed: formData.get('speed'),
                    positioning: formData.get('positioning')
                };
            }

            // Add player to list
            playersList.push(playerData);

            // Save to local storage
            localStorage.setItem('playersList', JSON.stringify(playersList));

            console.log('Liste des joueurs:', playersList);

            alert('Joueur ajouté avec succès !');

            // Reset form and return to first step
            form.reset();

            steps.forEach((step, index) => {
                if (index === 0) {
                    step.classList.add('active');
                    progressSteps[index].classList.add('active');
                } else {
                    step.classList.remove('active');
                    progressSteps[index].classList.remove('active');
                }
            });
            currentStep = 0;
        }
    });

    // Utility functions for managing players list
    function displayPlayersList() {
        console.table(playersList);
    }

    function clearPlayersList() {
        playersList = [];
        localStorage.removeItem('playersList');
        console.log('Liste des joueurs effacée');
    }

    // Expose utility functions globally
    window.displayPlayersList = displayPlayersList;
    window.clearPlayersList = clearPlayersList;

    function generatePlayerCard(playerData) {
        // Determine stats based on player type
        let statsHtml = '';
        if (playerData.playerType === 'outfield') {
            const stats = [
                { label: 'DRI', value: playerData.stats.dribbling },
                { label: 'DEF', value: playerData.stats.defending },
                { label: 'PHY', value: playerData.stats.physical },
                { label: 'PAC', value: playerData.stats.pace },
                { label: 'SHOT', value: playerData.stats.shooting }
            ];

            statsHtml = stats.map(stat => `
                <div style="display: flex; flex-direction: column;align-items: center">
                    <span style="color:white; font-weight: bold; font-size: 9px;">${stat.label}</span>
                    <span style="color:white; font-weight: bold; font-size: 9px;">${stat.value}</span>
                </div>
            `).join('');
        } else if (playerData.playerType === 'goalkeeper') {
            const stats = [
                { label: 'DIV', value: playerData.stats.diving },
                { label: 'HND', value: playerData.stats.handling },
                { label: 'KIC', value: playerData.stats.kicking },
                { label: 'REF', value: playerData.stats.reflexes },
                { label: 'SPD', value: playerData.stats.speed }
            ];

            statsHtml = stats.map(stat => `
                <div style="display: flex; flex-direction: column;align-items: center">
                    <span style="color:white; font-weight: bold; font-size: 9px;">${stat.label}</span>
                    <span style="color:white; font-weight: bold; font-size: 9px;">${stat.value}</span>
                </div>
            `).join('');
        }

        // Placeholder for flag and team images (you might want to add actual image URLs)
        const flagUrl = 'https://cdn.sofifa.net/flags/default.png';
        const teamUrl = 'https://cdn.sofifa.net/meta/team/default/120.png';

        // Player card HTML template
        const cardHtml = `
            <div class="line forwards">
                <div class="player-card">
                    <div style="width: 100px; margin-right: 6px;">
                        <div style="display: flex; gap: 1px;">
                            <div style="display: flex; flex-direction: column; margin-top: 25px;">
                                <span style="color:white; font-weight: bold; font-size: 25px;">99</span>
                                <span style="color:white; font-weight: bold; font-size: 15px;">${playerData.position}</span>
                            </div>
                            <img src="https://cdn.sofifa.net/players/default.png" style="width: 80px; height: 80px; margin-top: 15px;" alt="">
                        </div>
                        <div>
                            <div>
                                <span style="color:white;font-weight: bold; font-size: 19px">${playerData.firstName} ${playerData.lastName}</span>
                            </div>
                            <div style="display: flex; gap: 3px;">
                                ${statsHtml}
                            </div>
                            <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                                <img src="${flagUrl}" style="height: 20px; width: 20px;" alt="">
                                <img src="${teamUrl}" style="height: 20px; width: 20px;" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return cardHtml;
    }

    // Modify form submission handler
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Existing validation code...

        if (isFormValid) {
            const formData = new FormData(form);
            const playerData = {
                id: Date.now(),
                createdAt: new Date().toISOString()
            };

            // Convert FormData to object
            for (let [key, value] of formData.entries()) {
                playerData[key] = value;
            }

            // Collect stats based on player type
            if (playerData.playerType === 'outfield') {
                playerData.stats = {
                    pace: formData.get('pace'),
                    shooting: formData.get('shooting'),
                    passing: formData.get('passing'),
                    dribbling: formData.get('dribbling'),
                    defending: formData.get('defending'),
                    physical: formData.get('physical')
                };
            } else if (playerData.playerType === 'goalkeeper') {
                playerData.stats = {
                    diving: formData.get('diving'),
                    handling: formData.get('handling'),
                    kicking: formData.get('kicking'),
                    reflexes: formData.get('reflexes'),
                    speed: formData.get('speed'),
                    positioning: formData.get('positioning')
                };
            }

            // Add player to list
            playersList.push(playerData);

            // Save to local storage
            localStorage.setItem('playersList', JSON.stringify(playersList));

            // Generate and add player card to the DOM
            const playerCardContainer = document.getElementById('playerCardsContainer');
            if (playerCardContainer) {
                const cardHtml = generatePlayerCard(playerData);
                playerCardContainer.innerHTML += cardHtml;
            }

            console.log('Liste des joueurs:', playersList);

            alert('Joueur ajouté avec succès !');

            // Reset form and return to first step
            form.reset();

            steps.forEach((step, index) => {
                if (index === 0) {
                    step.classList.add('active');
                    progressSteps[index].classList.add('active');
                } else {
                    step.classList.remove('active');
                    progressSteps[index].classList.remove('active');
                }
            });
            currentStep = 0;
        }
    });

    // Function to load and display existing players from local storage
    function loadExistingPlayers() {
        const playerCardContainer = document.getElementById('playerCardsContainer');
        if (playerCardContainer && playersList.length > 0) {
            playerCardContainer.innerHTML = playersList.map(generatePlayerCard).join('');
        }
    }

    // Load existing players when page loads
    loadExistingPlayers();
});