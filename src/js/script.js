const players = [];
const positionMap = {
    'LW': document.getElementById('LW'),
    'ST': document.getElementById('ST'),
    'RW': document.getElementById('RW'),
    'CM': document.getElementById('CM'),
    'CDM': document.getElementById('CDM'),
    'CAM': document.getElementById('CAM'),
    'LB': document.getElementById('LB'),
    'CBL': document.getElementById('CBL'),
    'CBR': document.getElementById('CBR'),
    'RB': document.getElementById('RB'),
    'GK': document.getElementById('GK')
};

function saveToLocalStorage() {
    localStorage.setItem('footballTeamData', JSON.stringify({
        players: players,
        formation: document.getElementById('formation-select').value
    }));
}

function loadFromLocalStorage() {
    const savedData = localStorage.getItem('footballTeamData');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        if (data.formation) {
            document.getElementById('formation-select').value = data.formation;
        }

        if (data.players && Array.isArray(data.players)) {
            data.players.forEach(player => {
                handlePlayerPlacement(player);
                players.push(player);
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', loadFromLocalStorage);

document.getElementById('formation-select').addEventListener('change', function() {
    saveToLocalStorage();
});

const substitutionContainer = document.getElementById('subtitution');
const form = document.getElementById('playerRegistrationForm');
const playerTypeRadios = document.querySelectorAll('input[name="playerType"]');
const outfieldStats = document.getElementById('outfieldStats');
const goalkeeperStats = document.getElementById('goalkeeperStats');
const position = document.getElementById('position');

function validateTextField(input, minLength = 2) {
    const value = input.value.trim();
    const validNameRegex = /^[A-Za-zÀ-ÿ\s'-]+$/;
    return value.length >= minLength && validNameRegex.test(value);
}

function validateImageURL(input) {
    if (!input) return true;
    
    try {
        const url = new URL(input);
        const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
        const fileExtension = url.pathname.split('.').pop().toLowerCase();
        
        return validExtensions.includes(fileExtension) && 
               (url.protocol === 'http:' || url.protocol === 'https:');
    } catch {
        return false;
    }
}

function validateRating(input) {
    const value = parseInt(input.value);
    return !isNaN(value) && value >= 10 && value <= 99;
}

function validateStats(statInputs) {
    return Array.from(statInputs).every(input => {
        const value = parseInt(input.value);
        return !isNaN(value) && value >= 0 && value <= 99;
    });
}

function populatePositions(type) {
    if (type === 'outfield') {
        position.innerHTML = `
            <option value="">Sélectionner une position</option>
            <option value="LW">LW</option>
            <option value="ST">ST</option>
            <option value="RW">RW</option>
            <option value="CM">CM</option>
            <option value="CDM">CDM</option>
            <option value="CAM">CAM</option>
            <option value="LB">LB</option>
            <option value="CBL">CBL</option>
            <option value="CBR">CBR</option>
            <option value="RB">RB</option>
        `;
    } else {
        position.innerHTML = `
            <option value="">Sélectionner une position</option>
            <option value="GK">GK</option>
        `;
    }
}

playerTypeRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.value === 'outfield') {
            outfieldStats.style.display = 'grid';
            goalkeeperStats.style.display = 'none';
            populatePositions('outfield');
        } else {
            outfieldStats.style.display = 'none';
            goalkeeperStats.style.display = 'grid';
            populatePositions('goalkeeper');
        }
    });
});



function createPlayerCard(player) {
    const playerCard = document.createElement('div');
    playerCard.classList.add('player-card', 'filled');
    playerCard.id = `player-${player.position}`;  
    playerCard.draggable = true;

    playerCard.innerHTML = `
    <div style="width: 100px; margin-right: 6px;">
        <div style="display: flex; gap: 5px;">
            <div style="display: flex; flex-direction: column; margin-top: 30px;">
                <span class="player-rating">${player.rating}</span>
                <span class="player-position">${player.position}</span>            
            </div>
            <img src="${player.photo}" class="player-photo" alt="">
        </div>
        <div>
            <div>
                <span class="player-name">${player.name}</span>
            </div>
            <div class="player-stat">
                ${Object.entries(player.stats).map(([key, value]) => `
                <div class="player-stat-values">
                    <span>${key.toUpperCase()}</span>
                    <span>${value}</span>
                </div>
                `).join('')}
            </div>
            <div class="images-section">
                <img src="${player.nationalityFlag}" alt="">
                <img src="${player.clubFlag}" alt="">
            </div>
        </div>
    </div>
    <div>
        <img src="/src/assets/img/exchange.png" class="replace-btn" alt="">
        <img src="/src/assets/img/exchange.png" class="delete-btn" alt="">

    </div>`;

    const defaultCard = positionMap[player.position];
    if (defaultCard) {
        defaultCard.classList.add('disabled');
        defaultCard.draggable = false;
        defaultCard.style.opacity = '0.5';
        defaultCard.style.pointerEvents = 'none';
        
        defaultCard.parentNode.insertBefore(playerCard, defaultCard);
        defaultCard.style.display = 'none'; // Hide the default card
    }

    return playerCard;


}
function restoreDefaultCard(position) {
    const defaultCard = positionMap[position];
    if (defaultCard) {
        defaultCard.classList.remove('disabled');
        defaultCard.draggable = true;
        defaultCard.style.opacity = '1';
        defaultCard.style.pointerEvents = 'auto';
        defaultCard.style.display = 'block';
    }
}
function createDisabledCard(existingCard) {
    const disabledCard = existingCard.cloneNode(true);
    disabledCard.style.opacity = '0.5';
    disabledCard.style.pointerEvents = 'none';
    disabledCard.querySelector('.replace-btn').style.display = 'none';
    return disabledCard;
}

