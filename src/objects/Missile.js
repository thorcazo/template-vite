import Phaser from 'phaser'

export default class Missile extends Phaser.GameObjects.Container {

  target = null; // Añade una propiedad target a la clase Missile

  constructor(scene, x, y, texture) {
    super(scene, x, y)

    this.image = scene.add.image(0, 0, texture)
    this.image.setOrigin(1, 0.5)
    this.image.setScale(0.5)
    this.add(this.image)

    scene.physics.add.existing(this)

    const radius = this.image.height * 0.3
    this.body.setCircle(radius)
    this.image.y += radius
    this.image.x += radius

    const tx = scene.scale.width * 0
    const ty = scene.scale.height * 0

    // Es el centro de la pantalla, esto se hace para luego más adelante si el misil no tiene objetivo este será el centro de la pantalla
    this.target = new Phaser.Math.Vector2(tx, ty)

    //Determina la velocidad en la que quira el misil
    this.turnDegreesPerFrame = 3
    this.speed = 3500
    this.trackMouse = false
  }

  update(dt) {
    // Este será el objetivo del misil, si no tiene objetivo este será el centro de la pantalla
    const target = this.trackMouse ? this.scene.input.activePointer.position : this.target

    // Calcular el ángulo entre el misil y el objetivo
    const targetAngle = Phaser.Math.Angle.Between(
      this.x, this.y,
      target.x, target.y
    )

    //  Calcular la diferencia entre el ángulo actual y el ángulo objetivo
    let diff = Phaser.Math.Angle.Wrap(targetAngle - this.image.rotation)

    // set to targetAngle if less than turnDegreesPerFrame
    if (Math.abs(diff) < Phaser.Math.DegToRad(this.turnDegreesPerFrame)) {
      this.image.rotation = targetAngle;
    }
    else {
      let angle = this.image.angle
      if (diff > 0) {
        // turn clockwise
        angle += this.turnDegreesPerFrame
      }
      else {
        // turn counter-clockwise
        angle -= this.turnDegreesPerFrame
      }

      this.image.setAngle(angle)
    }

    // Ajusta la velocidad del misil para que se mueva en la dirección de su rotación
    this.scene.physics.velocityFromRotation(this.rotation, this.speed, this.body.velocity);

    // move missile in direction facing
    const vx = Math.cos(this.image.rotation) * this.speed
    const vy = Math.sin(this.image.rotation) * this.speed

    this.body.velocity.x = vx
    this.body.velocity.y = vy
  }

  // Añade un método setTarget a la clase Missile
  setTarget(target) {
    this.target = target;
  }

}
Phaser.GameObjects.GameObjectFactory.register('missile', function (x, y, texture) {
  const missile = new Missile(this.scene, x, y, texture)

  this.displayList.add(missile)

  this.scene.physics.world.enableBody(missile, Phaser.Physics.Arcade.DYNAMIC_BODY)

  return missile
})