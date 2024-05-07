import { Scene } from 'phaser';

export class UI extends Scene {
  constructor() {
    super('UI');
  }

  create() {
    this.scoreText = this.add.text(10, 10, 'Score: ', { fontSize: '32px', fill: '#fff' });
    this.score = this.add.text(this.scoreText.x + 120, 10, '0', { fontSize: '32px', fill: '#fff' });


    /* this.registry.on */
    this.registry.events.on('points', (points) => {
      this.score.setText(points);
    });


    const { width, height } = this.scale;
    const restartButton = this.add.text(window.innerWidth - 100, 25,  'MissileScene', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
    /* Se utiliza para convertir un objeto interactivo y el jugador pueda interactuar con el. */
    restartButton.setInteractive();

    restartButton.on('pointerup', () => {
      this.scene.start('MissileScene');
    });

  }






}