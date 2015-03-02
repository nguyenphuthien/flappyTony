

var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');
var goal;
var pipe;
var score = 0;
var text;
var currentHole;
var jump;
// Create our 'main' state that will contain the game
var mainState = {

    preload: function() {
        // This function will be executed at the beginning
        // That's where we load the game's assets

        game.load.image("bird", "assets/bird.png");
        game.load.image("background","assets/background.png");
        game.load.image("pipe", "assets/pipe-1.png");
    },

    create: function() {
        // This function is called after the preload function
        // Here we set up the game, display sprites, etc.
        game.physics.startSystem(Phaser.Physics.ARCADE);
        //background
        game.add.tileSprite(0, 0, 400, 490, 'background');
        //Hiện con chim điên
        this.bird = this.game.add.sprite(100, 245, 'bird');
        //Thêm nhóm vật cản
        this.pipes = game.add.group(); // create group
        this.pipes.enableBody = true; // add physic
        this.pipes.createMultiple(20, 'pipe'); // create 20 pipes
        // thêm lỗ hổng tính điểm
        this.goals = game.add.group(); // tạo group
        this.goals.enableBody = true;
        this.goals.createMultiple(20);

        //thêm vật cản bằng cách dùng timer
        this.timer = game.time.events.loop(1500, this.addRowOfPipes,this);
        // thêm bảng tính điểm
        this.labelScore = game.add.text(20, 20, "0", { font:"30px Arial", fill:"#ffffff"});
        //trọng lực
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y= 1000;
        this.bird.body.allowRotation = true;
        // giá trị nhảy lên mặc định khi bấm SPACE
        jump = -350;
        // set z-index cho chim
        this.world.bringToTop(this.bird);
        // va chạm với khung game (mặt đất)
        this.bird.body.collideWorldBounds = true;

        //đặt nút space là nút chơi chính
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        // this.game.input.onDown(restartGame, this);
    },

    update: function() {
        // This function is called 60 times per second
        // It contains the game's logic
        game.physics.arcade.overlap(this.bird, this.pipes, this.showGoals, this.gameOver, this);
        // game.physics.arcade.collide(this.bird, game.world.bound.bottom, this.showGoals, this.gameOver, this);
        game.physics.arcade.overlap(this.bird, this.goals, this.countGoal, this.goalCheck, this);

    },
    jump: function(){
        //toc do roi
        this.bird.body.velocity.y = jump;
    },
    gameOver: function(){
        // game.gamePaused();
    },
    showGoals: function(){
        this.pipes.exists = false;
        this.goals.exists = false;
        this.bird.body.immovable = true;
        this.labelGoal = game.add.text(game.center.width/2, gama.center.height/2, "0", { font:"60px Arial", fill:"#ffffff"});
        this.labelGoal.text = score;
        // thêm nhãn Restart game
        text = game.add.text(150, 250, "Restart", { font:"30px Arial", fill:"#ffffff"});
        text.inputEnabled = true;
        text.events.onInputDown.add(this.restartGame,this);

    },
    restartGame:function() {
        //choi lai tu dau
        game.state.start('main');
    },
    addOnePipe: function(x,y){
        //lấy phần tử đầu tiên trong tập deadpipe
        pipe = this.pipes.getFirstDead();
        //tạo mới vị trí
        pipe.reset(x,y);
        //tạo vận tốc cho pipe để trượt sang trái
        pipe.body.velocity.x = -200;

        //xóa pipe nếu ko còn trên màn chơi
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;

    },
    addOneHole: function(x,y){
        //lấy phần tử đầu tiên trong tập deadgoal

        goal = this.goals.getFirstDead();
        //tạo mới vị trí
        goal.reset(x,y);
        //tạo vận tốc cho pipe để trượt sang trái
        goal.body.velocity.x = -200;

        //xóa pipe nếu ko còn trên màn chơi
        goal.checkWorldBounds = true;
        goal.outOfBoundsKill = true;
    },
    getStartPoint : function(maxY,minY){
        return Math.floor(Math.random() * (maxY - minY - 50) + minY);
    },
    addRowOfPipes: function(){
        // lấy điểm bắt đầu
        var startPoint = this.getStartPoint(-200,-400);

        // thêm các chi tiết dựa theo điểm bắt đầu
        this.addOnePipe(400, startPoint);
        this.addOneHole(400, startPoint + 520);
        this.addOnePipe(400, startPoint + 630);
        console.log(startPoint);
        console.log("-----");
    },
    goalCheck: function(goal){
        // goal.kill();
        currentHole = this.goals.getFirstExists();
        currentHole.exists = false;

    },
    countGoal: function(){
        score += 1;
        this.labelScore.text = score;

    },
};

// Add and start the 'main' state to start the game
game.state.add('main', mainState);
function onClick(){
    game.state.start('main');
}
// game.state.start('main');