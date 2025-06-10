import MainMenu from "./scenes/MainMenu.js";
import GameScene from "./scenes/GameScene.js";

// const socket = io();

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: { debug: false }
  },
  // scene: {
  //   preload,
  //   create,
  //   update
  // }
  scene: [MainMenu, GameScene]
};

new Phaser.Game(config);
// const game = new Phaser.Game(config);

// game.scene.add("MainMenu", MainMenu);
// game.scene.add("GameScene", GameScene);
// game.scene.start("MainMenu");

// let player;
// let otherPlayers = {};

// function preload() {
//   // this.scene.start("NazwaSceny", "https://labs.phaser.io/phaser4-view.html?src=src%5Cscenes%5Crestart%20a%20scene.js&return=phaser4-index.html%3Fpath%3Dscenes");
//   this.load.image("player", "https://labs.phaser.io/assets/sprites/phaser-dude.png");
// }

// function create() {
//   player = this.physics.add.image(100, 100, "player").setCollideWorldBounds(true);

//   this.cursors = this.input.keyboard.createCursorKeys();

//   socket.on("currentPlayers", (players) => {
//     console.log("Players in game:", players);
//     for (const id in players) {
//       if (id === socket.id) {
//         // Możesz zaktualizować lokalnego gracza, jeśli chcesz
//         player.setPosition(players[id].x, players[id].y);
//         continue;
//       }
//       const other = this.physics.add.image(players[id].x, players[id].y, "player");
//       otherPlayers[id] = other;
//     }
//   });

//   socket.on("newPlayer", (data) => {
//     const newP = this.physics.add.image(data.x, data.y, "player");
//     otherPlayers[data.id] = newP;
//   });

//   socket.on("playerMoved", (data) => {
//     if (otherPlayers[data.id]) {
//       otherPlayers[data.id].x = data.x;
//       otherPlayers[data.id].y = data.y;
//     }
//   });

//   socket.on("playerDisconnected", (id) => {
//     if (otherPlayers[id]) {
//       otherPlayers[id].destroy();
//       delete otherPlayers[id];
//     }
//   });

//   socket.emit("readyForPlayers");
// }

// function update() {
//   const speed = 200;
//   player.setVelocity(0);

//   if (this.cursors.left.isDown) player.setVelocityX(-speed);
//   if (this.cursors.right.isDown) player.setVelocityX(speed);
//   if (this.cursors.up.isDown) player.setVelocityY(-speed);
//   if (this.cursors.down.isDown) player.setVelocityY(speed);

//   socket.emit("playerMovement", { x: player.x, y: player.y });
// }