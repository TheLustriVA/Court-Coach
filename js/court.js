// Court drawing and management for Court Coach

class CourtManager {
    constructor(container, stage) {
        this.container = container;
        this.stage = stage;
        this.layer = new Konva.Layer();
        this.stage.add(this.layer);
        
        this.courtWidth = 0;
        this.courtHeight = 0;
        this.scale = 1;
        
        this.initCourt();
        this.setupResize();
    }
    
    initCourt() {
        this.calculateDimensions();
        this.drawCourt();
        this.layer.draw();
    }
    
    calculateDimensions() {
        // Use stage dimensions directly (already set by app.js)
        const stageWidth = this.stage.width();
        const stageHeight = this.stage.height();
        
        // Official netball court dimensions (30.5m x 15.25m)
        const courtRatio = 30.5 / 15.25; // 2:1 approximately
        
        // Calculate court dimensions to fit stage with padding
        const padding = 40;
        let courtWidth = stageWidth - padding * 2;
        let courtHeight = courtWidth / courtRatio;
        
        if (courtHeight > stageHeight - padding * 2) {
            courtHeight = stageHeight - padding * 2;
            courtWidth = courtHeight * courtRatio;
        }
        
        // Ensure minimum sizes
        courtWidth = Math.max(300, courtWidth);
        courtHeight = Math.max(150, courtHeight);
        
        this.courtWidth = courtWidth;
        this.courtHeight = courtHeight;
        this.scale = courtWidth / 305; // Scale factor (305 units = 30.5m)
        
        // Calculate court position to center it in the stage
        this.courtX = (stageWidth - courtWidth) / 2;
        this.courtY = (stageHeight - courtHeight) / 2;
    }
    
    drawCourt() {
        // Clear existing court
        this.layer.destroyChildren();
        
        const lineWidth = 3;
        const lineColor = '#000000';
        
        // Court outline - positioned at calculated center
        const courtOutline = new Konva.Rect({
            x: this.courtX,
            y: this.courtY,
            width: this.courtWidth,
            height: this.courtHeight,
            stroke: lineColor,
            strokeWidth: lineWidth,
            fill: 'transparent'
        });
        this.layer.add(courtOutline);
        
        // Third lines (dividing court into three equal sections)
        const thirdWidth = this.courtWidth / 3;
        
        // First third line
        const firstThirdLine = new Konva.Line({
            points: [this.courtX + thirdWidth, this.courtY, this.courtX + thirdWidth, this.courtY + this.courtHeight],
            stroke: lineColor,
            strokeWidth: lineWidth
        });
        this.layer.add(firstThirdLine);
        
        // Second third line
        const secondThirdLine = new Konva.Line({
            points: [this.courtX + thirdWidth * 2, this.courtY, this.courtX + thirdWidth * 2, this.courtY + this.courtHeight],
            stroke: lineColor,
            strokeWidth: lineWidth
        });
        this.layer.add(secondThirdLine);
        
        // Goal circles
        const circleRadius = this.scale * 49; // 4.9m radius
        const circleCenterY = this.courtY + this.courtHeight / 2;
        
        // Left goal circle
        const leftGoalCircle = new Konva.Arc({
            x: this.courtX,
            y: circleCenterY,
            innerRadius: circleRadius,
            outerRadius: circleRadius,
            angle: 180,
            rotation: -90,
            stroke: lineColor,
            strokeWidth: lineWidth,
            fill: 'transparent'
        });
        this.layer.add(leftGoalCircle);
        
        // Right goal circle
        const rightGoalCircle = new Konva.Arc({
            x: this.courtX + this.courtWidth,
            y: circleCenterY,
            innerRadius: circleRadius,
            outerRadius: circleRadius,
            angle: 180,
            rotation: 90,
            stroke: lineColor,
            strokeWidth: lineWidth,
            fill: 'transparent'
        });
        this.layer.add(rightGoalCircle);
        
        // Center circle
        const centerCircleRadius = this.scale * 9; // 0.9m radius
        const centerCircle = new Konva.Circle({
            x: this.courtX + this.courtWidth / 2,
            y: circleCenterY,
            radius: centerCircleRadius,
            stroke: lineColor,
            strokeWidth: lineWidth,
            fill: 'transparent'
        });
        this.layer.add(centerCircle);
        
        // Goal posts (visual indicators)
        const goalPostWidth = 4;
        const goalPostHeight = 12;
        
        // Left goal post
        const leftGoalPost = new Konva.Rect({
            x: this.courtX - goalPostWidth / 2,
            y: circleCenterY - goalPostHeight / 2,
            width: goalPostWidth,
            height: goalPostHeight,
            fill: lineColor,
            stroke: lineColor,
            strokeWidth: 1
        });
        this.layer.add(leftGoalPost);
        
        // Right goal post
        const rightGoalPost = new Konva.Rect({
            x: this.courtX + this.courtWidth - goalPostWidth / 2,
            y: circleCenterY - goalPostHeight / 2,
            width: goalPostWidth,
            height: goalPostHeight,
            fill: lineColor,
            stroke: lineColor,
            strokeWidth: 1
        });
        this.layer.add(rightGoalPost);
        
        // Add court labels
        this.addCourtLabels();
    }
    
