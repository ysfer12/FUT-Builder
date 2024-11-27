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

const subtitutionContainer = document.getElementById('subtitution');
const form = document.getElementById('playerRegistrationForm');
const playerTypeRadios = document.querySelectorAll('input[name="playerType"]');
const outfieldStats = document.getElementById('outfieldStats');
const goalkeeperStats = document.getElementById('goalkeeperStats');
const position = document.getElementById('position');

playerTypeRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.value === 'outfield') {
            outfieldStats.style.display = 'grid';
            goalkeeperStats.style.display = 'none';
            position.innerHTML = `
                <option value="">Sélectionner une position</option>
                <option value="LW">LW</option>
                <option value="ST">ST</option>
                <option value="RW">RW</option>
                <option value="CM">CM</option>
                <option value="CDM">CDM</option>
                <option value="CAM">CAM</option>
                <option value="LB">LB</option>
                <option value="CB">CB</option>
                <option value="RB">RB</option>
            `;
        } else if (this.value === 'goalkeeper') {
            outfieldStats.style.display = 'none';
            goalkeeperStats.style.display = 'grid';
            position.innerHTML = `
                <option value="">Sélectionner une position</option>
                <option value="GK">GK</option>
            `;
        }
    });
});

function createPlayerCard(player) {
    const card = document.createElement('div');
    card.classList.add('player-card');

    card.innerHTML = `
    <div style="width: 100px; margin-right: 6px;">
        <div style="display: flex; gap: 1px;">
            <div style="display: flex; flex-direction: column; margin-top: 25px;">
                <span style="color:white; font-weight: bold; font-size: 25px;">${player.rating}</span>
                <span style="color:white; font-weight: bold; font-size: 15px;">${player.position}</span>            
            </div>
            <img src="${player.photo}" style="width: 80px; height: 80px; margin-top: 15px;" alt="">
        </div>
        <div>
            <div>
                <span style="color:white;font-weight: bold; font-size: 19px">${player.name}</span>
            </div>
            <div style="display: flex; gap: 3px;">
                ${Object.entries(player.stats).map(([key, value]) => `
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <span style="color:white; font-weight: bold; font-size: 9px;">${key.toUpperCase()}</span>
                    <span style="color:white; font-weight: bold; font-size: 9px;">${value}</span>
                </div>
                `).join('')}
            </div>
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                <img src="${player.nationalityFlag}" style="height: 20px; width: 20px;" alt="">
                <img src="${player.clubFlag}" style="height: 20px; width: 20px;" alt="">
            </div>
        </div>
    </div>
        <div>
                            <img src="/src/assets/img/arrow-goes-left-right-icon.svg" class="replace-btn" alt="">
                            <button class="delete-btn">delete</button>
                        </div>`;

    return card;
}

function createDisabledCard(existingCard) {
    const disabledCard = existingCard.cloneNode(true);
    disabledCard.style.opacity = '0.5';
    disabledCard.style.pointerEvents = 'none';
    return disabledCard;
}

form.addEventListener('submit', function(e) {
    e.preventDefault();

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
            diving: playerData.diving,
            handling: playerData.handling,
            kicking: playerData.kicking,
            reflexes: playerData.reflexes,
            speed: playerData.speed,
            positioning: playerData.positioning
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

    if (!player.position) {
        alert('Please select a position for the player.');
        return;
    }

    const targetPosition = player.position === 'CB' 
        ? (document.getElementById('CBL').innerHTML === 'CB' ? 'CBL' : 'CBR') 
        : player.position;

    const positionDiv = positionMap[targetPosition];
    if (positionDiv.children.length > 0) {
        const existingCard = positionDiv.children[0];
        const disabledCard = createDisabledCard(existingCard);
        
        positionDiv.innerHTML = '';
        positionDiv.appendChild(createPlayerCard(player));
        
        subtitutionContainer.appendChild(disabledCard);
        
        alert(`${targetPosition} was replaced. Previous player moved to substitution.`);
    } else {
        positionDiv.innerHTML = ''; 
        positionDiv.appendChild(createPlayerCard(player));
    }

    players.push(player);


    form.reset();
    outfieldStats.style.display = 'grid';
    goalkeeperStats.style.display = 'none';
    position.innerHTML = `
        <option value="">Sélectionner une position</option>
        <option value="LW">LW</option>
        <option value="ST">ST</option>
        <option value="RW">RW</option>
        <option value="CM">CM</option>
        <option value="CDM">CDM</option>
        <option value="CAM">CAM</option>
        <option value="LB">LB</option>
        <option value="CB">CB</option>
        <option value="RB">RB</option>
    `;
});