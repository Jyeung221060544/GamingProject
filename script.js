// resize canvas
let canvas = document.getElementById("game");
let c_context = canvas.getContext("2d");
let fontscale = canvas.height * 0.025;

// approx 1200
let translate_x = 1200;

let margin = 120;
function resizeCanvas(){
  canvas.width = window.innerWidth - margin;
  canvas.height = window.innerHeight - margin; 
  // translate_x = canvas.width / 2;
  fontscale = canvas.height * 0.025;
}

resizeCanvas()  // resize canvas to window size, minus margin
window.addEventListener("resize", resizeCanvas);


// get player names
function get(id){
  return document.getElementById(id);
}
function getP1(){
  let n = get("p1").value;
  return n;
}
function getP2(){
  let n = get("p2").value;
  return n;
}


// Specifies resources
let resources = {images:[
                  // Backgrounds
                  {id:"bk2",src:"resource/bk2.png"},
                  {id:"s",src:"resource/s.jpg"},
                  {id:"end",src:"resource/EndScreen.png"},
                  // Cusor
                  {id:"cusor",src:"resource/cusor.png"},
                  // HitBoxes
                  {id:"computer",src:"resource/computer.png"},
                  {id:"p",src:"resource/p.png"},
                  {id:"IdleHitbox",src:"resource/IdleHitbox.png"},
                  // MC
                  {id:"MC_idle",src:"resource/MC/MC_idle.png"},
                  {id:"MC_run",src:"resource/MC/MC_run.png"},
                  {id:"MC_slash1",src:"resource/MC/MC_slash1.png"},
                  {id:"MC_slash2",src:"resource/MC/MC_slash2.png"},
                  {id:"MC_block1",src:"resource/MC/MC_block1.png"},
                  {id:"MC_block2",src:"resource/MC/MC_block2.png"},
                  {id:"MC_hurt",src:"resource/MC/MC_hurt.png"},
                  {id:"MC_fall",src:"resource/MC/MC_fall.png"},
                  {id:"MC_dead",src:"resource/MC/MC_dead.png"},
                  // Enemy
                  {id:"Enemy_idle",src:"resource/Enemies/Warrior/idle.png"},
                  {id:"Enemy_run",src:"resource/Enemies/Warrior/run.png"},
                  {id:"Enemy_slash",src:"resource/Enemies/Warrior/slash.png"},
                  {id:"Enemy_hurt",src:"resource/Enemies/Warrior/hurt.png"},
                  {id:"Enemy_dead",src:"resource/Enemies/Warrior/death.png"}
                  
                  ],
                 audios:[ 
                  {id:"Music",src:"resource/BackgroundMusic.mp3"},
                  //Sound effects
                  {id:"QuickAttack",src:"resource/QuickAttack.wav"},
                  {id:"HeavyAttack",src:"resource/HeavyAttack.mp3"},
                  {id:"ShieldBlocking",src:"resource/ShieldBlocking.wav"}
                  ]
                  
                };

// Load resources and starts the game loop
function preload(){
    game = new Game("game");
    game.preload(resources);
    game.state = init;
    gameloop();
}
document.onload = preload();

// Controls the state of the game
function gameloop(){
  game.processInput()
  if(game.ready){
    game.state();
  }
  game.update()
  setTimeout(gameloop,10);
}


let players = [];
// Create game objects and perform any game initialization
function init(){
  //  Game background
  bk2 = new Sprite(game.images.bk2,game);
  bk2.scale = canvas.height/bk2.height;
  //  Background music
  music = new Sound(game.audios.Music);
  //  Sound Effects
  QuickAttack = new Sound(game.audios.QuickAttack);
  HeavyAttack = new Sound(game.audios.HeavyAttack);
  ShieldBlocking = new Sound(game.audios.ShieldBlocking);
  
  //  Starting Screen Background
  s = new Sprite(game.images.s,game);
  s.scale = canvas.height/s.height;
  //  Gameover Screen
  end = new Sprite(game.images.end,game);
  end.scale = canvas.height/end.height;
  //  Cusor
  cusor = new Sprite(game.images.cusor,game);
  cusor.scale = 0.4;
  // Clicking hit box
  computer = new Sprite(game.images.computer,game);
  computer.scale = 0.25;
  p = new Sprite(game.images.p,game);
  p.scale = 0.25;
  
  
  //  Text Fonts
  f = new Font("30pt", "PT Sans", "white", "black");
  P1 = new Font("25pt","Arial","cyan","black");
  P2 = new Font("25pt","Arial","red","black");
  P1_HP = new Font(fontscale.toString() + "pt","PT Sans","cyan","black");
  P2_HP = new Font(fontscale.toString() + "pt","PT Sans","red","black");
  P1Wins = new Font("30pt", "PT Sans", "cyan", "black");
  P2Wins = new Font("30pt", "PT Sans", "red", "black");
  // game.showBoundingBoxes = true;

  
  // initialize players
  players = [new Player(getP1(), [key.E, key.R, key.F, key.W, key.A, key.D],Voice, ""), new Player(getP2(), [key.J, key.K, key.L, 38, 37, 39], "", prediction)];

  // initialize hero coords & status
  for(let i = 0; i < players.length; i++){
    players[i].x = 150;
    players[i].y = bk2.height/2;
    players[i].status = "idle";
  }
  players[1].x = canvas.width - 150;

  // initialize Warrior Enemy
  warrior = new Warrior();

  // initialize hero coords & status
  warrior.y = bk2.height/2;
  warrior.status = "idle";
  warrior.x = canvas.width - 150;
  
  game.state = start;
}

