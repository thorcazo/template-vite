import { Scene } from 'phaser';
import Zombie from '../objects/Zombie';
import Missile from '../objects/Missile';


export class Game extends Scene {
  balls = null; // Inicializa balls como null
  zombies = null;
  missiles = null;


  constructor() {
    super('Game');
  }

  preload() {
    this.puntos = 0;
    this.count = 10
  }
  /* CREATE
  ======================== */
  create() {
    /* Implementar escena UI */
    this.scene.launch('UI');

    this.player = this.physics.add.image(200, window.innerHeight / 2, 'player');

    // Crear un nuevo zombie cada 2 segundos
    this.time.addEvent({
      delay: 2000, // tiempo en milisegundos antes de que el evento se dispare
      callback: this.spawnZombie, // función a llamar cuando se dispara el evento
      callbackScope: this, 
      loop: true // si el evento debe repetirse
    });

    // Crear un grupo de misiles en lugar de balas
    this.missiles = this.physics.add.group({
      classType: Missile,
      runChildUpdate: true // Hace que el método update de la clase Missile se ejecute
    });

    // Crear una tecla de disparo
    this.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Crear un objeto de teclas para W, A, S, D
    this.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    /* Añadir zombies a el grupo zombies */
    this.zombies = this.add.group({
      classType: Zombie,
      runChildUpdate: true // Hace que el método update de la clase Zombie se ejecute
    })


    // Hacer que los zombies persigan al jugador
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

    // Disparar un misil
    if (Phaser.Input.Keyboard.JustDown(this.shootKey)) {
      const missile = this.missiles.get(this.player.x, this.player.y, 'missile');
      if (missile) {
        missile.setActive(true);
        missile.setVisible(true);
        missile.setRotation(this.player.rotation);

        // Establecer el objetivo del misil al zombie más cercano
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
          missile.setTarget(closestZombie);
        }


      }
    }

    // Añadir una colisión entre las balas y los zombies
    this.physics.add.collider(this.missiles, this.zombies, (missile, zombie) => {
      missile.destroy(); // Destruir la bala

      if (zombie) {
        zombie.destroy(); // Destruir el zombie
      }

      // Crear un nuevo zombie en una posición aleatoria
      const newZombie = this.zombies.get(window.innerWidth, window.innerHeight - Math.random(), 'zombie');
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
      console.log(zombie,   "Zombie cercano");  
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


  /* Spawn de Zombie  */
  spawnZombie() {
    console.log('Nuevo zombie');
    const newZombie = this.zombies.get(Phaser.Math.Between(this.sys.game.config.width / 2, this.sys.game.config.width), Phaser.Math.Between(0, this.sys.game.config.height), 'zombie');

    if (newZombie) {
      newZombie.setActive(true);
      newZombie.setVisible(true);
      newZombie.setTarget(this.player);
    }
  }

}