function handlePlayerPlacement(player) {
    const positionElement = positionMap[player.position];
    
    if (!positionElement) {
        alert(`Position ${player.position} non valide.`);
        return false;
    }

    const existingPlayerCard = document.querySelector(`#player-${player.position}`);

    if (existingPlayerCard) {
        const disabledCard = createDisabledCard(existingPlayerCard);
        substitutionContainer.appendChild(disabledCard);
        existingPlayerCard.remove();
    }

    createPlayerCard(player);
    return true;
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    let isValid = true;

    const nameInput = document.getElementById('name');
    if (!validateTextField(nameInput)) {
        alert('Nom invalide. Minimum 2 caractères, lettres uniquement.');
        isValid = false;
    }

    const nationalityInput = document.getElementById('nationality');
    if (!validateTextField(nationalityInput)) {
        alert('Nationalité invalide. Minimum 2 caractères, lettres uniquement.');
        isValid = false;
    }

    const clubInput = document.getElementById('club');
    if (!validateTextField(clubInput)) {
        alert('Nom de club invalide.');
        isValid = false;
    }

    const photoInput = document.getElementById('photo');
    const nationalityFlagInput = document.getElementById('nationalityFlag');
    const clubFlagInput = document.getElementById('clubFlag');
    
    if (photoInput.value && !validateImageURL(photoInput.value)) {
        alert('URL de photo invalide. Utilisez jpg, jpeg, png, gif, webp ou svg.');
        isValid = false;
    }
    
    if (nationalityFlagInput.value && !validateImageURL(nationalityFlagInput.value)) {
        alert('URL du drapeau invalide. Utilisez jpg, jpeg, png, gif, webp ou svg.');
        isValid = false;
    }
    
    if (clubFlagInput.value && !validateImageURL(clubFlagInput.value)) {
        alert('URL du logo de club invalide. Utilisez jpg, jpeg, png, gif, webp ou svg.');
        isValid = false;
    }

    if (!position.value) {
        alert('Veuillez sélectionner une position.');
        isValid = false;
    }

    const ratingInput = document.getElementById('rating');
    if (!validateRating(ratingInput)) {
        alert('Note globale invalide. Doit être entre 10 et 99.');
        isValid = false;
    }

    const playerType = document.querySelector('input[name="playerType"]:checked').value;
    if (playerType === 'outfield') {
        const outfieldStatInputs = outfieldStats.querySelectorAll('input[type="number"]');
        if (!validateStats(outfieldStatInputs)) {
            alert('Statistiques de joueur de champ invalides. Valeurs entre 0 et 99.');
            isValid = false;
        }
    } else {
        const goalkeeperStatInputs = goalkeeperStats.querySelectorAll('input[type="number"]');
        if (!validateStats(goalkeeperStatInputs)) {
            alert('Statistiques de gardien invalides. Valeurs entre 0 et 99.');
            isValid = false;
        }
    }

    if (!isValid) return;

    const formData = new FormData(form);
    const playerData = Object.fromEntries(formData.entries());

    const stats = playerData.playerType === 'outfield' 
        ? {
            DRIF: playerData.pace,
            DIF: playerData.shooting,
            PHY: playerData.passing,
            PAC: playerData.dribbling,
            SHOT: playerData.defending,
        }
        : {
            div: playerData.diving,
            hand: playerData.handling,
            kick: playerData.kicking,
            ref: playerData.reflexes,
            sp: playerData.speed,
            pos: playerData.positioning
        };

    const player = {
        name: playerData.name,
        nationality: playerData.nationality,
        club: playerData.club,
        position: playerData.position,
        rating: playerData.rating,
        type: playerData.playerType,
        photo: playerData.photo,
        nationalityFlag: playerData.nationalityFlag,
        clubFlag: playerData.clubFlag,
        stats: stats
    };

    if (handlePlayerPlacement(player)) {
        players.push(player);
        saveToLocalStorage(); 
        form.reset();
        outfieldStats.style.display = 'grid';
        goalkeeperStats.style.display = 'none';
        populatePositions('outfield');
    }
});

substitutionContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const playerCard = e.target.closest('.player-card');
        const position = playerCard.id.replace('player-', '');
        restoreDefaultCard(position);
        playerCard.remove();
        
        const playerIndex = players.findIndex(p => p.position === position);
        if (playerIndex !== -1) {
            players.splice(playerIndex, 1);
            saveToLocalStorage();
        }
    }

    if (e.target.classList.contains('replace-btn')) {
        const playerCard = e.target.closest('.player-card');
        const positionSelect = document.getElementById('position');
        const playerData = playerCard.querySelector('span[style="color:white; font-weight: bold; font-size: 15px;"]');
        
        if (playerData) {
            const position = playerData.textContent;
            Array.from(positionSelect.options).forEach(option => {
                if (option.value === position) {
                    positionSelect.value = position;
                }
            });
        }
        
        playerCard.remove();
        saveToLocalStorage(); 
    }
});

function filterPlayersByPosition(position) {
    const playerCards = document.querySelectorAll('#subtitution .player-card');
    
    playerCards.forEach(card => {
        const playerPosition = card.querySelector('.player-position').textContent;
        
        if (position === 'ALL') {
            card.style.display = 'flex';
        } else {
            card.style.display = playerPosition === position ? 'flex' : 'none';
        }
    });
}

document.querySelector('.position-filters').addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
        document.querySelectorAll('.filter-btn').forEach(btn => 
            btn.classList.remove('active'));
        e.target.classList.add('active');
        
        filterPlayersByPosition(e.target.dataset.position);
    }
});