import { Scene } from 'phaser';

export class MainMenu extends Scene {
  balls = null; // Inicializa balls como null
  enemy = Phaser.Physics.Arcade.Image;

  constructor() {
    super('MainMenu');
  }

  create() {
    this.player = this.physics.add.image(200, window.innerHeight / 2, 'player');
    this.enemy = this.physics.add.image(window.innerWidth - 80, window.innerHeight / 2, 'enemy');
    this.enemy.setImmovable(true);

    // Crear un grupo de bolas
    this.balls = this.physics.add.group();

    /* logica cuando pulso ESPACE */
    this.input.keyboard.on('keydown-SPACE', () => {
      /* funcion para que ball se desplace a la izquieda */
      const ball = this.physics.add.image(this.player.x, this.player.y, 'ball');
      this.balls.add(ball); // Añadir la bola al grupo
      this.desplazarBall(ball);
    });

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update(time, delta) {
    /* añadir movimiento a "player" -> "up" y "down" */
    if (this.cursors.down.isDown) {
      this.player.y += 5;
    } else if (this.cursors.up.isDown) {
      this.player.y -= 5;
    }

    // Si la bola está fuera de la vista del mundo, hazla invisible
    if (this.balls) { // Asegúrate de que balls se ha inicializado
      this.balls.getChildren().forEach(ball => {
        if (!this.cameras.main.worldView.contains(ball.x, ball.y)) {
          ball.visible = false;
        }
      });
    }

    // Si la bola colisiona con el enemigo, hazla invisible
    this.physics.collide(this.balls, this.enemy, (ball) => {
      ball.destroy();
      this.enemy.destroy(); 
    });
  }

  /* funciones del juego */
  desplazarBall(ball) {
    /* funcion para que ball se desplace a la izquieda */
    if (ball) {
      ball.setVelocityX(+1000);
    }
  }
}