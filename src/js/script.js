  
  // Initialize arrays and maps
  function initializeArraysAndMaps() {
    window.players = [];
    window.positionMap = {
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
  }
  
  // Storage Functions
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
  
  // Utility Functions
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
  
  // DOM Elements
  function getDOM() {
    return {
      substitutionContainer: document.getElementById('subtitution'),
      form: document.getElementById('playerRegistrationForm'),
      playerTypeRadios: document.querySelectorAll('input[name="playerType"]'),
      outfieldStats: document.getElementById('outfieldStats'),
      goalkeeperStats: document.getElementById('goalkeeperStats'),
      position: document.getElementById('position')
    };
  }
  
  // Validation Functions
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
      return !isNaN(value) && value >= 10 && value <= 99;
    });
  }
  
  // Position Management
  function populatePositions(type) {
    const { position } = getDOM();
    position.innerHTML = type === 'outfield' 
      ? `
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
      `
      : `
        <option value="">Sélectionner une position</option>
        <option value="GK">GK</option>
      `;
  }
  
  // Player Card Creation
  function createPlayerCard(player) {
    const playerCard = document.createElement('div');
    playerCard.classList.add('player-card', 'filled');
    playerCard.id = `player-${player.position}`;
  
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
    <div class="button-container">
      <img src="/src/assets/img/exchange.png" class="replace-btn" alt="Replace" title="Replace Player">
      <img src="/src/assets/img/exchange.png" class="delete-btn" alt="Delete" title="Remove Player">
        <img src="/src/assets/img/pen.png" class="update-btn" alt="Update" title="Update Player">

    </div>`;
  
    const defaultCard = positionMap[player.position];
    if (defaultCard) {
      defaultCard.classList.add('disabled');
      defaultCard.style.opacity = '0.5';
      defaultCard.style.pointerEvents = 'none';
      defaultCard.parentNode.insertBefore(playerCard, defaultCard);
      defaultCard.style.display = 'none';
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
  
  function handlePlayerPlacement(player) {
    const positionElement = positionMap[player.position];
    if (!positionElement) {
      showNotification(`Position ${player.position} non valide.`, 'error');
      return false;
    }
  
    const existingPlayerCard = document.querySelector(`#player-${player.position}`);
    if (existingPlayerCard) {
      // Move existing player to substitutes
      const substituteCard = existingPlayerCard.cloneNode(true);
      substituteCard.id = `substitute-${player.position}-${Date.now()}`;
      substituteCard.style.opacity = '1';
      substituteCard.style.pointerEvents = 'auto';
      document.getElementById('subtitution').appendChild(substituteCard);
      existingPlayerCard.remove();
    }
  
    createPlayerCard(player);
    return true;
  }
  
  // Helper Functions
  function getPlayerDataFromCard(card) {
    return {
      name: card.querySelector('.player-name').textContent,
      position: card.querySelector('.player-position').textContent,
      rating: card.querySelector('.player-rating').textContent,
      photo: card.querySelector('.player-photo').src,
      nationalityFlag: card.querySelector('.images-section img:first-child').src,
      clubFlag: card.querySelector('.images-section img:last-child').src,
      stats: getStatsFromCard(card)
    };
  }
  
  function getStatsFromCard(card) {
    const stats = {};
    card.querySelectorAll('.player-stat-values').forEach(statDiv => {
      const spans = statDiv.querySelectorAll('span');
      if (spans.length === 2) {
        const key = spans[0].textContent.trim();
        const value = spans[1].textContent.trim();
        stats[key] = value;
      }
    });
    return stats;
  }
  
  // Button Event Handlers
  function initializeButtonHandlers() {
    // Field player buttons
    document.querySelector('.field').addEventListener('click', (e) => {
      if (e.target.classList.contains('replace-btn')) {
        handleFieldPlayerReplace(e);
      } else if (e.target.classList.contains('delete-btn')) {
        handleFieldPlayerDelete(e);
      }
     else if (e.target.classList.contains('update-btn')) {
        handlePlayerUpdate(e);
      }
    });
  
    // Substitution player buttons
    document.getElementById('subtitution').addEventListener('click', (e) => {
      if (e.target.classList.contains('replace-btn')) {
        handleSubstituteReplace(e);
      } else if (e.target.classList.contains('delete-btn')) {
        handleSubstituteDelete(e);
      }
      else if (e.target.classList.contains('update-btn')) {
        handlePlayerUpdate(e);
      }
    });
  }
  function handlePlayerUpdate(e) {
    const playerCard = e.target.closest('.player-card');
    if (!playerCard) return;
  
    const playerData = getPlayerDataFromCard(playerCard);
    populateFormWithPlayerData(playerData);
    
    // Changer le texte du bouton submit
    const submitBtn = document.querySelector('#playerRegistrationForm button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = 'Mettre à jour';
      submitBtn.dataset.updateMode = 'true';
      submitBtn.dataset.playerPosition = playerData.position;
    }
    
    // Faire défiler jusqu'au formulaire
    document.getElementById('playerRegistrationForm').scrollIntoView({ behavior: 'smooth' });
  }
  
  // Fonction pour pré-remplir le formulaire
  function populateFormWithPlayerData(playerData) {
    // Remplir les champs de base
    document.getElementById('name').value = playerData.name;
    document.getElementById('nationality').value = playerData.nationality || '';
    document.getElementById('club').value = playerData.club || '';
    document.getElementById('position').value = playerData.position;
    document.getElementById('rating').value = playerData.rating;
    
    // Sélectionner le type de joueur
    const playerType = playerData.position === 'GK' ? 'goalkeeper' : 'outfield';
    document.querySelector(`input[name="playerType"][value="${playerType}"]`).checked = true;
    
    // Afficher les stats appropriées
    const { outfieldStats, goalkeeperStats } = getDOM();
    outfieldStats.style.display = playerType === 'outfield' ? 'grid' : 'none';
    goalkeeperStats.style.display = playerType === 'goalkeeper' ? 'grid' : 'none';
    
    // Remplir les stats
    if (playerType === 'outfield') {
      document.getElementById('pace').value = playerData.stats.DRIF || '';
      document.getElementById('shooting').value = playerData.stats.DIF || '';
      document.getElementById('passing').value = playerData.stats.PHY || '';
      document.getElementById('dribbling').value = playerData.stats.PAC || '';
      document.getElementById('defending').value = playerData.stats.SHOT || '';
    } else {
      document.getElementById('diving').value = playerData.stats.div || '';
      document.getElementById('handling').value = playerData.stats.hand || '';
      document.getElementById('kicking').value = playerData.stats.kick || '';
      document.getElementById('reflexes').value = playerData.stats.ref || '';
      document.getElementById('speed').value = playerData.stats.sp || '';
      document.getElementById('positioning').value = playerData.stats.pos || '';
    }
  
    // Remplir les URLs des images
    document.getElementById('photo').value = playerData.photo || '';
    document.getElementById('nationalityFlag').value = playerData.nationalityFlag || '';
    document.getElementById('clubFlag').value = playerData.clubFlag || '';
  
    populatePositions(playerType);
  }
  
  // Function implementation for handleFieldPlayerReplace
  function handleFieldPlayerReplace(e) {
    const fieldPlayerCard = e.target.closest('.player-card');
    if (!fieldPlayerCard) return;
  
    const position = fieldPlayerCard.querySelector('.player-position').textContent;
  
    // Check if player already exists in substitution
    const existingSubstitute = document.querySelector(`#subtitution .player-card[data-position="${position}"]`);
    if (existingSubstitute) {
      showNotification('Ce joueur est déjà dans les remplaçants', 'error');
      return;
    }
  
    // Create substitute card
    const substituteCard = fieldPlayerCard.cloneNode(true);
    substituteCard.id = `substitute-${position}-${Date.now()}`;
    substituteCard.dataset.position = position;
    substituteCard.style.opacity = '1';
    substituteCard.style.pointerEvents = 'auto';
  
    // Add to substitution container
    document.getElementById('subtitution').appendChild(substituteCard);
  
    // Restore default card in field
    restoreDefaultCard(position);
    fieldPlayerCard.remove();
  
    // Update players array
    const playerIndex = players.findIndex(p => p.position === position);
    if (playerIndex !== -1) {
      const player = players.splice(playerIndex, 1)[0];
      saveToLocalStorage();
    }
  
    showNotification('Joueur déplacé vers les remplaçants', 'info');
  }

  // Function implementation for handleSubstituteReplace
  function handleSubstituteReplace(e) {
    const substituteCard = e.target.closest('.player-card');
    if (!substituteCard) return;
  
    const position = substituteCard.querySelector('.player-position').textContent;
    const fieldPlayerCard = document.querySelector(`#player-${position}`);  
    if (fieldPlayerCard) {
      // Swap the players
      const newFieldCard = substituteCard.cloneNode(true);
      newFieldCard.id = `player-${position}`;
      
      const newSubCard = fieldPlayerCard.cloneNode(true);
      newSubCard.id = `substitute-${position}-${Date.now()}`;
      
      // Replace the cards
      fieldPlayerCard.parentNode.replaceChild(newFieldCard, fieldPlayerCard);
      substituteCard.parentNode.replaceChild(newSubCard, substituteCard);
      
      // Update players array
      const fieldPlayerIndex = players.findIndex(p => p.position === position);
      if (fieldPlayerIndex !== -1) {
        const substituteData = getPlayerDataFromCard(newFieldCard);
        players[fieldPlayerIndex] = substituteData;
        saveToLocalStorage();
      }
    } else {
      // Move substitute to empty field position
      const newFieldCard = substituteCard.cloneNode(true);
      newFieldCard.id = `player-${position}`;
      
      const defaultCard = positionMap[position];
      if (defaultCard) {
        defaultCard.parentNode.insertBefore(newFieldCard, defaultCard);
        defaultCard.style.display = 'none';
        
        // Add to players array
        const playerData = getPlayerDataFromCard(newFieldCard);
        players.push(playerData);
        saveToLocalStorage();
        
        // Remove substitute card
        substituteCard.remove();
      }
    }
  }
  
  // Function implementation for handleFieldPlayerDelete
  function handleFieldPlayerDelete(e) {
    const fieldPlayerCard = e.target.closest('.player-card');
    if (!fieldPlayerCard) return;
  
    const position = fieldPlayerCard.querySelector('.player-position').textContent;
    
    // Restore default card in field
    restoreDefaultCard(position);
    fieldPlayerCard.remove();
    
    // Update players array
    const playerIndex = players.findIndex(p => p.position === position);
    if (playerIndex !== -1) {
      players.splice(playerIndex, 1);
      saveToLocalStorage();
    }
  
    showNotification('Joueur supprimé', 'info');
  }
  
