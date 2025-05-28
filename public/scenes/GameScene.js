const socket = io();

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.player = null;
    this.otherPlayers = {};
  }

  preload() {
    this.load.image("player", "https://labs.phaser.io/assets/sprites/phaser-dude.png");
  }

  create() {
    // this.player = this.physics.add.image(100, 100, "player").setCollideWorldBounds(true);
    this.cursors = this.input.keyboard.createCursorKeys();

   

    // socket.on("currentPlayers", (players) => {
    //   for (const id in players) {
    //     if (id === socket.id) {
    //       this.player = this.phisics.add.image(players[id].x, players[id].y, "player").setCollideWorldBounds(true);
    //     } else {
    //       const p = this.physics.add.image(players[id].x, players[id].y, "player");
    //       this.otherPlayers[id] = p;
    //     }
    //   }
    // });
    socket.on("currentPlayers", (players) => {
      for (const id in players) {
        if (id === socket.id) {
          // Dodaj lokalnego gracza tylko raz
          this.player = this.physics.add.image(players[id].x, players[id].y, "player").setCollideWorldBounds(true);
        } else {
          // Dodaj innych graczy
          const other = this.physics.add.image(players[id].x, players[id].y, "player");
          this.otherPlayers[id] = other;
        }
      }
      console.log("Moje ID:", socket.id);
    });

    socket.on("newPlayer", (data) => {
      // this.physics.add.image(data.x, data.y, "player");
      const newP = this.physics.add.image(data.x, data.y, "player");
      this.otherPlayers[data.id] = newP;
    });

    socket.on("playerMoved", (data) => {
      // if (!player) return;
      if (this.otherPlayers[data.id]) {
        this.otherPlayers[data.id].x = data.x;
        this.otherPlayers[data.id].y = data.y;
      }
    });

    socket.on("playerDisconnected", (id) => {
      if (this.otherPlayers[id]) {
        this.otherPlayers[id].destroy();
        delete this.otherPlayers[id];
      }
    });

    socket.emit("readyForPlayers");
  }

  update() {
    if (!player) return;//gry gracz nie jest w pelni stwozony
    const speed = 200;
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) this.player.setVelocityX(-speed);
    if (this.cursors.right.isDown) this.player.setVelocityX(speed);
    if (this.cursors.up.isDown) this.player.setVelocityY(-speed);
    if (this.cursors.down.isDown) this.player.setVelocityY(speed);

    socket.emit("playerMovement", { x: this.player.x, y: this.player.y });
  }
}







// export default class GameScene extends Phaser.Scene {
//   constructor() {
//     super("GameScene");
//     this.otherPlayers = {};
//   }

//   // let player;
//   // let otherPlayers = {};

//   preload() {
//     // this.scene.start("NazwaSceny", "https://labs.phaser.io/phaser4-view.html?src=src%5Cscenes%5Crestart%20a%20scene.js&return=phaser4-index.html%3Fpath%3Dscenes");
//     this.load.image("player", "https://labs.phaser.io/assets/sprites/phaser-dude.png");
//   }

//   create() {
//     this.player = this.physics.add.image(100, 100, "player").setCollideWorldBounds(true);

//     this.cursors = this.input.keyboard.createCursorKeys();

//     socket.on("currentPlayers", (players) => {
//       console.log("Players in game:", players);
//       for (const id in players) {
//         if (id === socket.id) {
//           // Możesz zaktualizować lokalnego gracza, jeśli chcesz
//           this.player.setPosition(players[id].x, players[id].y);
//           continue;
//         }
//         const other = this.physics.add.image(players[id].x, players[id].y, "player");
//         otherPlayers[id] = other;
//       }
//     });

//     socket.on("newPlayer", (data) => {
//       const newP = this.physics.add.image(data.x, data.y, "player");
//       otherPlayers[data.id] = newP;
//     });

//     socket.on("playerMoved", (data) => {
//       if (otherPlayers[data.id]) {
//         otherPlayers[data.id].x = data.x;
//         otherPlayers[data.id].y = data.y;
//       }
//     });

//     socket.on("playerDisconnected", (id) => {
//       if (otherPlayers[id]) {
//         otherPlayers[id].destroy();
//         delete otherPlayers[id];
//       }
//     });

//     socket.emit("readyForPlayers");
//   }

//   update() {
//     console.log("Update działa");
//     if (!this.player) {
//       console.warn("Brak playera!");
//       return;
//     }
//     const speed = 200;
//     player.setVelocity(0);

//     if (this.cursors.left.isDown) this.player.setVelocityX(-speed);
//     if (this.cursors.right.isDown) this.player.setVelocityX(speed);
//     if (this.cursors.up.isDown) this.player.setVelocityY(-speed);
//     if (this.cursors.down.isDown) this.player.setVelocityY(speed);

//     socket.emit("playerMovement", { x: this.player.x, y: this.player.y });
//   }
// }