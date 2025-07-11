// Player token management for Court Coach

class PlayerManager {
    constructor(stage, courtManager) {
        this.stage = stage;
        this.courtManager = courtManager;
        this.playersLayer = new Konva.Layer();
        this.stage.add(this.playersLayer);
        
        this.players = [];
        this.selectedPlayer = null;
        
        this.playerPositions = {
            'GS': { team: 'blue', name: 'Goal Shooter' },
            'GA': { team: 'blue', name: 'Goal Attack' },
            'WA': { team: 'blue', name: 'Wing Attack' },
            'C': { team: 'blue', name: 'Centre' },
            'WD': { team: 'teal', name: 'Wing Defence' },
            'GD': { team: 'teal', name: 'Goal Defence' },
            'GK': { team: 'teal', name: 'Goal Keeper' }
        };
        
        this.blueTeamPositions = ['GS', 'GA', 'WA', 'C', 'WD', 'GD', 'GK'];
        this.tealTeamPositions = ['GS', 'GA', 'WA', 'C', 'WD', 'GD', 'GK'];
        
        this.initPlayers();
        this.setupCourtResize();
    }
    
    initPlayers() {
        // Create blue team players
        this.blueTeamPositions.forEach((position, index) => {
            this.createPlayer(position, 'blue', index);
        });
        
        // Create teal team players
        this.tealTeamPositions.forEach((position, index) => {
            this.createPlayer(position, 'teal', index);
        });
        
        this.positionPlayersOffCourt();
        this.playersLayer.draw();
    }
    
    createPlayer(position, team, index) {
        const dimensions = this.courtManager.getCourtDimensions();
        const tokenSize = Math.max(20, dimensions.scale * 8);
        const fontSize = Math.max(8, tokenSize * 0.3);
        
        const colors = {
            blue: '#4285F4',
            teal: '#1DB584'
        };
        
        // Create player group
        const playerGroup = new Konva.Group({
            draggable: true,
            id: `${team}-${position}`,
            name: 'player'
        });
        
        // Create player circle
        const playerCircle = new Konva.Circle({
            x: 0,
            y: 0,
            radius: tokenSize,
            fill: colors[team],
            stroke: '#ffffff',
            strokeWidth: 2,
            shadowColor: 'rgba(0,0,0,0.3)',
            shadowBlur: 4,
            shadowOffset: { x: 2, y: 2 },
            shadowOpacity: 0.3
        });
        
        // Create player label
        const playerLabel = new Konva.Text({
            x: -tokenSize * 0.8,
            y: -fontSize * 0.5,
            text: position,
            fontSize: fontSize,
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold',
            fill: '#ffffff',
            align: 'center',
            width: tokenSize * 1.6
        });
        
        playerGroup.add(playerCircle);
        playerGroup.add(playerLabel);
        
        // Store player data
        playerGroup.setAttrs({
            position: position,
            team: team,
            index: index,
            originalSize: tokenSize,
            isOnCourt: false
        });
        
        // Add event listeners
        this.addPlayerEventListeners(playerGroup);
        
        this.players.push(playerGroup);
        this.playersLayer.add(playerGroup);
        
        return playerGroup;
    }
    
