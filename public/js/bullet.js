export default class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'bullet');
    this.scene = scene;
    
    // Dodajemy pocisk do sceny
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    
    // Ustawienia fizyki
    this.setCollideWorldBounds(true);
    this.setBounce(1); // Odbicie od ścian
    this.body.setSize(16, 16); // Ustaw rozmiar kolizji
  }
}