// Function implementation for handleSubstituteDelete
function handleSubstituteDelete(e) {
    const substituteCard = e.target.closest('.player-card');
    if (!substituteCard) return;
    
    substituteCard.remove();
    showNotification('Remplaçant retiré', 'info');
  }
  
  // Position Filtering
  function filterPlayersByPosition(position) {
    document.querySelectorAll('#subtitution .player-card').forEach(card => {
      const playerPosition = card.querySelector('.player-position').textContent;
      card.style.display = position === 'ALL' || playerPosition === position ? 'flex' : 'none';
    });
  }
  
  // Filter buttons event listener
  function initializeFilterButtons() {
    document.querySelector('.position-filters').addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-btn')) {
        document.querySelectorAll('.filter-btn').forEach(btn => 
          btn.classList.remove('active'));
        e.target.classList.add('active');
        filterPlayersByPosition(e.target.dataset.position);
      }
    });
  }
  
  // Form Validation
  function validateForm() {
    const validations = [
      {
        field: 'name',
        validate: () => validateTextField(document.getElementById('name')),
        message: 'Nom invalide. Minimum 2 caractères, lettres uniquement.'
      },
      {
        field: 'nationality',
        validate: () => validateTextField(document.getElementById('nationality')),
        message: 'Nationalité invalide. Minimum 2 caractères, lettres uniquement.'
      },
      {
        field: 'club',
        validate: () => validateTextField(document.getElementById('club')),
        message: 'Club invalide.'
      },
      {
        field: 'position',
        validate: () => position.value !== '',
        message: 'Veuillez sélectionner une position.'
      },
      {
        field: 'rating',
        validate: () => validateRating(document.getElementById('rating')),
        message: 'Note globale invalide. Doit être entre 10 et 99.'
      }
    ];
  
    for (const validation of validations) {
      if (!validation.validate()) {
        showNotification(validation.message, 'error');
        return false;
      }
    }
  
    // Validate URLs if provided
    const urlFields = ['photo', 'nationalityFlag', 'clubFlag'];
    for (const field of urlFields) {
      const input = document.getElementById(field);
      if (input.value && !validateImageURL(input.value)) {
        showNotification(`URL ${field} invalide. Utilisez jpg, jpeg, png, gif, webp ou svg.`, 'error');
        return false;
      }
    }
  
    // Validate stats based on player type
    const playerType = document.querySelector('input[name="playerType"]:checked').value;
    const statsContainer = playerType === 'outfield' ? outfieldStats : goalkeeperStats;
    const statInputs = statsContainer.querySelectorAll('input[type="number"]');
    
    if (!validateStats(statInputs)) {
      showNotification(`Statistiques invalides. Valeurs entre 0 et 99.`, 'error');
      return false;
    }
  
    return true;
  }
  
  // Form Submit Handler
  function initializeFormSubmit() {
    const { form } = getDOM();
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      try {
        if (!validateForm()) return;
  
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
          photo: playerData.photo || '',
          nationalityFlag: playerData.nationalityFlag || '',
          clubFlag: playerData.clubFlag || '',
          stats: stats
        };
  
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn.dataset.updateMode === 'true') {
          // Mode mise à jour
          const oldPosition = submitBtn.dataset.playerPosition;
          const playerIndex = players.findIndex(p => p.position === oldPosition);
          
          if (playerIndex !== -1) {
            // Supprimer l'ancienne carte
            const oldCard = document.querySelector(`#player-${oldPosition}`);
            if (oldCard) {
              oldCard.remove();
              restoreDefaultCard(oldPosition);
            }
            
            // Placer le joueur mis à jour
            if (handlePlayerPlacement(player)) {
              players[playerIndex] = player;
              saveToLocalStorage();
              resetForm();
              showNotification('Joueur mis à jour avec succès', 'success');
            }
          }
          
          // Réinitialiser le bouton
          submitBtn.textContent = 'Ajouter';
          submitBtn.dataset.updateMode = 'false';
          delete submitBtn.dataset.playerPosition;
          
        } else {
          // Mode ajout normal
          if (handlePlayerPlacement(player)) {
            players.push(player);
            saveToLocalStorage();
            resetForm();
            showNotification('Joueur ajouté avec succès', 'success');
          }
        }
      } catch (error) {
        showNotification('Erreur lors de l\'opération', 'error');
        console.error(error);
      }
    });
  }
    
  // Form Reset
  function resetForm() {
    const { form, outfieldStats, goalkeeperStats } = getDOM();
    form.reset();
    outfieldStats.style.display = 'grid';
    goalkeeperStats.style.display = 'none';
    populatePositions('outfield');
    
    // Réinitialiser le bouton submit
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = 'Ajouter';
      submitBtn.dataset.updateMode = 'false';
      delete submitBtn.dataset.playerPosition;
    }
  }  
  // Radio Button Handlers
  function initializeRadioButtons() {
    const { playerTypeRadios } = getDOM();
    playerTypeRadios.forEach(radio => {
      radio.addEventListener('change', function() {
        outfieldStats.style.display = this.value === 'outfield' ? 'grid' : 'none';
        goalkeeperStats.style.display = this.value === 'outfield' ? 'none' : 'grid';
        populatePositions(this.value);
      });
    });
  }
  
  // Formation Change Handler
  function initializeFormationChange() {
    document.getElementById('formation-select').addEventListener('change', function() {
      saveToLocalStorage();
      showNotification('Formation mise à jour', 'info');
    });
  }
  
  // Initialize Everything
  function initialize() {
    initializeArraysAndMaps();
    initializeButtonHandlers();
    loadFromLocalStorage();
    
    const playerTypeRadios = document.querySelectorAll('input[name="playerType"]');
    const defaultRadio = playerTypeRadios.item(0);
    if (defaultRadio) {
      defaultRadio.checked = true;
      populatePositions('outfield');
    }
    
    const allFilter = document.querySelector('.filter-btn[data-position="ALL"]');
    if (allFilter) {
      allFilter.classList.add('active');
    }
    
    initializeFilterButtons();
    initializeFormSubmit();
    initializeRadioButtons();
    initializeFormationChange();
    initializeExtraFeatures();
    initializeStatTracking();
  }
    
  // Error Handler
  window.addEventListener('error', function(e) {
    showNotification('Une erreur est survenue', 'error');
    console.error(e);
  });
  
  // Prevent accidental page refresh/close
  window.addEventListener('beforeunload', (e) => {
    saveToLocalStorage();
  });
  
  // Stats Tracking System 
  const statsTracker = {
    totalSubstitutions: 0,
    totalPlayers: 0,
    formationChanges: 0,
  
    init() {
      const savedStats = localStorage.getItem('teamStats');
      if (savedStats) {
        const stats = JSON.parse(savedStats);
        this.totalSubstitutions = stats.totalSubstitutions || 0;
        this.totalPlayers = stats.totalPlayers || 0;
        this.formationChanges = stats.formationChanges || 0;
      }
    },
  
    trackSubstitution() {
      this.totalSubstitutions++;
      this.saveStats();
    },
  
    trackNewPlayer() {
      this.totalPlayers++;
      this.saveStats();
    },
  
    trackFormationChange() {
      this.formationChanges++;
      this.saveStats();
    },
  
    saveStats() {
      localStorage.setItem('teamStats', JSON.stringify({
        totalSubstitutions: this.totalSubstitutions,
        totalPlayers: this.totalPlayers,
        formationChanges: this.formationChanges
      }));
    }
  };

  // Search and Filter System
  function searchPlayers(searchTerm) {
    const allCards = document.querySelectorAll('.player-card');
    allCards.forEach(card => {
      const playerName = card.querySelector('.player-name').textContent.toLowerCase();
      if (playerName.includes(searchTerm.toLowerCase())) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }
  
  // Advanced Sorting System
  function sortPlayers(criteria) {
    const container = document.getElementById('subtitution');
    const cards = Array.from(container.querySelectorAll('.player-card'));
  
    cards.sort((a, b) => {
      switch(criteria) {
        case 'rating':
          return parseInt(b.querySelector('.player-rating').textContent) - 
                 parseInt(a.querySelector('.player-rating').textContent);
        case 'name':
          return a.querySelector('.player-name').textContent.localeCompare(
            b.querySelector('.player-name').textContent
          );
        case 'position':
          return a.querySelector('.player-position').textContent.localeCompare(
            b.querySelector('.player-position').textContent
          );
        default:
          return 0;
      }
    });
  
    // Clear and re-append sorted cards
    cards.forEach(card => container.appendChild(card));
  }
  
  // Export Team Function
  function exportTeam() {
    const teamData = {
      players: players,
      formation: document.getElementById('formation-select').value,
      stats: {
        totalSubstitutions: statsTracker.totalSubstitutions,
        totalPlayers: statsTracker.totalPlayers,
        formationChanges: statsTracker.formationChanges
      },
      exportDate: new Date().toISOString()
    };
  
    const blob = new Blob([JSON.stringify(teamData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `team_export_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    showNotification('Équipe exportée avec succès', 'success');
  }
  
  // Import Team Function
  function importTeam(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const importedData = JSON.parse(e.target.result);
        
        // Clear current team
        players.length = 0;
        document.querySelectorAll('.player-card').forEach(card => card.remove());
        
        // Restore default cards
        Object.values(positionMap).forEach(card => {
          if (card) {
            restoreDefaultCard(card.id);
          }
        });
  
        // Import formation
        if (importedData.formation) {
          document.getElementById('formation-select').value = importedData.formation;
        }
  
        // Import players
        if (importedData.players && Array.isArray(importedData.players)) {
          importedData.players.forEach(player => {
            if (handlePlayerPlacement(player)) {
              players.push(player);
            }
          });
        }
  
        // Import stats if available
        if (importedData.stats) {
          statsTracker.totalSubstitutions = importedData.stats.totalSubstitutions || 0;
          statsTracker.totalPlayers = importedData.stats.totalPlayers || 0;
          statsTracker.formationChanges = importedData.stats.formationChanges || 0;
          statsTracker.saveStats();
        }
  
        saveToLocalStorage();
        showNotification('Équipe importée avec succès', 'success');
      } catch (error) {
        showNotification('Erreur lors de l\'importation', 'error');
        console.error(error);
      }
    };
    reader.readAsText(file);
  }
  
  // Team Summary Function
  function generateTeamSummary() {
    const summary = {
      totalPlayers: players.length,
      averageRating: players.reduce((acc, player) => acc + parseInt(player.rating), 0) / players.length,
      positionBreakdown: players.reduce((acc, player) => {
        acc[player.position] = (acc[player.position] || 0) + 1;
        return acc;
      }, {}),
      stats: {
        substitutions: statsTracker.totalSubstitutions,
        formationChanges: statsTracker.formationChanges
      }
    };
  
    showNotification(`Moyenne d'équipe: ${summary.averageRating.toFixed(1)}`, 'info');
    return summary;
  }
  
  // Add event listeners for new features
function initializeExtraFeatures() {
  statsTracker.init();

  const exportBtn = document.querySelector('#export-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportTeam);
  }

  const importInput = document.querySelector('#import-input');
  if (importInput) {
    importInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        importTeam(e.target.files[0]);
      }
    });
  }

  const searchInput = document.querySelector('#search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchPlayers(e.target.value);
    });
  }

  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sortPlayers(btn.dataset.criteria);
    });
  });
}  
  // Update the existing functions to track stats
  function initializeStatTracking() {
    const originalHandleFieldPlayerReplace = handleFieldPlayerReplace;
    handleFieldPlayerReplace = function(e) {
      originalHandleFieldPlayerReplace(e);
      statsTracker.trackSubstitution();
    };
  
    const originalHandleSubstituteReplace = handleSubstituteReplace;
    handleSubstituteReplace = function(e) {
      originalHandleSubstituteReplace(e);
      statsTracker.trackSubstitution();
    }
  }
  
  // Initialize the application
  function initializeApplication() {
    initialize();
    initializeExtraFeatures();
    initializeStatTracking();
  }
  
  initializeApplication();
  