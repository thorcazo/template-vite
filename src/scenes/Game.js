import { Scene } from 'phaser';
import Zombie from '../objects/Zombie';
import Missile from '../objects/Missile';

export class Game extends Scene {
  balls = null;
  zombies = null;
  missiles = null;
  maxZombies = 10; // Máximo número de zombies en pantalla

  constructor() {
    super('Game');
  }

  preload() {
    this.puntos = 0;
    this.count = 10;
  }

  create() {
    this.scene.launch('UI');
    this.player = this.physics.add.image(200, window.innerHeight / 2, 'player');
    this.currentLetter = '';
    this.wordProgress = {}; // Para rastrear la progresión de las palabras de cada zombie

    this.missiles = this.physics.add.group({
      classType: Missile,
      runChildUpdate: true
    });

    // Función para manejar el input del teclado para las letras
    this.input.keyboard.on('keydown', (event) => {
      this.handleInput(event);
    });

    // this.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.zombies = this.add.group({
      classType: Zombie,
      runChildUpdate: true
    });

    this.time.addEvent({
      delay: 2000,
      callback: this.spawnZombie,
      callbackScope: this,
      loop: true
    });

    this.physics.add.collider(this.zombies);
    this.physics.add.overlap(this.player, this.zombies, this.handlePlayerZombieCollision, null, this);
    this.physics.add.collider(this.missiles, this.zombies, this.handleMissileZombieCollision, null, this);
  }

  handlePlayerZombieCollision(player, zombie) {
    this.scene.pause('Game');
    this.scene.launch('GameOver');
  }

  handleMissileZombieCollision(zombie, missile) {
    missile.destroy();  // Confirma que esto se está llamando realmente.
    console.log("Dentro de handleMissileZombieCollision: -> Zombie.id:" , zombie.id);

    if (zombie && zombie.word) {

      let progress = this.wordProgress[zombie.id] || 0;
      if (missile.letterIndex === progress) {
        
        progress++;  // Incrementa el progreso
        this.wordProgress[zombie.id] = progress;  // Actualiza el progreso
        if (progress === zombie.word.length) {
          zombie.destroy(); // Destruye el zombie si todas las letras han sido acertadas
        }
      }
    }
  }


  update(time, delta) {
    if (this.cursors.down.isDown) {
      this.player.y += 5;
    } else if (this.cursors.up.isDown) {
      this.player.y -= 5;
    } else if (this.cursors.left.isDown) {
      this.player.x -= 5;
    } else if (this.cursors.right.isDown) {
      this.player.x += 5;
    }
  }

  // Modificado para tomar el zombie y el índice de la letra
  fireMissile(zombie, letterIndex) {
    const missile = this.missiles.get(this.player.x, this.player.y, 'missile');
    if (missile) {
      missile.setActive(true);
      missile.setVisible(true);
      missile.setTarget(zombie);
      missile.letterIndex = letterIndex; // Guarda el índice de la letra que debe ser eliminada
    }
  }

  // Encuentra el zombie más cercano
  findClosestZombie() {
    let closestZombie = null;
    let minDist = Infinity;
    this.zombies.getChildren().forEach(zombie => {
      let dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, zombie.x, zombie.y);
      if (dist < minDist) {
        closestZombie = zombie;
        minDist = dist;
      }
    });
    return closestZombie;
  }

  // Método para generar un nuevo zombie
  spawnZombie() {

    if (this.zombies.countActive(true) < this.maxZombies) {
      const x = this.sys.game.config.width;
      const y = Phaser.Math.Between(0, this.sys.game.config.height);

      const zombie = this.zombies.get(x, y, 'zombie');
      console.log("Dentro de spawnZombie: -> Zombie.id:" , zombie.id);
      if (!zombie) return;
      zombie.setActive(true).setVisible(true).setTarget(this.player);
    }
  }

  // Función para disparar misil si la entrada es correcta
  handleInput(event) {
    let closestZombie = this.findClosestZombie();
    if (!closestZombie) return;

    // Obtiene la palabra y la progresión actual para el zombie más cercano
    let word = closestZombie.word;
    let progress = this.wordProgress[closestZombie.id] || 0;

    if (event.key === word.charAt(progress)) {
      this.currentLetter = event.key;
      this.fireMissile(closestZombie, progress);
    }
  }
}
