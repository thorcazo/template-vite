import Phaser, { Scene } from 'phaser';
import Missile from '../objects/Missile';

export default class MissileScene extends Scene {

  constructor() {
    super('MissileScene');
    this.missiles = null;
  }


  preload() {
    this.load.image('missile', 'assets/missile.png');
  }

  create() {
    this.missiles = this.add.group({
      classType: Missile,
      runChildUpdate: true
    });

    this.input.on('pointerdown', (pointer) => {
      const missile = this.missiles.get(pointer.x, pointer.y, 'missile');
      missile.setTrackMouse(true);
    });
  }





}