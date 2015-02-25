var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');

// Create our 'main' state that will contain the game
var mainState = {

    preload: function() {
        // This function will be executed at the beginning
        // That's where we load the game's assets
        game.state.backgroundColor = "#71c5cf";
        game.load.image("bird", "assets/bird.png");
        game.load.image("pipe", "assets/pipe.png");
    },

    create: function() {
        // This function is called after the preload function
        // Here we set up the game, display sprites, etc.
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //Hiện con chim điên
        this.bird = this.game.add.sprite(100, 245, 'bird');

        //Thêm nhóm vật cản
        this.pipes = game.add.group(); // create group
        this.pipes.enableBody = true; // add physic
        this.pipes.createMultiple(20, 'pipe'); // create 20 pipes

        //thêm vật cản bằng cách dùng timer
        this.timer = game.time.events.loop(1500, this.addRowOfPipes,this);

        // thêm bảng tính điểm
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font:"30px Arial", fill:"#ffffff"});

        //trọng lực
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y= 1000;

        //đặt nút space là nút chơi chính
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
    },

    update: function() {
        // This function is called 60 times per second
        // It contains the game's logic
        if (this.bird.inWorld == false) {
            this.restartGame();
        };
        game.physics.arcade.overlap(this.bird, this.pipes, this.restartGame, null, this);
    },
    jump: function(){
        //toc do roi
        this.bird.body.velocity.y = -350;
    },

    restartGame:function() {
        //choi lai tu dau
        game.state.start('main');
    },
    addOnePipe: function(x,y){
        //lấy phần tử đầu tiên trong tập deadpipe
        var pipe = this.pipes.getFirstDead();
        //tạo mới vị trí
        pipe.reset(x,y);
        //tạo vận tốc cho pipe để trượt sang trái
        pipe.body.velocity.x = -200;

        //xóa pipe nếu ko còn trên màn chơi
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;

    },
    addRowOfPipes: function(){
        var hole = Math.floor(Math.random() *5) + 1; // tạo lỗ cho chim chui qua
        //tạo 6 pipes ở trên và dưới
        for (var i = 0; i < 8; i++) {
            if (i!=hole && i!=(hole + 1)) {
                this.addOnePipe(400, i * 60 +10);
            };
        };
        this.score += 1;
        this.labelScore.text = this.score;
    },
};

// Add and start the 'main' state to start the game
game.state.add('main', mainState);
game.state.start('main');