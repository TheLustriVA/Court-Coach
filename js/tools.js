// Drawing tools for Court Coach

class ToolManager {
    constructor(stage, courtManager) {
        this.stage = stage;
        this.courtManager = courtManager;
        this.drawingLayer = new Konva.Layer();
        this.stage.add(this.drawingLayer);
        
        this.currentTool = 'select';
        this.isDrawing = false;
        this.currentArrow = null;
        this.arrows = [];
        
        this.setupToolEvents();
        this.setupCanvasEvents();
    }
    
    setupToolEvents() {
        // Tool button event listeners
        document.getElementById('selectTool').addEventListener('click', () => {
            this.setActiveTool('select');
        });
        
        document.getElementById('arrowTool').addEventListener('click', () => {
            this.setActiveTool('arrow');
        });
        
        document.getElementById('eraseTool').addEventListener('click', () => {
            this.setActiveTool('erase');
        });
    }
    
    setupCanvasEvents() {
        // Mouse events
        this.stage.on('mousedown touchstart', (e) => {
            if (e.target === this.stage) {
                this.handlePointerDown(e);
            }
        });
        
        this.stage.on('mousemove touchmove', (e) => {
            if (this.isDrawing) {
                this.handlePointerMove(e);
            }
        });
        
        this.stage.on('mouseup touchend', (e) => {
            if (this.isDrawing) {
                this.handlePointerUp(e);
            }
        });
        
        // Handle clicks on arrows for erasing
        this.stage.on('click tap', (e) => {
            if (this.currentTool === 'erase' && e.target.name && e.target.name() === 'arrow') {
                this.removeArrow(e.target.parent);
            }
        });
    }
    
    setActiveTool(tool) {
        this.currentTool = tool;
        
        // Update UI
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.getElementById(`${tool}Tool`).classList.add('active');
        
        // Update cursor
        this.updateCursor();
        
        // Update stage interaction
        this.updateStageInteraction();
    }
    
    updateCursor() {
        const container = this.stage.container();
        
        switch (this.currentTool) {
        case 'select':
            container.style.cursor = 'default';
            break;
        case 'arrow':
            container.style.cursor = 'crosshair';
            break;
        case 'erase':
            container.style.cursor = 'pointer';
            break;
        }
    }
    
    updateStageInteraction() {
        // Enable/disable dragging based on tool
        if (this.currentTool === 'select') {
            this.stage.draggable(false);
        } else {
            this.stage.draggable(false);
        }
    }
    
    handlePointerDown(e) {
        if (this.currentTool !== 'arrow') return;
        
        const pos = this.stage.getPointerPosition();
        if (!pos) return;
        
        // Check if click is within court bounds
        if (!this.courtManager.isWithinCourt(pos.x, pos.y)) {
            return;
        }
        
        this.isDrawing = true;
        this.startArrowDraw(pos);
    }
    
    handlePointerMove(e) {
        if (!this.isDrawing || this.currentTool !== 'arrow') return;
        
        const pos = this.stage.getPointerPosition();
        if (!pos) return;
        
        this.updateArrowDraw(pos);
    }
    
    handlePointerUp(e) {
        if (!this.isDrawing || this.currentTool !== 'arrow') return;
        
        this.isDrawing = false;
        this.finishArrowDraw();
    }
    
    startArrowDraw(startPos) {
        const arrowGroup = new Konva.Group({
            name: 'arrow-group'
        });
        
        // Create arrow line
        const arrowLine = new Konva.Line({
            points: [startPos.x, startPos.y, startPos.x, startPos.y],
            stroke: '#ff4444',
            strokeWidth: 3,
            lineCap: 'round',
            lineJoin: 'round',
            name: 'arrow'
        });
        
        // Create arrowhead
        const arrowHead = new Konva.Line({
            points: [],
            stroke: '#ff4444',
            strokeWidth: 3,
            fill: '#ff4444',
            closed: true,
            name: 'arrow'
        });
        
        arrowGroup.add(arrowLine);
        arrowGroup.add(arrowHead);
        
        this.drawingLayer.add(arrowGroup);
        this.currentArrow = arrowGroup;
        this.drawingLayer.draw();
    }
    
    updateArrowDraw(currentPos) {
        if (!this.currentArrow) return;
        
        const arrowLine = this.currentArrow.findOne('Line');
        const arrowHead = this.currentArrow.findOne('Line:nth-child(2)');
        
        if (!arrowLine || !arrowHead) return;
        
        const points = arrowLine.points();
        const startX = points[0];
        const startY = points[1];
        
        // Update line
        arrowLine.points([startX, startY, currentPos.x, currentPos.y]);
        
        // Calculate arrowhead
        const headSize = 12;
        const angle = Math.atan2(currentPos.y - startY, currentPos.x - startX);
        
        const arrowHeadPoints = [
            currentPos.x,
            currentPos.y,
            currentPos.x - headSize * Math.cos(angle - Math.PI / 6),
            currentPos.y - headSize * Math.sin(angle - Math.PI / 6),
            currentPos.x - headSize * Math.cos(angle + Math.PI / 6),
            currentPos.y - headSize * Math.sin(angle + Math.PI / 6)
        ];
        
        arrowHead.points(arrowHeadPoints);
        
        this.drawingLayer.draw();
    }
    
