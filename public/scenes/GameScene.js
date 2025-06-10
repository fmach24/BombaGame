import socket from "../js/socket.js";
import Player from "../js/player.js";
import Bullet from "../js/bullet.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    // this.player = null;
    this.otherPlayers = {};
  }

  preload() {
    this.load.spritesheet('bomb', 'assets/sprites/bomb_character_o_idle.png', {
        frameWidth: 64,  // szerokość jednej klatki
        frameHeight: 64, // wysokość jednej klatki
        endFrame: 2     // liczba klatek (2 dla dwóch stanów idle)
    });
    this.load.spritesheet('bomb_explode', 'assets/sprites/bomb_character_o_explode.png', {
        frameWidth: 64,  // szerokość jednej klatki
        frameHeight: 64, // wysokość jednej klatki
        endFrame: 4     // liczba klatek (2 dla dwóch stanów idle)
    });
    this.load.image("bullet", "assets/sprites/bullet.png");
    this.load.image('frame1r', 'assets/sprites/standing1r.png');
    this.load.image('frame2r', 'assets/sprites/standing2r.png');
    this.load.image('frame1l', 'assets/sprites/standing1l.png');
    this.load.image('frame2l', 'assets/sprites/standing2l.png');
  }

  create() {
    // this.cameras.main.setBackgroundColor('#ffffff');

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
        frames: this.anims.generateFrameNumbers('bomb_explode', { start: 0, end: 4 }),
        frameRate: 10,
        repeat: 0
    });
    this.anims.create({
      key: 'bombardinhoIdleright',
      frames: [
        { key: 'frame1r' },
        { key: 'frame2r' }
      ],
      frameRate: 4,
      repeat: -1
    });
    this.anims.create({
      key: 'bombardinhoIdleleft',
      frames: [
        { key: 'frame1l' },
        { key: 'frame2l' }
      ],
      frameRate: 4,
      repeat: -1
    });


    socket.on("currentPlayers", (players) => {
      for (const id in players) {
        if (id === socket.id) {
          // this.player = this.physics.add.sprite(players[id].x, players[id].y, "frame1r").setCollideWorldBounds(true);
          this.player = new Player(this, players[id].x, players[id].y, "frame1r");
          this.player.play('bombardinhoIdleright');
        } else {
          // const other = this.physics.add.sprite(players[id].x, players[id].y, "frame1r").setCollideWorldBounds(true);
          const other = new Player(this, players[id].x, players[id].y, "frame1r");
          other.play('bombardinhoIdleright');
          this.otherPlayers[id] = other;
        }
      }
      console.log("Moje ID:", socket.id);
    });

    socket.on("newPlayer", (data) => {
      if (data.id === socket.id) return; // unikaj duplikatu
      // const newP = this.physics.add.sprite(data.x, data.y, "player");

      // const newP = this.add.sprite(data.x, data.y, 'frame1r');
      const newP = new Player(this, data.x, data.y, 'frame1r');
      newP.play('bombardinhoIdleright');
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

    const speed = 5000;
    this.player.setVelocity(0);

    // if (this.cursors.left.isDown) this.player.setVelocityX(-speed);
    // this.player.play('bombardinhoIdleleft');
    // if (this.cursors.right.isDown) this.player.setVelocityX(speed);
    // this.player.play('bombardinhoIdleright');
    if (this.cursors.left.isDown) {
    this.player.setVelocityX(-speed);
      if (this.player.anims.currentAnim?.key !== 'bombardinhoIdleleft') {
        this.player.play('bombardinhoIdleleft');
      }
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
      if (this.player.anims.currentAnim?.key !== 'bombardinhoIdleright') {
        this.player.play('bombardinhoIdleright');
      }
    }
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
      // const bullet = this.bullets.create(
      //     this.player.x,  // x gracza
      //     this.player.y,  // y gracza
      //     "bomb"
      // );
      const bullet = new Bullet(this, this.player.x, this.player.y, "bomb");

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