    addPlayerEventListeners(playerGroup) {
        // Drag start
        playerGroup.on('dragstart', (_e) => {
            this.selectedPlayer = playerGroup;
            playerGroup.moveToTop();
            
            // Scale up slightly
            playerGroup.to({
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 0.1
            });
            
            // Add shadow
            const circle = playerGroup.findOne('Circle');
            circle.shadowBlur(8);
            circle.shadowOpacity(0.5);
            
            this.playersLayer.draw();
        });
        
        // Drag move
        playerGroup.on('dragmove', (e) => {
            const pos = playerGroup.position();
            const bounds = this.courtManager.getCourtBounds();
            const tokenSize = playerGroup.getAttr('originalSize');
            
            // Keep player within reasonable bounds (court + margins)
            const margin = 50;
            const constrainedPos = {
                x: Math.max(-margin, Math.min(bounds.right + margin, pos.x)),
                y: Math.max(-margin, Math.min(bounds.bottom + margin, pos.y))
            };
            
            playerGroup.position(constrainedPos);
        });
        
        // Drag end
        playerGroup.on('dragend', (_e) => {
            // Scale back to normal
            playerGroup.to({
                scaleX: 1,
                scaleY: 1,
                duration: 0.1
            });
            
            // Reset shadow
            const circle = playerGroup.findOne('Circle');
            circle.shadowBlur(4);
            circle.shadowOpacity(0.3);
            
            // Check if player is on court
            const pos = playerGroup.position();
            const isOnCourt = this.courtManager.isWithinCourt(pos.x, pos.y);
            playerGroup.setAttr('isOnCourt', isOnCourt);
            
            // Snap to court bounds if partially outside
            if (!isOnCourt) {
                this.snapToCourtBounds(playerGroup);
            }
            
            this.playersLayer.draw();
            this.selectedPlayer = null;
        });
        
        // Hover effects
        playerGroup.on('mouseenter', () => {
            if (playerGroup !== this.selectedPlayer) {
                playerGroup.to({
                    scaleX: 1.05,
                    scaleY: 1.05,
                    duration: 0.1
                });
            }
            document.body.style.cursor = 'pointer';
        });
        
        playerGroup.on('mouseleave', () => {
            if (playerGroup !== this.selectedPlayer) {
                playerGroup.to({
                    scaleX: 1,
                    scaleY: 1,
                    duration: 0.1
                });
            }
            document.body.style.cursor = 'default';
        });
        
        // Touch events for mobile
        playerGroup.on('touchstart', (e) => {
            e.evt.preventDefault();
        });
    }
    
    snapToCourtBounds(playerGroup) {
        const pos = playerGroup.position();
        const bounds = this.courtManager.getCourtBounds();
        const tokenSize = playerGroup.getAttr('originalSize');
        
        let newX = pos.x;
        let newY = pos.y;
        
        // If player is close to court bounds, snap to inside
        const snapDistance = tokenSize * 2;
        
        if (pos.x < bounds.left + snapDistance && pos.x > bounds.left - snapDistance) {
            newX = bounds.left + tokenSize;
        } else if (pos.x > bounds.right - snapDistance && pos.x < bounds.right + snapDistance) {
            newX = bounds.right - tokenSize;
        }
        
        if (pos.y < bounds.top + snapDistance && pos.y > bounds.top - snapDistance) {
            newY = bounds.top + tokenSize;
        } else if (pos.y > bounds.bottom - snapDistance && pos.y < bounds.bottom + snapDistance) {
            newY = bounds.bottom - tokenSize;
        }
        
        if (newX !== pos.x || newY !== pos.y) {
            playerGroup.to({
                x: newX,
                y: newY,
                duration: 0.2,
                easing: Konva.Easings.EaseOut
            });
            
            playerGroup.setAttr('isOnCourt', true);
        }
    }
    
    positionPlayersOffCourt() {
        const bounds = this.courtManager.getCourtBounds();
        const tokenSize = this.players[0].getAttr('originalSize');
        const spacing = tokenSize * 2.5;
        
        // Position blue team on left side of court
        this.players.slice(0, 7).forEach((player, index) => {
            player.position({
                x: bounds.left - spacing,
                y: bounds.top + index * spacing
            });
            player.setAttr('isOnCourt', false);
        });
        
        // Position teal team on right side of court
        this.players.slice(7, 14).forEach((player, index) => {
            player.position({
                x: bounds.right + spacing,
                y: bounds.top + index * spacing
            });
            player.setAttr('isOnCourt', false);
        });
    }
    
