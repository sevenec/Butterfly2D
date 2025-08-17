// Input Handler for Butterfly Nebula Brawl
// Handles keyboard, mouse, and touch input

window.InputHandler = class InputHandler {
  constructor() {
    this.keys = {};
    this.mouse = { x: 0, y: 0, pressed: false };
    this.touch = { x: 0, y: 0, active: false };
    
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Keyboard events
    document.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      // Prevent default behavior for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
    });
    
    document.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
    
    // Mouse events
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    
    document.addEventListener('mousedown', (e) => {
      this.mouse.pressed = true;
    });
    
    document.addEventListener('mouseup', (e) => {
      this.mouse.pressed = false;
    });
    
    // Touch events for mobile
    document.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        this.touch.x = e.touches[0].clientX;
        this.touch.y = e.touches[0].clientY;
        this.touch.active = true;
      }
      e.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.touch.x = e.touches[0].clientX;
        this.touch.y = e.touches[0].clientY;
      }
      e.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchend', (e) => {
      this.touch.active = false;
      e.preventDefault();
    }, { passive: false });
  }
  
  isKeyPressed(key) {
    return !!this.keys[key];
  }
  
  getMousePosition() {
    return { x: this.mouse.x, y: this.mouse.y };
  }
  
  isMousePressed() {
    return this.mouse.pressed;
  }
  
  getTouchPosition() {
    return { x: this.touch.x, y: this.touch.y };
  }
  
  isTouchActive() {
    return this.touch.active;
  }
}