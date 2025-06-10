export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, nick) {
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

    this.nickText = scene.add.text(x, y - 40, nick, {
      font: "18px Arial",
      fill: "#232946",
      stroke: "#fff",
      strokeThickness: 3,
      align: "center"
    }).setOrigin(0.5, 1);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    // Aktualizuj pozycję nicka nad graczem
    if (this.nickText) {
      this.nickText.x = this.x;
      this.nickText.y = this.y - 40;
    }
  }

  destroy(fromScene) {
    if (this.nickText) this.nickText.destroy();
    super.destroy(fromScene);
  }
}