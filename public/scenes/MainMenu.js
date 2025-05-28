export default class MainMenu extends Phaser.Scene {
  constructor() {
    super("MainMenu");
  }

  create() {
    this.add.text(300, 250, "Kliknij, aby rozpocząć", { fontSize: "24px", fill: "#fff" })
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("Proba"); // Przełącz na inną scenę
      });
  }
}