const socket = io();

export default class Proba extends Phaser.Scene {
  constructor() {
    super("Proba");
    // this.player = null;
    this.otherPlayers = {};
  }

  preload() {
    this.load.image("player", "https://labs.phaser.io/assets/sprites/phaser-dude.png");
    this.load.spritesheet('bomb', 'assets/bomb_character_o_idle.png', {
        frameWidth: 64,  // szerokość jednej klatki
        frameHeight: 64, // wysokość jednej klatki
        endFrame: 2     // liczba klatek (2 dla dwóch stanów idle)
    });
    this.load.spritesheet('boom', 'assets/bomb_character_o_explode.png', {
        frameWidth: 64,  // szerokość jednej klatki
        frameHeight: 64, // wysokość jednej klatki
        endFrame: 4     // liczba klatek (2 dla dwóch stanów idle)
    });
    this.load.image("bullet", "/assets/bullet.png");
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();

       // Grupa pocisków (z włączoną fizyką)
    this.bullets = this.physics.add.group();

    // Klawisz strzału (np. SPACJA)
    this.fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('bomb', {
            start: 0,  // pierwsza klatka
            end: 1     // druga klatka
        }),
        frameRate: 4, // tempo animacji (klatki na sekundę)
        repeat: 1    // zapętlenie (-1 = nieskończone)
    });

    this.anims.create({
        key: 'boom',
        frames: this.anims.generateFrameNumbers('boom', { start: 0, end: 4 }),
        frameRate: 10,
        repeat: 0
    });


    socket.on("currentPlayers", (players) => {
      for (const id in players) {
        if (id === socket.id) {
          this.player = this.physics.add.sprite(players[id].x, players[id].y, "player").setCollideWorldBounds(true);
        } else {
          const other = this.physics.add.sprite(players[id].x, players[id].y, "player");
          this.otherPlayers[id] = other;
        }
      }
      console.log("Moje ID:", socket.id);
    });

    socket.on("newPlayer", (data) => {
      if (data.id === socket.id) return; // unikaj duplikatu
      const newP = this.physics.add.sprite(data.x, data.y, "player");
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

        // Strzelanie po naciśnięciu SPACJI
    if (Phaser.Input.Keyboard.JustDown(this.fireKey)) {
        this.fire();
    }

    socket.emit("playerMovement", { x: this.player.x, y: this.player.y });
  }


  fire() {
      // Tworzenie pocisku na pozycji gracza
      const bullet = this.bullets.create(
          this.player.x,  // x gracza
          this.player.y,  // y gracza
          "bomb"
      );

      bullet.play('idle');

      bullet.on('animationcomplete', () => {
        // 1. Ukryj bombę (ale nie niszcz, aby pozostały współrzędne)
        bullet.setVisible(false);
        bullet.body.stop(); // Zatrzymaj fizykę

        // 2. Stwórz wybuch w miejscu bomby
        const explosion = this.add.sprite(bullet.x, bullet.y, 'boom');
        explosion.play('boom');

        // 3. Po zakończeniu wybuchu, zniszcz oba obiekty
        explosion.on('animationcomplete', () => {
            explosion.destroy();
            bullet.destroy(); // Teraz niszczymy bombę
        });
    });




      // Ustawienie prędkości pocisku (np. w górę)
      if (this.cursors.left.isDown) bullet.setVelocityX(-300); 
      if (this.cursors.right.isDown) bullet.setVelocityX(300); 
      if (this.cursors.up.isDown) bullet.setVelocityY(-300); 
      if (this.cursors.down.isDown) bullet.setVelocityY(300); 
      

      // Opcjonalnie: kolizje z innymi obiektami
      this.physics.add.collider(bullet, this.enemies, this.hitEnemy, null, this);
  }

  // Funkcja wywoływana przy trafieniu wroga
  hitEnemy(bullet, enemy) {
      bullet.destroy();  // Usuń pocisk
      enemy.destroy();   // Usuń wroga (lub zadaj mu obrażenia)
  }

}


