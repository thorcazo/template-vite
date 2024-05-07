import Phaser from 'phaser';

export class GameOver extends Phaser.Scene {

  constructor() {
    super('GameOver');
  }

  create() {

    const { width, height } = this.scale;

    this.add.text(width / 2, height / 2, 'Game Over', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    /* añadir un boton de reinicio */
    const restartButton = this.add.text(width / 2, height / 2 + 50, 'Restart', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
    /* Se utiliza para convertir un objeto interactivo y el jugador pueda interactuar con el. */
    restartButton.setInteractive();

    restartButton.on('pointerup', () => {
      this.scene.start('MainMenu');
    });
  }
}