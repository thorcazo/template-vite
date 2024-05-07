// Enemy.js
import { Physics } from 'phaser';

export class Enemy extends Physics.Arcade.Image {
  constructor(scene, x, y, word) {
    super(scene, x, y, 'enemy');
    scene.add.existing(this);
    scene.physics.world.enable(this);

    this.setDisplaySize(50, 50);  // Configura el tamaño del enemigo
    this.setImmovable(true);      // Hace que el enemigo no sea desplazado por colisiones
    this.word = word;             // Guarda la palabra que representa el enemigo
  }
}
