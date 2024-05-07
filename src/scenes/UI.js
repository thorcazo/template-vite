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

    const pause = this.add.text(500, 25, 'Pause', {
      fontSize: '24px',
      fill: '#fff',
      backgroundColor: '#000',
      padding: { left: 10, right: 10, top: 10, bottom: 10 },
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 2,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000',
        blur: 2,
        stroke: true,
        fill: true
      }
    }).setOrigin(0.5);
    /* Se utiliza para convertir un objeto interactivo y el jugador pueda interactuar con el. */
    pause.setInteractive();

    pause.on('pointerover', () => {
      // Cambia el cursor a un puntero cuando el mouse pasa por encima
      this.game.canvas.style.cursor = 'pointer';
      pause.setFill('lightgrey');
    });

    pause.on('pointerout', () => {
      // Cambia el cursor de vuelta a la forma predeterminada cuando el mouse sale
      this.game.canvas.style.cursor = 'default';
      if (this.scene.isPaused('Game')) {
        pause.setFill('red');
      } else {
        pause.setFill('white');
      }
    });

    pause.on('pointerdown', () => {
      // Cambia el tamaño del botón cuando se hace clic en él
      pause.setScale(0.9);
    });

    pause.on('pointerup', () => {
      /* pause de escena */
      pause.setScale(1.0); // Restaura el tamaño del botón cuando se suelta el clic

      if (this.scene.isPaused('Game')) {
        this.scene.resume('Game');
        pause.setFill('white');
      } else {
        this.scene.pause('Game');
        pause.setFill('red');
      }
    });


  }
}