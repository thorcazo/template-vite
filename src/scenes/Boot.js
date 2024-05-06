import { Scene } from 'phaser';

export class Boot extends Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.load.image('ball', 'assets/ball.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('enemy', 'assets/enemy.png');
  }

  create() {
    this.scene.start('Preloader');
  }
}
