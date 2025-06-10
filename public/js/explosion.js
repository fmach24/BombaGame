export default class Explosion extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'boom');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setOrigin(0.5, 0.5);
    this.setCircle(48); // promień wybuchu, dopasuj do grafiki
    this.setAlpha(0);   // wybuch jest niewidoczny, animacja jest osobno

    // Po animacji wybuchu usuń obiekt
    scene.time.delayedCall(400, () => this.destroy());
  }
}