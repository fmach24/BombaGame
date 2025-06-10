export default class Bomb extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setOrigin(0.5, 0.5);
    this.setCollideWorldBounds(true);

    // this.play('idle');

    // this.on('animationcomplete', () => {
    //   this.setVisible(false);
    //   this.body.stop();

    //   // Wybuch
    //   const explosion = scene.add.sprite(this.x, this.y, 'boom');
    //   explosion.play('boom');
    //   this.explode();
    //   explosion.on('animationcomplete', () => {
    //     explosion.destroy();
    //     this.destroy();
    //   });
    // });
  }

  // explode() {
  //   this.emit('animationcomplete');
  // }
}