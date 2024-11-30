// Function to fetch and display players from JSON
async function loadSubstitutionPlayers() {
    try {
        const response = await fetch('/players.json');
        const data = await response.json();
        displaySubstitutionPlayers(data);
    } catch (error) {
        console.error('Error loading substitution players:', error);
    }
}

// Function to create player cards for substitution section
function displaySubstitutionPlayers(data) {
    const substitutionContainer = document.getElementById('subtitution-all');

    if (data && data.players) {
        data.players.forEach(player => {
            const playerCard = document.createElement('div');
            playerCard.classList.add('player-card', 'filled');
            
            playerCard.innerHTML = `
                <div style="width: 100px; margin-right: 6px;">
                    <div style="display: flex; gap: 1px;">
                        <div style="display: flex; flex-direction: column; margin-top: 25px;">
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
                            ${Object.entries(player.stats || {}).map(([key, value]) => `
                            <div class="player-stat-values">
                                <span>${key.toUpperCase()}</span>
                                <span>${value}</span>
                            </div>
                            `).join('')}
                        </div>
                        <div class="images-section">
                            <img src="${player.flag}" alt="">
                            <img src="${player.logo}" alt="">
                        </div>
                    </div>
                </div>
                <div>
                    <img src="/src/assets/img/exchange.png" class="replace-btn" alt="">
                </div>`;

            substitutionContainer.appendChild(playerCard);
        });
    }
}

// Load players when the page loads
document.addEventListener('DOMContentLoaded', loadSubstitutionPlayers);
// Add this to your existing JavaScript file
function filterPlayers(position) {
    const playerCards = document.querySelectorAll('.player-card');
    
    playerCards.forEach(card => {
        const playerPosition = card.querySelector('.player-position').textContent;
        if (position === 'ALL' || playerPosition === position) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Add click event listeners to filter buttons
document.addEventListener('DOMContentLoaded', () => {
    loadSubstitutionPlayers();
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Filter players based on selected position
            filterPlayers(button.dataset.position);
        });
    });
});