    addCourtLabels() {
        const labelFontSize = Math.max(10, this.scale * 3);
        const labelColor = '#666666';
        
        // Goal thirds labels
        const leftGoalLabel = new Konva.Text({
            x: this.courtX + this.courtWidth / 6 - 30,
            y: this.courtY + this.courtHeight - 25,
            text: 'Goal Third',
            fontSize: labelFontSize,
            fontFamily: 'Arial',
            fill: labelColor,
            align: 'center',
            width: 60
        });
        this.layer.add(leftGoalLabel);
        
        const rightGoalLabel = new Konva.Text({
            x: this.courtX + this.courtWidth * 5 / 6 - 30,
            y: this.courtY + this.courtHeight - 25,
            text: 'Goal Third',
            fontSize: labelFontSize,
            fontFamily: 'Arial',
            fill: labelColor,
            align: 'center',
            width: 60
        });
        this.layer.add(rightGoalLabel);
        
        // Center third label
        const centerLabel = new Konva.Text({
            x: this.courtX + this.courtWidth / 2 - 30,
            y: this.courtY + this.courtHeight - 25,
            text: 'Center Third',
            fontSize: labelFontSize,
            fontFamily: 'Arial',
            fill: labelColor,
            align: 'center',
            width: 60
        });
        this.layer.add(centerLabel);
    }
    
    setupResize() {
        const resizeObserver = new ResizeObserver(() => {
            this.handleResize();
        });
        
        resizeObserver.observe(this.container);
        
        // Also handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    handleResize() {
        // Debounce resize events
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.calculateDimensions();
            this.drawCourt();
            this.layer.draw();
            
            // Notify other components about resize
            this.notifyResize();
        }, 100);
    }
    
    notifyResize() {
        // Dispatch custom event for other components
        const event = new CustomEvent('courtResize', {
            detail: {
                courtWidth: this.courtWidth,
                courtHeight: this.courtHeight,
                scale: this.scale
            }
        });
        document.dispatchEvent(event);
    }
    
    getCourtDimensions() {
        return {
            width: this.courtWidth,
            height: this.courtHeight,
            scale: this.scale
        };
    }
    
    getCourtBounds() {
        return {
            left: this.courtX,
            top: this.courtY,
            right: this.courtX + this.courtWidth,
            bottom: this.courtY + this.courtHeight
        };
    }
    
    isWithinCourt(x, y) {
        return x >= this.courtX && x <= this.courtX + this.courtWidth && 
               y >= this.courtY && y <= this.courtY + this.courtHeight;
    }
    
    getThirdBounds(third) {
        const thirdWidth = this.courtWidth / 3;
        
        switch (third) {
        case 'left':
            return {
                left: this.courtX,
                top: this.courtY,
                right: this.courtX + thirdWidth,
                bottom: this.courtY + this.courtHeight
            };
        case 'center':
            return {
                left: this.courtX + thirdWidth,
                top: this.courtY,
                right: this.courtX + thirdWidth * 2,
                bottom: this.courtY + this.courtHeight
            };
        case 'right':
            return {
                left: this.courtX + thirdWidth * 2,
                top: this.courtY,
                right: this.courtX + this.courtWidth,
                bottom: this.courtY + this.courtHeight
            };
        default:
            return this.getCourtBounds();
        }
    }
    
    getGoalCircleBounds(side) {
        const circleRadius = this.scale * 49; // 4.9m radius
        const circleCenterY = this.courtY + this.courtHeight / 2;
        
        if (side === 'left') {
            return {
                centerX: this.courtX,
                centerY: circleCenterY,
                radius: circleRadius,
                left: this.courtX,
                top: circleCenterY - circleRadius,
                right: this.courtX + circleRadius,
                bottom: circleCenterY + circleRadius
            };
        } else if (side === 'right') {
            return {
                centerX: this.courtX + this.courtWidth,
                centerY: circleCenterY,
                radius: circleRadius,
                left: this.courtX + this.courtWidth - circleRadius,
                top: circleCenterY - circleRadius,
                right: this.courtX + this.courtWidth,
                bottom: circleCenterY + circleRadius
            };
        }
        
        return null;
    }
    
    getCenterCircleBounds() {
        const centerCircleRadius = this.scale * 9; // 0.9m radius
        const centerX = this.courtX + this.courtWidth / 2;
        const centerY = this.courtY + this.courtHeight / 2;
        
        return {
            centerX: centerX,
            centerY: centerY,
            radius: centerCircleRadius,
            left: centerX - centerCircleRadius,
            top: centerY - centerCircleRadius,
            right: centerX + centerCircleRadius,
            bottom: centerY + centerCircleRadius
        };
    }
}
