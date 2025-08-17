// Player class for Butterfly Nebula Brawl
// Represents the butterfly character controlled by the player

window.Player = class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.speed = 300; // pixels per second
    this.health = 3;
    this.maxHealth = 3;
    
    // Movement
    this.vx = 0;
    this.vy = 0;
    
    // Visual properties
    this.wingFlap = 0;
    this.wingFlapSpeed = 10;
    
    // Power-ups
    this.powerUps = {
      shield: { active: false, duration: 0 },
      speed: { active: false, duration: 0, multiplier: 1.5 },
      blaster: { active: false, duration: 0 }
    };
    
    // Selected flutterer appearance
    this.flutterer = {
      id: 'basic_cosmic',
      colors: {
        body: '#8B4513',
        wing1: '#FF6B9D',
        wing2: '#FF8FA3',
        accent: '#FFFFFF'
      }
    };
  }
  
  update(deltaTime, inputHandler, canvasWidth, canvasHeight) {
    const dt = deltaTime / 1000; // Convert to seconds
    
    // Handle input
    this.handleInput(inputHandler, dt);
    
    // Update power-ups
    this.updatePowerUps(dt);
    
    // Update position
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    
    // Keep within bounds
    this.x = Math.max(this.width/2, Math.min(canvasWidth - this.width/2, this.x));
    this.y = Math.max(this.height/2, Math.min(canvasHeight - this.height/2, this.y));
    
    // Update visual effects
    this.wingFlap += this.wingFlapSpeed * dt;
  }
  
  handleInput(inputHandler, deltaTime) {
    this.vx = 0;
    this.vy = 0;
    
    const currentSpeed = this.speed * (this.powerUps.speed.active ? this.powerUps.speed.multiplier : 1);
    
    // Keyboard input
    if (inputHandler.isKeyPressed('ArrowLeft') || inputHandler.isKeyPressed('KeyA')) {
      this.vx = -currentSpeed;
    }
    if (inputHandler.isKeyPressed('ArrowRight') || inputHandler.isKeyPressed('KeyD')) {
      this.vx = currentSpeed;
    }
    if (inputHandler.isKeyPressed('ArrowUp') || inputHandler.isKeyPressed('KeyW')) {
      this.vy = -currentSpeed;
    }
    if (inputHandler.isKeyPressed('ArrowDown') || inputHandler.isKeyPressed('KeyS')) {
      this.vy = currentSpeed;
    }
    
    // Touch/mouse input for mobile
    if (inputHandler.isTouchActive()) {
      const touch = inputHandler.getTouchPosition();
      const dx = touch.x - this.x;
      const dy = touch.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 20) { // Dead zone
        this.vx = (dx / distance) * currentSpeed;
        this.vy = (dy / distance) * currentSpeed;
      }
    }
  }
  
  updatePowerUps(deltaTime) {
    // Update power-up durations
    Object.keys(this.powerUps).forEach(key => {
      if (this.powerUps[key].active) {
        this.powerUps[key].duration -= deltaTime;
        if (this.powerUps[key].duration <= 0) {
          this.powerUps[key].active = false;
          this.powerUps[key].duration = 0;
        }
      }
    });
  }
  
  takeDamage(amount = 1) {
    if (this.powerUps.shield.active) {
      return false; // No damage when shielded
    }
    
    this.health -= amount;
    if (this.health <= 0) {
      this.health = 0;
      return true; // Player died
    }
    return false;
  }
  
  heal(amount = 1) {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }
  
  activatePowerUp(type, duration = 5000) {
    if (this.powerUps[type]) {
      this.powerUps[type].active = true;
      this.powerUps[type].duration = duration / 1000; // Convert to seconds
    }
  }
  
  setFlutterer(flutterer) {
    this.flutterer = flutterer;
  }
  
  // Collision detection
  getBounds() {
    return {
      x: this.x - this.width/2,
      y: this.y - this.height/2,
      width: this.width,
      height: this.height
    };
  }
  
  collidesWith(other) {
    const playerBounds = this.getBounds();
    const otherBounds = other.getBounds ? other.getBounds() : other;
    
    return playerBounds.x < otherBounds.x + otherBounds.width &&
           playerBounds.x + playerBounds.width > otherBounds.x &&
           playerBounds.y < otherBounds.y + otherBounds.height &&
           playerBounds.y + playerBounds.height > otherBounds.y;
  }
}