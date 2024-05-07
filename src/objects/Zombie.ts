import Phaser, { Physics } from 'phaser'

export default class Zombie extends Phaser.GameObjects.Sprite implements IZombie, Physics.Arcade.Components.Velocity {
  private target?: Phaser.GameObjects.Components.Transform

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    this.scene.physics.world.enable(this) // Habilitar física para el zombie
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
    this.scene.physics.moveToObject(this, this.target, 50) // 100 es la velocidad

  }
}