// Game logic - Start Screen


function start(){
  c_context.fillStyle = "black";
  c_context.fillRect(0, 0, canvas.width, canvas.height); 
  music.play()
  // Text Hitbox
  // p.draw(canvas.width/1.45,canvas.height/1.3);
  p.draw(canvas.width * 0.49,canvas.height/1.26);
  // computer.draw(canvas.width/3.25,canvas.height/1.3);
  
  s.draw(canvas.width/2,s.height/2);
  
  
  //  Title
  game.drawText("S T R E S S     D U E L I N G", canvas.width * 0.37,canvas.height/6,f);
  
  //  Gamemode
  //game.drawText("Computer", canvas.width/4,canvas.height/1.3,f);
  
  game.drawText("Player", canvas.width * 0.45,canvas.height/1.4,f);
  game.drawText("VS", canvas.width * 0.47,canvas.height/1.26,f);
  game.drawText("Player", canvas.width * 0.45,canvas.height/1.16,f);

  
  game.canvas.style.cursor = "none";
  cusor.draw(mouse.x,mouse.y);
  if(cusor.collidedWith(p)&&mouse.leftClick){
    game.state = pvp;
  }
  /*
  if(cusor.collidedWith(computer)&&mouse.leftClick){
    game.state = ai;
  }*/
  
}


function pvp(){
  // constantly draws black "background"
  c_context.fillStyle = "black";
  c_context.fillRect(0, 0, canvas.width, canvas.height); 
  music.play()

  //Drawing player hitbox behind the background
  for(let i = 0; i < players.length; i++){
    players[i].hitbox.draw(players[i].x, players[i].y);
  }
  bk2.draw(bk2.width/2,bk2.height/2);

  // Player HP Bar Black Outline
  c_context.fillStyle = "black";
  
  // Player 1
  let outline_margin_w = canvas.width * 0.001;
  let outline_margin_h = canvas.height * 0.002;
  c_context.fillRect(canvas.width * 0.02 - outline_margin_w, canvas.height * 0.03 - outline_margin_h , canvas.width * 0.25 + outline_margin_w * 2, canvas.height * 0.07 + outline_margin_h * 2);
  
  // Player 2
  c_context.fillRect(canvas.width * 0.98 - (canvas.width * 0.25) - outline_margin_w, canvas.height * 0.03 - outline_margin_h , canvas.width * 0.25 + outline_margin_w * 2, canvas.height * 0.07 + outline_margin_h * 2);
  
  // Player HP Bar Green
  c_context.fillStyle = "green";
  
  // Player 1
  if(players[0].hp <= 25){
    c_context.fillStyle = "red";
  }else if(players[0].hp <= 50){
    c_context.fillStyle = "orange";
  }else if(players[0].hp <= 75){
    c_context.fillStyle = "yellow";
  }
  c_context.fillRect(canvas.width * 0.01, canvas.height * 0.02, players[0].hp_width, canvas.height * 0.07);
  
  // Player 2
  
  c_context.fillStyle = "green";
  if(players[1].hp <= 25){
    c_context.fillStyle = "red";
  }else if(players[1].hp <= 50){
    c_context.fillStyle = "orange";
  }else if(players[1].hp <= 75){
    c_context.fillStyle = "yellow";
  }
  c_context.fillRect(canvas.width * 0.97 - (canvas.width * 0.25), canvas.height * 0.02, players[1].hp_width, canvas.height * 0.07);

  // hp text display
  game.drawText("Player 1: " + players[0].hp, canvas.width * 0.025 , 0.075 * canvas.height,P1_HP);
  game.drawText("Player 2: " + players[1].hp, canvas.width * 0.87 - 50 , 0.075 * canvas.height,P2_HP);

  // player name display
  game.drawText(players[0].name, players[0].x-50, players[0].y * 1.2,P1);
  game.drawText(players[1].name, players[1].x-50 , players[1].y * 1.2,P2);


  for(let i = 0; i < players.length; i++){
    // Cooldown timer for skills & animations
    
    players[i].cooldown_timer();
  
    // Check if MC is in any "states", ex. block, slash, ...
    players[i].check_if_states();
    // console.log(players[i].direction);
    // console.log(players[i].animations[0].direction);
    
    //  Player's moves / inputs
    players[i].check_player_inputs();
  
    // Take in voice/img inputs for corresponding players
    players[i].voiceInputs();
    players[i].imageInputs();

    // Check if players are hit
    if(players[0].hitbox.collidedWith(players[1].hitbox)){
      // if hit with slash 1
      if(players[0].status == "slash1"){
        players[1].is_hit("slash1");
      }
      if(players[1].status == "slash1"){
        players[0].is_hit("slash1");
      }

      // if hit with slash 2
      if(players[0].status == "slash2"){
        players[1].is_hit("slash2");
      }
      if(players[1].status == "slash2"){
        players[0].is_hit("slash2");
      }   
    }

    // Draw player based on status 
    players[i].draw_status(players[i].status);

    // Plays slash1 Sound Effect 
    if(players[i].status == "slash1"){
      QuickAttack.play();
    }
    // Plays slash2 Sound Effect 
    if(players[i].status == "slash2"){
      HeavyAttack.play();
    }
    // Plays Shield Blocking Sound Effect
    if(players[i].status == "block2"){
      ShieldBlocking.play();
    }


    if((players[0].hp <= 0 || players[1].hp <= 0)){
      if(game.endscreen_cooldown > 0){
        game.endscreen_cooldown -= 0.5;
      }
      if(game.endscreen_cooldown == 0){
        game.state = GameOver;
      }
    }

  }
  
}

