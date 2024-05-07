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

  }






}