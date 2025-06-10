export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    // this.scene = scene;
    scene.add.existing(this); // Dodaje do sceny i fizyki
    scene.physics.add.existing(this);
    this.setOrigin(0.5, 0.5);
    this.setCollideWorldBounds(true);
    
    // Dodajemy gracza do sceny
    // this.scene.add.existing(this);
    // this.scene.physics.world.enable(this);
    
    // Ustawienia fizyki
    this.body.setSize(32, 32); // Ustaw rozmiar kolizji
    this.body.setOffset(16, 16); // Ustaw offset kolizji
  }
}