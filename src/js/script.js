const players = [];

        // Get form and subtitution container
        const form = document.getElementById('playerRegistrationForm');
        const subtitutionContainer = document.getElementById('subtitution');

        // Player type radio buttons and stats containers
        const playerTypeRadios = document.querySelectorAll('input[name="playerType"]');
        const outfieldStats = document.getElementById('outfieldStats');
        const goalkeeperStats = document.getElementById('goalkeeperStats');
        const position = document.getElementById('position');
        // Player type radio change event
        playerTypeRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'outfield') {
                    outfieldStats.style.display = 'grid';
                    goalkeeperStats.style.display = 'none';
                    position.innerHTML = `
                        <option value="">Sélectionner une position</option>
                        <option value="RB">RB</option>
                        <option value="CB">LB</option>
                        <option value="LB">CM</option>
                    `;
                } else if (this.value === 'goalkeeper') {
                    outfieldStats.style.display = 'none';
                    goalkeeperStats.style.display = 'grid';
                    position.innerHTML = `
                        <option value="">Sélectionner une position</option>
                        <option value="gardien">GK</option>
                    `;
                }
            });
        });

        // Form submission event
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Collect form data
            const formData = new FormData(form);
            const playerData = Object.fromEntries(formData.entries());

            // Collect stats based on player type
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

            // Create player object
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

            // Add player to array
            players.push(player);

            // Create and append player card
            createPlayerCard(player);

            // Reset form
            form.reset();
            outfieldStats.style.display = 'grid';
            goalkeeperStats.style.display = 'none';
            position.innerHTML = `
                <option value="">Sélectionner une position</option>
                <option value="RB">RB</option>
                <option value="LB">LB</option>
                <option value="CB">CB</option>
            `;
        });

        // Function to create player card
        function createPlayerCard(player) {
            const card = document.createElement('div');
            card.classList.add('player-card');

            // Create stats HTML
            const statsHtml = Object.entries(player.stats)
                .map(([key, value]) => `<div>${key}: ${value}</div>`)
                .join('');

                card.innerHTML = `
 <div style=" width: 100px;  margin-right: 6px;">
         <div style="display: flex; gap: 1px;">
     <div style="display: flex; flex-direction: column; margin-top: 25px;" >
         <span style="color:white; font-weight: bold; font-size: 25px;">${player.rating}</span>
         <span style="color:white; font-weight: bold; font-size: 15px;">${player.position}</span>            
     </div>

     <img src="${player.photo}" style="width: 80px; height: 80px; margin-top: 15px;" alt="">
 </div>
     <div>
         <div>
             <span style="color:white;font-weight: bold; font-size: 19px" >${player.name}</span>

         </div>
         <div style="display: flex; gap: 3px;">
         ${
            Object.entries(player.stats).map(([key, value]) => `
            <div style="display: flex; flex-direction: column; align-items: center;">
                <span style="color:white; font-weight: bold; font-size: 9px;">${key.toUpperCase()}</span>
                <span style="color:white; font-weight: bold; font-size: 9px;">${value}</span>
            </div>
            `).join('')
        }
        </div>
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
             <img src="${player.nationalityFlag}" style="height: 20px; width: 20px;" alt="">
             <img src="${player.clubFlag}" style="height: 20px; width: 20px;" alt="">

         </div>

     </div>
 </div>
 </div> `
 ;
            subtitutionContainer.appendChild(card);
        }