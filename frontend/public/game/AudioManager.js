window.AudioManager = class AudioManager {
  constructor() {
    // BALANCED AUDIO: Music enabled, annoying SFX disabled
    this.musicDisabled = false; // MUSIC ENABLED - but with single audio element
    this.sfxDisabled = true; // SOUND EFFECTS DISABLED - too annoying
    this.musicVolume = 0.25; // Quiet background music
    this.sfxVolume = 0.0; // No sound effects
    this.masterVolume = 0.6; // Moderate master volume
    
    // SINGLE PERSISTENT AUDIO ELEMENT - the key to preventing overlap!
    this.audioElement = new Audio();
    this.audioElement.volume = this.musicVolume * this.masterVolume;
    this.audioElement.loop = true;
    this.audioElement.preload = 'auto';
    
    // Track current playing track for reference
    this.currentTrackPath = null;
    
    // Audio context for advanced audio features
    this.audioContext = null;
    
    // COMPLETE LEVEL MUSIC MAPPING - 15 UNIQUE TRACKS + INTRO (ZERO REPETITION!)
    this.levelMusicMap = {
      // INTRO SCREEN - Epic welcome music
      'intro': '/sounds/intro-cinematic-battle-score.mp3',
      
      // EXPLORATION PHASE (Levels 1-5) - Original space ambience uploads
      1: '/sounds/level1-space-epic-cinematic.mp3',        // Epic opening
      2: '/sounds/level2-traveling-through-space.mp3',     // Journey begins
      3: '/sounds/level3-lost-in-space.mp3',               // Mystery & danger
      4: '/sounds/level4-space-music.mp3',                 // Cosmic ambience
      5: '/sounds/level5-space-clouds-velvet.mp3',         // Ethereal beauty
      
      // ADVENTURE PHASE (Levels 6-10) - Second wave space uploads  
      6: '/sounds/level6-space-travel.mp3',                // Space travel adventure
      7: '/sounds/level7-space-flight.mp3',                // Dynamic flight
      8: '/sounds/level8-calm-space-music.mp3',            // Calm before storm
      9: '/sounds/level9-ambient-space-arpeggio.mp3',      // Building tension
      10: '/sounds/level10-space-ambient.mp3',             // Deep space mystery
      
      // FINAL BATTLE PHASE (Levels 11-15) - Epic battle finale uploads
      11: '/sounds/level11-epic-cinematic-battle.mp3',     // Epic battle begins
      12: '/sounds/level12-glorious-army-battle.mp3',      // Glorious army march
      13: '/sounds/level13-war-battle-military.mp3',       // Military war intensity
      14: '/sounds/level14-z-battle-finale.mp3',           // Z-Battle finale prep
      15: '/sounds/level5-space-clouds-velvet.mp3'         // MOTHER INSECT BOSS - Ethereal finale
    };
    
    // Initialize audio context
    this.initializeAudioContext();
    console.log('🎵 AudioManager initialized with SINGLE AUDIO ELEMENT - no overlap possible!');
    console.log('🎵 Music: ON (quiet), Sound Effects: OFF (annoying sounds disabled)');
  }
  
  initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      console.log('Audio context initialized successfully');
    } catch (e) {
      console.warn('Web Audio API not supported, falling back to HTML5 audio');
    }
  }
  
  // Play intro music - SIMPLE SINGLE AUDIO ELEMENT APPROACH
  playIntroMusic() {
    if (this.musicDisabled) {
      console.log('🔇 Music disabled - no intro music');
      return;
    }
    
    const introMusicPath = this.levelMusicMap['intro'];
    if (!introMusicPath) {
      console.warn('No intro music configured');
      return;
    }
    
    console.log('🎵 SINGLE ELEMENT: Starting intro music');
    
    // SIMPLE APPROACH: Just change the source of the single audio element
    this.audioElement.src = introMusicPath;
    this.currentTrackPath = introMusicPath;
    
    // Try to play
    const playPromise = this.audioElement.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('✅ INTRO MUSIC STARTED - Single element approach');
        })
        .catch(error => {
          console.warn('⚠️ Intro music needs user interaction:', error);
          this.setupUserInteractionMusic();
        });
    }
  }
  
  // Setup music to start on first user interaction
  setupUserInteractionMusic() {
    const startMusicOnClick = () => {
      if (this.audioElement && this.audioElement.paused) {
        console.log('🎵 Starting music on user interaction');
        this.audioElement.play()
          .then(() => {
            console.log('✅ Music started after user interaction!');
            document.removeEventListener('click', startMusicOnClick);
            document.removeEventListener('touchstart', startMusicOnClick);
          })
          .catch(error => {
            console.error('❌ Still cannot play music:', error);
          });
      }
    };
    
    document.addEventListener('click', startMusicOnClick, { once: true });
    document.addEventListener('touchstart', startMusicOnClick, { once: true });
    console.log('🎵 Music will start on first click/touch anywhere on the page');
  }

  // Play level music - SINGLE AUDIO ELEMENT APPROACH WITH BETTER LOGGING
  playLevelMusic(level) {
    if (this.musicDisabled) {
      console.log('🔇 Music disabled - no level music');
      return;
    }
    
    const musicPath = this.levelMusicMap[level];
    if (!musicPath) {
      console.warn(`No music configured for level ${level}`);
      return;
    }
    
    // Check if this is already playing
    if (this.currentTrackPath === musicPath) {
      console.log(`🎵 Level ${level} music already playing - no change needed`);
      return;
    }
    
    console.log(`🎵 MUSIC CHANGE: Level ${level}`);
    console.log(`   FROM: ${this.currentTrackPath || 'none'}`);
    console.log(`   TO: ${musicPath}`);
    
    // FORCE PAUSE AND RESET the single audio element
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
    
    // Change the source - this automatically stops any previous music
    this.audioElement.src = musicPath;
    this.currentTrackPath = musicPath;
    
    console.log(`🔇 STOPPED previous music, STARTING Level ${level} music`);
    
    // Play the new music
    const playPromise = this.audioElement.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log(`✅ Level ${level} music SUCCESSFULLY STARTED - ${musicPath}`);
          console.log(`🎵 Current audio element src: ${this.audioElement.src}`);
        })
        .catch(error => {
          console.warn(`❌ Level ${level} music failed to play:`, error);
        });
    }
  }
  
  // Stop current music - SIMPLE SINGLE ELEMENT APPROACH
  stopMusic() {
    console.log('🔇 Stopping music - single element approach');
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.currentTrackPath = null;
      console.log('🔇 Music stopped successfully');
    }
  }


  // Resume paused music
  resumeMusic() {
    if (this.currentTrack && this.currentTrack.paused) {
      const playPromise = this.currentTrack.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Music resumed successfully');
          })
          .catch(error => {
            console.warn('Failed to resume music:', error);
          });
      }
    }
  }
  
  // Pause current music
  pauseMusic() {
    if (this.currentTrack && !this.currentTrack.paused) {
      this.currentTrack.pause();
      console.log('Music paused');
    }
  }
  
  // Change music level with smooth transition
  changeLevel(newLevel) {
    const newMusicPath = this.levelMusicMap[newLevel];
    const currentPath = this.currentTrack ? this.currentTrack.src : null;
    
    // Only change if different track needed
    if (newMusicPath && !currentPath?.includes(newMusicPath)) {
      console.log(`Changing to Level ${newLevel} music`);
      
      if (this.currentTrack) {
        // Fade out current, then start new
        this.stopMusic(true);
        setTimeout(() => {
          this.playLevelMusic(newLevel);
        }, 1000);
      } else {
        // Start new immediately
        this.playLevelMusic(newLevel);
      }
    }
  }
  
  // Set music volume (0.0 to 1.0)
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.currentTrack) {
      this.currentTrack.volume = this.musicVolume * this.masterVolume;
    }
    console.log(`Music volume set to ${this.musicVolume}`);
  }
  
  // Set master volume (0.0 to 1.0)
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.currentTrack) {
      this.currentTrack.volume = this.musicVolume * this.masterVolume;
    }
    console.log(`Master volume set to ${this.masterVolume}`);
  }
  
  // Toggle music on/off - ENHANCED with proper mute/unmute
  toggleMusic() {
    this.musicDisabled = !this.musicDisabled;
    if (this.musicDisabled) {
      this.mute();
      console.log('🔇 Music disabled via toggle');
    } else {
      this.unmute();
      console.log('🔊 Music enabled via toggle');
    }
    return !this.musicDisabled;
  }
  
  // Enhanced sound effects with sparkles, crunch, buzz/explosions - NOW COMPLETELY DISABLED BY DEFAULT
  playSound(type, options = {}) {
    if (this.sfxDisabled) {
      console.log(`🔇 SOUND EFFECTS DISABLED - Not playing ${type} (prevents annoying sounds)`);
      return;
    }
    
    // If somehow enabled, play at very low volume
    if (!options.volume) options.volume = this.sfxVolume * 0.1;
    
    // Enhanced sound effects using Web Audio API
    if (!this.audioContext) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Enhanced sound effects for different game events
      switch (type) {
        case 'powerup':
        case 'sparkles':
          // Magical sparkle sound - ascending notes
          this.createSparkleEffect(oscillator, gainNode, options);
          break;
          
        case 'collision':
        case 'crunch':
          // Crunchy collision sound - harsh descending tone
          this.createCrunchEffect(oscillator, gainNode, options);
          break;
          
        case 'boss_attack':
        case 'buzz':
          // Buzzing boss attack - menacing buzz
          this.createBuzzEffect(oscillator, gainNode, options);
          break;
          
        case 'explosion':
          // Explosive sound - white noise burst
          this.createExplosionEffect(oscillator, gainNode, options);
          break;
          
        case 'level_start':
          // Level start fanfare
          this.createFanfareEffect(oscillator, gainNode, options);
          break;
          
        case 'victory':
          // Victory celebration
          this.createVictoryEffect(oscillator, gainNode, options);
          break;
          
        default:
          // Default beep
          oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(options.volume * this.masterVolume, this.audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
      }
      
      const duration = options.duration || 0.5;
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
      
    } catch (e) {
      console.warn('Sound effect failed:', e);
    }
  }
  
  createSparkleEffect(oscillator, gainNode, options) {
    // Magical ascending sparkle - like collecting stars
    oscillator.type = 'sine';
    const startFreq = 800;
    const endFreq = 1600;
    const currentTime = this.audioContext.currentTime;
    
    oscillator.frequency.setValueAtTime(startFreq, currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(endFreq, currentTime + 0.3);
    
    // Shimmering volume envelope
    gainNode.gain.setValueAtTime(0, currentTime);
    gainNode.gain.linearRampToValueAtTime(options.volume * this.masterVolume, currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(options.volume * this.masterVolume * 0.7, currentTime + 0.15);
    gainNode.gain.linearRampToValueAtTime(options.volume * this.masterVolume, currentTime + 0.25);
    gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.4);
  }
  
  createCrunchEffect(oscillator, gainNode, options) {
    // Harsh crunchy collision - like hitting an asteroid
    oscillator.type = 'sawtooth';
    const startFreq = 200;
    const endFreq = 50;
    const currentTime = this.audioContext.currentTime;
    
    oscillator.frequency.setValueAtTime(startFreq, currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(endFreq, currentTime + 0.2);
    
    // Sharp attack, quick decay
    gainNode.gain.setValueAtTime(0, currentTime);
    gainNode.gain.linearRampToValueAtTime(options.volume * this.masterVolume, currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.25);
  }
  
  createBuzzEffect(oscillator, gainNode, options) {
    // Menacing boss attack buzz - like insect wings
    oscillator.type = 'sawtooth';
    const baseFreq = 120;
    const currentTime = this.audioContext.currentTime;
    
    // Rapid frequency modulation for buzzing effect
    oscillator.frequency.setValueAtTime(baseFreq, currentTime);
    
    // Create tremolo effect
    const tremolo = this.audioContext.createOscillator();
    const tremoloGain = this.audioContext.createGain();
    
    tremolo.frequency.setValueAtTime(15, currentTime); // 15Hz tremolo
    tremolo.connect(tremoloGain);
    tremoloGain.connect(gainNode.gain);
    tremoloGain.gain.setValueAtTime(0.5, currentTime);
    
    tremolo.start(currentTime);
    tremolo.stop(currentTime + 0.6);
    
    gainNode.gain.setValueAtTime(options.volume * this.masterVolume * 0.8, currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.6);
  }
  
  createExplosionEffect(oscillator, gainNode, options) {
    // Explosive burst - white noise simulation
    oscillator.type = 'sawtooth';
    const currentTime = this.audioContext.currentTime;
    
    // Rapid frequency sweep for explosion effect
    oscillator.frequency.setValueAtTime(300, currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(60, currentTime + 0.1);
    oscillator.frequency.exponentialRampToValueAtTime(30, currentTime + 0.3);
    
    // Sharp attack, medium decay
    gainNode.gain.setValueAtTime(0, currentTime);
    gainNode.gain.linearRampToValueAtTime(options.volume * this.masterVolume, currentTime + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(options.volume * this.masterVolume * 0.3, currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.4);
  }
  
  createFanfareEffect(oscillator, gainNode, options) {
    // Level start fanfare - triumphant ascending notes
    oscillator.type = 'triangle';
    const currentTime = this.audioContext.currentTime;
    
    // Musical fanfare sequence
    oscillator.frequency.setValueAtTime(440, currentTime);        // A
    oscillator.frequency.setValueAtTime(523, currentTime + 0.15); // C
    oscillator.frequency.setValueAtTime(659, currentTime + 0.3);  // E
    
    gainNode.gain.setValueAtTime(0, currentTime);
    gainNode.gain.linearRampToValueAtTime(options.volume * this.masterVolume * 0.7, currentTime + 0.05);
    gainNode.gain.setValueAtTime(options.volume * this.masterVolume * 0.7, currentTime + 0.45);
    gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.6);
  }
  
  createVictoryEffect(oscillator, gainNode, options) {
    // Victory celebration - major chord arpeggio
    oscillator.type = 'sine';
    const currentTime = this.audioContext.currentTime;
    
    // Victory arpeggio: C-E-G-C
    oscillator.frequency.setValueAtTime(523, currentTime);        // C
    oscillator.frequency.setValueAtTime(659, currentTime + 0.1);  // E  
    oscillator.frequency.setValueAtTime(784, currentTime + 0.2);  // G
    oscillator.frequency.setValueAtTime(1047, currentTime + 0.3); // C (octave)
    
    gainNode.gain.setValueAtTime(0, currentTime);
    gainNode.gain.linearRampToValueAtTime(options.volume * this.masterVolume * 0.8, currentTime + 0.05);
    gainNode.gain.setValueAtTime(options.volume * this.masterVolume * 0.8, currentTime + 0.35);
    gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.8);
  }
  
  // Mute all audio
  mute() {
    this.wasMuted = false; // Track previous state
    if (this.currentTrack && !this.currentTrack.paused) {
      this.wasMuted = true;
      this.pauseMusic();
    }
    this.musicVolume = 0;
    this.sfxVolume = 0;
    console.log('🔇 Audio muted');
  }
  
  // Unmute all audio  
  unmute() {
    this.musicVolume = 0.4; // Restore music volume
    this.sfxVolume = 0.6;   // Restore SFX volume
    if (this.wasMuted && this.currentTrack) {
      this.resumeMusic();
    }
    console.log('🔊 Audio unmuted');
  }
  
  // Get current music info
  getMusicInfo() {
    if (!this.currentTrack) return null;
    
    return {
      isPlaying: !this.currentTrack.paused,
      currentTime: this.currentTrack.currentTime,
      duration: this.currentTrack.duration,
      volume: this.musicVolume,
      src: this.currentTrack.src
    };
  }

  // Compatibility methods for existing game code
  playMusic(level) {
    this.playLevelMusic(level);
  }

  playSFX(soundName, options = {}) {
    this.playSound(soundName, options);
  }

  playPowerUpSound(powerUpType = 'default') {
    this.playSound('powerup');
  }

  setSfxVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  // Toggle mute/unmute - SIMPLE APPROACH
  toggleMute() {
    if (this.musicDisabled) {
      this.musicDisabled = false;
      this.audioElement.volume = this.musicVolume * this.masterVolume;
      console.log('🎵 Music enabled');
      return false;
    } else {
      this.musicDisabled = true;
      this.audioElement.pause();
      console.log('🔇 Music disabled');
      return true;
    }
  }

  // Mute all audio - ENHANCED VERSION
  mute() {
    this.wasMuted = false; // Track previous state
    if (this.currentTrack && !this.currentTrack.paused) {
      this.wasMuted = true;
      this.pauseMusic();
    }
    
    // Set volumes to 0 but preserve original values
    this.previousMusicVolume = this.musicVolume;
    this.previousSfxVolume = this.sfxVolume;
    this.musicVolume = 0;
    this.sfxVolume = 0;
    this.musicDisabled = true;
    
    console.log('🔇 All audio muted');
  }
  
  // Unmute all audio - ENHANCED VERSION  
  unmute() {
    // Restore previous volumes or use defaults
    this.musicVolume = this.previousMusicVolume || 0.4;
    this.sfxVolume = this.previousSfxVolume || 0.6;
    this.musicDisabled = false;
    
    if (this.wasMuted && this.currentTrack) {
      this.resumeMusic();
    }
    console.log('🔊 All audio unmuted');
  }

  setAudioQuality(quality) {
    console.log(`Audio quality set to: ${quality}`);
  }

  resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().then(() => {
        console.log('Audio context resumed');
      });
    }
  }

  stopAllAudio() {
    this.stopMusic();
    console.log('All audio stopped');
  }

  enableMusic() {
    this.musicDisabled = false;
    console.log('Music enabled');
  }
};