import { Scene } from 'phaser';
import { Enemy } from '../objects/Enemy';  // Asegúrate de que la ruta es correcta
export class MainMenu extends Scene {
  balls = null; // Inicializa balls como null
  enemies = null;
  enemyCount = 0;


  /* Array de palabras para asignar al Enemy */
  words = ['apple', 'grape', 'lemon', 'melon', 'berry', 'peach', 'plum', 'kiwi', 'lime', 'pear'];  // Lista de palabras


  constructor() {
    super('MainMenu');
  }


  preload() {
    this.puntos = 0;
    this.count = 10
  }

  create() {
    /* Implementar escena UI */
    this.scene.launch('UI');

    this.player = this.physics.add.image(200, window.innerHeight / 2, 'player');

    /* Crear un grupo de enemigos */
    this.enemies = this.physics.add.group({
      classType: Enemy // Define la clase que se usará para los enemigos
    });

    /* Crear un nuevo temporizador que añade nuevos eneigos */
    this.time.addEvent({
      delay: 2000,
      callback: this.addEnemy,
      callbackScope: this,
      loop: true
    })

    // Crear un grupo de bolas
    this.balls = this.physics.add.group();

    /* logica cuando pulso ESPACE */
    this.input.keyboard.on('keydown-SPACE', () => {
      /* funcion para que ball se desplace a la izquieda */
      const ball = this.physics.add.image(this.player.x, this.player.y, 'ball');
      this.balls.add(ball);


      /* obtener la posicion del "enemy" más cercano */
      let closestEnemy = this.enemies.getChildren()[0];
      let closestDistance = Phaser.Math.Distance.Between(this.player.x, this.player.y, closestEnemy.x, closestEnemy.y);

      this.enemies.getChildren().forEach(enemy => {
        let distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
        if (distance < closestDistance) {
          closestEnemy = enemy;
          closestDistance = distance;
        }
      });


      /* Calcula la direccion entre el "player" y el "enemy" más cercano */
      let direction = new Phaser.Math.Vector2((closestEnemy.x) - this.player.x, closestEnemy.y - this.player.y).normalize();

      // Usa esta dirección para establecer la velocidad de la "ball"
      ball.setVelocity(direction.x * 1000, direction.y * 1000);


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
    this.physics.collide(this.balls, this.enemies, (ball, enemy) => {
      ball.visible = false;
      enemy.visible = false;
      this.enemyCount++;
      ball.destroy();
      enemy.destroy();


      /* Modificar Score cuando se elimie un enemigo */
      this.registry.events.emit('points', this.enemyCount);


      if (this.enemyCount >= this.count) {
        this.scene.start('GameOver');
        this.enemyCount = 0;
      }
    });
  }

  /* funciones del juego */
  desplazarBall(ball) {
    /* funcion para que ball se desplace a la izquieda */
    if (ball) {
      ball.setVelocityX(+1000);
    }
  }


  addEnemy() {
    const x = window.innerWidth - 80;
    const y = Math.random() * window.innerHeight;

    const randomWord = this.words[Math.floor(Math.random() * this.words.length)];  // Seleccionar una palabra al azar


    const enemy = new Enemy(this, x, y, randomWord); // Usa la clase Enemy
    this.enemies.add(enemy);
    enemy.setVelocityX(-100);
  }


}