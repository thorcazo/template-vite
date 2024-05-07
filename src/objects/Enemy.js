// FILE: Enemy.js
export default class Enemy extends Phaser.Physics.Arcade.Image {
  target = null;

  constructor(scene, x, y, texture) {
    super(scene, x, y, texture)
  }

  setTarget(target) {
    this.target = target
  }

  update(t, dt) {
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