import { Scene } from 'phaser';
import Zombie from '../objects/Zombie';


export class Game extends Scene {
  balls = null; // Inicializa balls como null
  zombies = null;
  bullets = null;

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
    this.bullets = this.physics.add.group();

    // Crear una tecla de disparo
    this.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


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

    // Habilitar la colisión entre los zombies
    this.physics.add.collider(this.zombies)

    // Habilitar la colisión entre el jugador y los zombies
    this.physics.add.overlap(this.player, this.zombies, () => {
      this.scene.pause('Game');
      this.scene.launch('GameOver');
    })

  } // FINISH CREATE


  /* UPDATE
  ========================== */
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


    // Disparar una bala
    if (Phaser.Input.Keyboard.JustDown(this.shootKey)) {
      const bullet = this.bullets.get(this.player.x, this.player.y, 'ball');
      if (bullet) {
        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.setRotation(this.player.rotation);
        this.physics.velocityFromRotation(this.player.rotation, 600, bullet.body.velocity);
      }
    }


    // Añadir una colisión entre las balas y los zombies
    this.physics.add.collider(this.bullets, this.zombies, (bullet, zombie) => {
      bullet.destroy(); // Destruir la bala
      zombie.destroy(); // Destruir el zombie



      // Crear un nuevo zombie en una posición aleatoria
      const newZombie = this.zombies.get(
        Phaser.Math.Between(100, 700),
        Phaser.Math.Between(100, 500),
        'zombie'
      );
      // Asegurarse de que el nuevo zombie está activo y visible
      if (newZombie) {
        newZombie.setActive(true);
        newZombie.setVisible(true);
        newZombie.setTarget(this.player);
      }
    }, null, this);

    // Hacer que el jugador mire al zombie más cercano
    let closestZombie = null;
    let minDist = Infinity;
    this.zombies.getChildren().forEach(zombie => {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, zombie.x, zombie.y);
      if (dist < minDist) {
        closestZombie = zombie;
        minDist = dist;
      }
    });

    if (closestZombie) {
      const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, closestZombie.x, closestZombie.y);
      this.player.setRotation(angle);
    }



  }

}