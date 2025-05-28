const socket = io();

export default class Proba extends Phaser.Scene {
  constructor() {
    super("Proba");
    this.player = null;
    this.otherPlayers = {};
  }

  preload() {
    this.load.image("player", "https://labs.phaser.io/assets/sprites/phaser-dude.png");
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    socket.on("currentPlayers", (players) => {
      for (const id in players) {
        if (id === socket.id) {
          this.player = this.physics.add.image(players[id].x, players[id].y, "player").setCollideWorldBounds(true);
        } else {
          const other = this.physics.add.image(players[id].x, players[id].y, "player");
          this.otherPlayers[id] = other;
        }
      }
      console.log("Moje ID:", socket.id);
    });

    socket.on("newPlayer", (data) => {
      if (data.id === socket.id) return; // unikaj duplikatu
      const newP = this.physics.add.image(data.x, data.y, "player");
      this.otherPlayers[data.id] = newP;
    });

    socket.on("playerMoved", (data) => {
      const other = this.otherPlayers[data.id];
      if (other) {
        other.x = data.x;
        other.y = data.y;
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
    if (!this.player) return;

    const speed = 200;
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) this.player.setVelocityX(-speed);
    if (this.cursors.right.isDown) this.player.setVelocityX(speed);
    if (this.cursors.up.isDown) this.player.setVelocityY(-speed);
    if (this.cursors.down.isDown) this.player.setVelocityY(speed);

    socket.emit("playerMovement", { x: this.player.x, y: this.player.y });
  }
}