/*
function ai(){
  c_context.fillStyle = "black";
  c_context.fillRect(0, 0, canvas.width, canvas.height); 
  bk2.draw(bk2.width/2,bk2.height/2);
  game.drawText("Under Development :)", canvas.width/2.5,canvas.height/6,f);
  
  players[0].cooldown_timer();
  
  // check if MC is in any "states", ex. block, slash, ...
  players[0].check_if_states();
  
  //  Player's moves / inputs
  players[0].check_player_inputs();

  // Draw player based on status 
  players[0].draw_status(players[0].status);

  warrior.check_if_states();

  warrior.draw_status(warrior.status);
}
*/

function GameOver(){
  c_context.fillStyle = "black";
  c_context.fillRect(0, 0, canvas.width, canvas.height); 
  music.play()
  
  //Yes hit box
  p.draw(canvas.width/2.25+25,canvas.height * 0.475);
  // No hit box
  computer.draw(canvas.width/1.9+41,canvas.height * 0.475);
  
  end.draw(canvas.width/2,s.height/2);

  game.drawText("Yes", canvas.width/2.25,canvas.height * 0.475,f);
  game.drawText("No", canvas.width/1.9,canvas.height * 0.475,f);
  p.scale = 0.15;
  computer.scale = 0.15;
  

  
  if(cusor.collidedWith(p) && mouse.leftClick){
    // initialize players
    players = [new Player(getP1(), [key.E, key.R, key.F, key.W, key.A, key.D],Voice, ""), new Player(getP2(), [key.J, key.K, key.L, 38, 37, 39], "", prediction)];
  
    // initialize hero coords & status
    for(let i = 0; i < players.length; i++){
      players[i].x = 150;
      players[i].y = bk2.height/2;
      players[i].status = "idle";
    }
    players[1].x = canvas.width - 150;

    // reset game.endsreen_cooldown
    game.endscreen_cooldown = 60;
    // restarts pvp game
    game.state = pvp;
  }

  // Goes back to start page
  if(cusor.collidedWith(computer) && mouse.leftClick){
    game.state = start;
  }
  
  // Tells Who Wins
  if(players[0].hp > players[1].hp){
    game.drawText(players[0].name + " Wins", canvas.width/2.25,canvas.height * 0.8,P1Wins);
  }else if(players[0].hp < players[1].hp){
    game.drawText(players[1].name + " Wins", canvas.width/2.25,canvas.height * 0.8,P2Wins);
  }

  game.canvas.style.cursor = "none";
  cusor.draw(mouse.x,mouse.y);
  
}