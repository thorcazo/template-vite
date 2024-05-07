import { Scene } from 'phaser';
import Zombie from '../objects/Zombie';

export class Game extends Scene {
  balls = null; // Inicializa balls como null
  zombies = null;

  constructor() {
    super('Game');
  }

  preload() {
    this.puntos = 0;
    this.count = 10
  }

  create() {
    /* Implementar escena UI */
    this.scene.launch('UI');

    this.player = this.physics.add.image(200, window.innerHeight / 2, 'player');

    // Crear un grupo de bolas
    this.balls = this.physics.add.group();
    this.cursors = this.input.keyboard.createCursorKeys();

    /* Añadir zombies a el grupo zombies */
    this.zombies = this.add.group({
      classType: Zombie,
      runChildUpdate: true // Hace que el método update de la clase Zombie se ejecute
    })

    // random positioned zombie
    this.zombies.get(
      Phaser.Math.Between(100, 700),
      Phaser.Math.Between(100, 500),
      'zombie'
    )
    this.zombies.get(
      Phaser.Math.Between(100, 700),
      Phaser.Math.Between(100, 500),
      'zombie'
    )

    // set each zombie's target to be the player
    this.zombies.children.each(child => {
      const zombie = child
      zombie.setTarget(this.player)
    })

  } // FINISH CREATE

  update(time, delta) {
    /* añadir movimiento a "player" -> "up" y "down" */
    if (this.cursors.down.isDown) {
      this.player.y += 5;
    } else if (this.cursors.up.isDown) {
      this.player.y -= 5;
    } else if (this.cursors.left.isDown) {
      this.player.x -= 5;
    } else if (this.cursors.right.isDown) {
      this.player.x += 5;
    }

    // Si la bola está fuera de la vista del mundo, hazla invisible
    if (this.balls) { // Asegúrate de que balls se ha inicializado
      this.balls.getChildren().forEach(ball => {
        if (!this.cameras.main.worldView.contains(ball.x, ball.y)) {
          ball.visible = false;
        }
      });
    }
  }

}