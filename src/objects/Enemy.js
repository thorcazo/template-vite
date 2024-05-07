import Phaser from 'phaser'

export default class Zombie extends Phaser.GameObjects.Sprite {
  target = null;
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture)


    /* añadir textura "enemy" */
    this.setTexture('enemy');




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
    this.setRotation(rotation)
  }
}