export default class MainMenu extends Phaser.Scene {
  // constructor() {
  //   super("MainMenu");
  // }

  constructor() {
    super('MainMenu');
    this.playerNick = ''; // Tutaj przechowamy nick
  }

  create() {
    // Tło menu
    // this.add.image(400, 300, 'menu_bg');

    // Pole do wprowadzania nicku
    const input = this.add.dom(400, 250, 'input', {
      type: 'text',
      placeholder: 'Wprowadź swój nick',
      fontSize: '20px',
      width: '200px',
      height: '30px'
    });

    // Przycisk startu
    const startButton = this.add.text(400, 350, 'Rozpocznij grę', {
      fontSize: '24px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    startButton.setInteractive();
    startButton.on('pointerdown', () => {
      this.playerNick = input.node.value || 'Gracz'; // Domyślny nick
      this.scene.start('Proba', { nick: this.playerNick }); // Przekazanie nicku do gry
    });
  }
}
// create() {
//   this.add.text(300, 250, "Kliknij, aby rozpocząć", { fontSize: "24px", fill: "#fff" })
//     .setInteractive()
//     .on("pointerdown", () => {
//       this.scene.start("Proba"); // Przełącz na inną scenę
//     });
// }
