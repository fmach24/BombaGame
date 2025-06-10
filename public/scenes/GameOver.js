export default class GameOver extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  create() {
    this.cameras.main.setBackgroundColor('#232946');

    this.add.text(400, 200, "GAME OVER", {
      fontFamily: "Arial Black",
      fontSize: "54px",
      color: "#fff",
      stroke: "#4e54c8",
      strokeThickness: 8,
      align: "center"
    }).setOrigin(0.5);

    const restartBtn = this.add.dom(400, 350, 'button', {
      class: 'menu-btn'
    }, 'Restart');

    restartBtn.addListener('click');
    restartBtn.on('click', () => {
      // Przejdź do MainMenu i wymuś reload strony (nowy socket)
      window.location.reload();
    });
  }
}