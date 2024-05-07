import { Scene } from 'phaser';

export class Boot extends Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.load.image('ball', 'assets/ball.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('enemy', 'assets/enemy.png');
    this.load.image('zombie', 'assets/zombie.png');
    this.load.image('missile', 'assets/missile.png');
  }

  create() {
    this.scene.start('Preloader');
  }
}