    finishArrowDraw() {
        if (!this.currentArrow) return;
        
        const arrowLine = this.currentArrow.findOne('Line');
        const points = arrowLine.points();
        
        // Check if arrow is too short
        const distance = Math.sqrt(
            Math.pow(points[2] - points[0], 2) + 
            Math.pow(points[3] - points[1], 2)
        );
        
        if (distance < 20) {
            // Remove arrow if too short
            this.currentArrow.destroy();
            this.drawingLayer.draw();
        } else {
            // Add hover effects to arrow
            this.addArrowInteraction(this.currentArrow);
            this.arrows.push(this.currentArrow);
        }
        
        this.currentArrow = null;
    }
    
    addArrowInteraction(arrowGroup) {
        // Add hover effects for erase tool
        arrowGroup.on('mouseenter', () => {
            if (this.currentTool === 'erase') {
                const arrowLine = arrowGroup.findOne('Line');
                const arrowHead = arrowGroup.findOne('Line:nth-child(2)');
                
                arrowLine.stroke('#ff6666');
                arrowHead.stroke('#ff6666');
                arrowHead.fill('#ff6666');
                
                this.drawingLayer.draw();
                document.body.style.cursor = 'pointer';
            }
        });
        
        arrowGroup.on('mouseleave', () => {
            if (this.currentTool === 'erase') {
                const arrowLine = arrowGroup.findOne('Line');
                const arrowHead = arrowGroup.findOne('Line:nth-child(2)');
                
                arrowLine.stroke('#ff4444');
                arrowHead.stroke('#ff4444');
                arrowHead.fill('#ff4444');
                
                this.drawingLayer.draw();
                document.body.style.cursor = 'default';
            }
        });
    }
    
    removeArrow(arrowGroup) {
        const index = this.arrows.indexOf(arrowGroup);
        if (index > -1) {
            this.arrows.splice(index, 1);
        }
        
        arrowGroup.destroy();
        this.drawingLayer.draw();
    }
    
    clearAllArrows() {
        this.arrows.forEach(arrow => {
            arrow.destroy();
        });
        
        this.arrows = [];
        this.drawingLayer.draw();
    }
    
    getArrowData() {
        return this.arrows.map(arrow => {
            const arrowLine = arrow.findOne('Line');
            const points = arrowLine.points();
            
            return {
                startX: points[0],
                startY: points[1],
                endX: points[2],
                endY: points[3]
            };
        });
    }
    
    setArrowData(arrowData) {
        this.clearAllArrows();
        
        arrowData.forEach(data => {
            this.recreateArrow(data);
        });
        
        this.drawingLayer.draw();
    }
    
    recreateArrow(data) {
        const arrowGroup = new Konva.Group({
            name: 'arrow-group'
        });
        
        // Create arrow line
        const arrowLine = new Konva.Line({
            points: [data.startX, data.startY, data.endX, data.endY],
            stroke: '#ff4444',
            strokeWidth: 3,
            lineCap: 'round',
            lineJoin: 'round',
            name: 'arrow'
        });
        
        // Create arrowhead
        const headSize = 12;
        const angle = Math.atan2(data.endY - data.startY, data.endX - data.startX);
        
        const arrowHeadPoints = [
            data.endX,
            data.endY,
            data.endX - headSize * Math.cos(angle - Math.PI / 6),
            data.endY - headSize * Math.sin(angle - Math.PI / 6),
            data.endX - headSize * Math.cos(angle + Math.PI / 6),
            data.endY - headSize * Math.sin(angle + Math.PI / 6)
        ];
        
        const arrowHead = new Konva.Line({
            points: arrowHeadPoints,
            stroke: '#ff4444',
            strokeWidth: 3,
            fill: '#ff4444',
            closed: true,
            name: 'arrow'
        });
        
        arrowGroup.add(arrowLine);
        arrowGroup.add(arrowHead);
        
        this.addArrowInteraction(arrowGroup);
        this.drawingLayer.add(arrowGroup);
        this.arrows.push(arrowGroup);
    }
    
    getCurrentTool() {
        return this.currentTool;
    }
    
    getArrowCount() {
        return this.arrows.length;
    }
    
    // Keyboard shortcuts
    handleKeyDown(e) {
        switch (e.key) {
        case '1':
        case 's':
            this.setActiveTool('select');
            break;
        case '2':
        case 'a':
            this.setActiveTool('arrow');
            break;
        case '3':
        case 'e':
            this.setActiveTool('erase');
            break;
        case 'Escape':
            this.setActiveTool('select');
            break;
        case 'Delete':
        case 'Backspace':
            if (this.currentTool === 'erase') {
                this.clearAllArrows();
            }
            break;
        }
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only handle shortcuts if not in an input field
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                this.handleKeyDown(e);
            }
        });
    }
}