    positionPlayersOnCourt() {
        const bounds = this.courtManager.getCourtBounds();
        const centerY = bounds.top + (bounds.bottom - bounds.top) / 2;
        
        // Standard netball starting positions
        const bluePositions = {
            'GS': { x: bounds.left + (bounds.right - bounds.left) * 0.1, y: centerY },
            'GA': { x: bounds.left + (bounds.right - bounds.left) * 0.25, y: centerY },
            'WA': { x: bounds.left + (bounds.right - bounds.left) * 0.4, y: centerY },
            'C': { x: bounds.left + (bounds.right - bounds.left) * 0.45, y: centerY },
            'WD': { x: bounds.left + (bounds.right - bounds.left) * 0.55, y: centerY },
            'GD': { x: bounds.left + (bounds.right - bounds.left) * 0.75, y: centerY },
            'GK': { x: bounds.left + (bounds.right - bounds.left) * 0.9, y: centerY }
        };
        
        const tealPositions = {
            'GS': { x: bounds.left + (bounds.right - bounds.left) * 0.9, y: centerY },
            'GA': { x: bounds.left + (bounds.right - bounds.left) * 0.75, y: centerY },
            'WA': { x: bounds.left + (bounds.right - bounds.left) * 0.6, y: centerY },
            'C': { x: bounds.left + (bounds.right - bounds.left) * 0.55, y: centerY },
            'WD': { x: bounds.left + (bounds.right - bounds.left) * 0.45, y: centerY },
            'GD': { x: bounds.left + (bounds.right - bounds.left) * 0.25, y: centerY },
            'GK': { x: bounds.left + (bounds.right - bounds.left) * 0.1, y: centerY }
        };
        
        // Position players with animation
        this.players.forEach((player) => {
            const position = player.getAttr('position');
            const team = player.getAttr('team');
            const targetPos = team === 'blue' ? bluePositions[position] : tealPositions[position];
            
            if (targetPos) {
                player.to({
                    x: targetPos.x,
                    y: targetPos.y,
                    duration: 0.5,
                    easing: Konva.Easings.EaseOut
                });
                
                player.setAttr('isOnCourt', true);
            }
        });
        
        this.playersLayer.draw();
    }
    
    clearPlayersFromCourt() {
        this.positionPlayersOffCourt();
        this.playersLayer.draw();
    }
    
    updatePlayerSizes() {
        const dimensions = this.courtManager.getCourtDimensions();
        const tokenSize = Math.max(20, dimensions.scale * 8);
        const fontSize = Math.max(8, tokenSize * 0.3);
        
        this.players.forEach((player) => {
            const circle = player.findOne('Circle');
            const label = player.findOne('Text');
            
            circle.radius(tokenSize);
            label.fontSize(fontSize);
            label.width(tokenSize * 1.6);
            label.x(-tokenSize * 0.8);
            label.y(-fontSize * 0.5);
            
            player.setAttr('originalSize', tokenSize);
        });
        
        this.playersLayer.draw();
    }
    
    setupCourtResize() {
        document.addEventListener('courtResize', () => {
            this.updatePlayerSizes();
            
            // Reposition off-court players
            this.players.forEach((player) => {
                if (!player.getAttr('isOnCourt')) {
                    // Keep players off-court after resize
                    const team = player.getAttr('team');
                    const index = player.getAttr('index');
                    const bounds = this.courtManager.getCourtBounds();
                    const tokenSize = player.getAttr('originalSize');
                    const spacing = tokenSize * 2.5;
                    
                    if (team === 'blue') {
                        player.position({
                            x: bounds.left - spacing,
                            y: bounds.top + index * spacing
                        });
                    } else {
                        player.position({
                            x: bounds.right + spacing,
                            y: bounds.top + index * spacing
                        });
                    }
                }
            });
            
            this.playersLayer.draw();
        });
    }
    
    getPlayerByPosition(position, team) {
        return this.players.find(player => 
            player.getAttr('position') === position && 
            player.getAttr('team') === team
        );
    }
    
    getPlayersOnCourt() {
        return this.players.filter(player => player.getAttr('isOnCourt'));
    }
    
    getPlayersOffCourt() {
        return this.players.filter(player => !player.getAttr('isOnCourt'));
    }
    
    getAllPlayers() {
        return this.players;
    }
    
    getPlayerData() {
        return this.players.map(player => ({
            position: player.getAttr('position'),
            team: player.getAttr('team'),
            x: player.x(),
            y: player.y(),
            isOnCourt: player.getAttr('isOnCourt')
        }));
    }
    
    setPlayerData(data) {
        data.forEach(playerData => {
            const player = this.getPlayerByPosition(playerData.position, playerData.team);
            if (player) {
                player.position({ x: playerData.x, y: playerData.y });
                player.setAttr('isOnCourt', playerData.isOnCourt);
            }
        });
        
        this.playersLayer.draw();
    }
}
