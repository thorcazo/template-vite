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

    this.missiles = this.physics.add.group({
      classType: Missile,
      runChildUpdate: true
    });

    this.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    this.zombies = this.add.group({
      classType: Zombie,
      runChildUpdate: true
    });

    this.time.addEvent({
      delay: 1000,
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

  handleMissileZombieCollision(missile, zombie) {
    missile.destroy();
    zombie.destroy(); // Esto ahora también destruirá wordText
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

    if (Phaser.Input.Keyboard.JustDown(this.shootKey)) {
      this.fireMissile();
    }
  }

  fireMissile() {
    const missile = this.missiles.get(this.player.x, this.player.y, 'missile');
    if (!missile) return;
    missile.setActive(true).setVisible(true).setRotation(this.player.rotation);

    let closestZombie = this.findClosestZombie();
    if (closestZombie) {
      missile.setTarget(closestZombie);
    }
  }

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
      if (!zombie) return;
      zombie.setActive(true).setVisible(true).setTarget(this.player);
    }
  }
}
