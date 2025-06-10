
export default class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu');
    this.playerNick = '';
    this.bubbles = [];
  }

  create() {

    
    // Animowane tło: bąbelki
    for (let i = 0; i < 18; i++) {
      const x = Phaser.Math.Between(0, 800);
      const y = Phaser.Math.Between(0, 600);
      const radius = Phaser.Math.Between(20, 60);
      const alpha = Phaser.Math.FloatBetween(0.08, 0.18);
      const color = Phaser.Display.Color.GetColor(
        Phaser.Math.Between(60, 120), 
        Phaser.Math.Between(120, 180), 
        Phaser.Math.Between(200, 255)
      );
      const bubble = this.add.circle(x, y, radius, color, alpha);
      bubble.speed = Phaser.Math.FloatBetween(0.2, 0.7);
      this.bubbles.push(bubble);
    }

    // Fade-in efekt dla całego menu
    this.cameras.main.fadeIn(700, 35, 41, 70);

    // Animowany tytuł gry
    const title = this.add.text(400, 120, "Bombardihnio", {
      fontFamily: "Arial Black",
      fontSize: "54px",
      color: "#fff",
      stroke: "#4e54c8",
      strokeThickness: 8,
      shadow: { offsetX: 0, offsetY: 4, color: "#232946", blur: 8, fill: true }
    }).setOrigin(0.5);
    this.tweens.add({
      targets: title,
      scale: { from: 0.8, to: 1.05 },
      yoyo: true,
      repeat: -1,
      duration: 1200,
      ease: "Sine.easeInOut"
    });

    // Pole do wprowadzania nicku (z id do stylowania)
    const input = this.add.dom(400, 240, 'input', {
      id: 'menu-nick',
      type: 'text',
      maxlength: 16,
      placeholder: 'Twój nick'
    });

    // Przycisk startu (z klasą do stylowania)
    const startButton = this.add.dom(400, 320, 'button', {
      class: 'menu-btn'
    }, 'Rozpocznij grę');

    // Fade-in dla inputa i przycisku
    input.setAlpha(0);
    startButton.setAlpha(0);
    this.tweens.add({ targets: input, alpha: 1, duration: 800, delay: 400 });
    this.tweens.add({ targets: startButton, alpha: 1, duration: 800, delay: 600 });

    // Obsługa kliknięcia
    startButton.addListener('click');
    startButton.on('click', () => {
      const nick = input.node.value.trim() || 'Gracz';
      this.playerNick = nick.replace(/[^a-zA-Z0-9_ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, '').slice(0, 16);
      this.cameras.main.fadeOut(400, 35, 41, 70);
      this.time.delayedCall(400, () => {
        this.scene.start('GameScene', { nick: this.playerNick });
      });
    });

    // Enter = start
    input.node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        startButton.node.click();
      }
    });
  }

  update() {
    // Animacja bąbelków
    for (const bubble of this.bubbles) {
      bubble.y -= bubble.speed;
      if (bubble.y + bubble.radius < 0) {
        bubble.y = 600 + bubble.radius;
        bubble.x = Phaser.Math.Between(0, 800);
      }
    }
  }
}


// export default class MainMenu extends Phaser.Scene {

//   constructor() {
//     super('MainMenu');
//     this.playerNick = ''; // Tutaj przechowamy nick
//   }



//   create() {
//     // Tło menu (opcjonalnie)
//     this.cameras.main.setBackgroundColor('#232946');

//     // Tytuł gry
//     this.add.text(400, 120, "Bombardihnio", {
//       fontFamily: "Arial",
//       fontSize: "48px",
//       color: "#fff",
//       fontStyle: "bold"
//     }).setOrigin(0.5);

//     // Pole do wprowadzania nicku (z id do stylowania)
//     const input = this.add.dom(400, 220, 'input', {
//       id: 'menu-nick',
//       type: 'text',
//       maxlength: 16,
//       placeholder: 'Twój nick'
//     });

//     // Przycisk startu (z klasą do stylowania)
//     const startButton = this.add.dom(400, 300, 'button', {
//       class: 'menu-btn'
//     }, 'Rozpocznij grę');

//     // Obsługa kliknięcia
//     startButton.addListener('click');
//     startButton.on('click', () => {
//       const nick = input.node.value.trim() || 'Gracz';
//       this.playerNick = nick.replace(/[^a-zA-Z0-9_ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, '').slice(0, 16);
//       this.scene.start('GameScene', { nick: this.playerNick });
//     });

//     // Enter = start
//     input.node.addEventListener('keydown', (e) => {
//       if (e.key === 'Enter') {
//         startButton.node.click();
//       }
//     });
//   }





//   // create() {
//   //   // Tło menu
//   //   // this.add.image(400, 300, 'menu_bg');

//   //   // Pole do wprowadzania nicku
//   //   const input = this.add.dom(400, 250, 'input', {
//   //     type: 'text',
//   //     placeholder: 'Wprowadź swój nick',
//   //     fontSize: '20px',
//   //     width: '200px',
//   //     height: '30px'
//   //   });

//   //   // Przycisk startu
//   //   const startButton = this.add.text(400, 350, 'Rozpocznij grę', {
//   //     fontSize: '24px',
//   //     fill: '#ffffff'
//   //   }).setOrigin(0.5);

//   //   startButton.setInteractive();
//   //   startButton.on('pointerdown', () => {
//   //     this.playerNick = input.node.value || 'Gracz'; // Domyślny nick
//   //     this.scene.start('GameScene', { nick: this.playerNick }); // Przekazanie nicku do gry
//   //   });
//   // }
// }
// // create() {
// //   this.add.text(300, 250, "Kliknij, aby rozpocząć", { fontSize: "24px", fill: "#fff" })
// //     .setInteractive()
// //     .on("pointerdown", () => {
// //       this.scene.start("Proba"); // Przełącz na inną scenę
// //     });
// // }

