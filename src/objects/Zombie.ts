import Phaser, { Physics } from 'phaser'

export default class Zombie extends Phaser.GameObjects.Sprite implements IZombie, Physics.Arcade.Components.Velocity {
  private target?: Phaser.GameObjects.Components.Transform
  private word: string
  private wordText: Phaser.GameObjects.Text;

  private static idCounter = 0;
  public id: number;


  words: string[] = ['apple', 'banana', 'cherry', 'grape', 'lemon', 'melon', 'orange', 'peach', 'pear', 'plum'];

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, word: string) {
    super(scene, x, y, texture);
    this.id = Zombie.idCounter++;
    this.scene.physics.world.enable(this) // Habilitar física para el zombie
    this.word = this.setWord();
    this.wordText = this.scene.add.text(0, 0, this.word, { fontSize: '16px', color: '#000' });
  }

  setTarget(target: Phaser.GameObjects.Components.Transform) {
    this.target = target
  }

  update(t: number, dt: number) {
    if (!this.target) {
      return
    }

    const tx = this.target.x
    const ty = this.target.y

    const x = this.x
    const y = this.y

    const rotation = Phaser.Math.Angle.Between(x, y, tx, ty)
    this.setRotation(rotation);
    this.scene.physics.moveToObject(this, this.target, 50) // 50 es la velocidad

    this.wordText.x = this.x;
    this.wordText.y = this.y + this.height / 2;

  }
  /* metodo para asignar una palabra rando de words */
  setWord() {
    return this.word = this.words[Math.floor(Math.random() * this.words.length)];
  }




  destroy(fromScene?: boolean) {
    if (this.wordText) {
      this.wordText.destroy();
    }
    super.destroy(fromScene);
  }



}