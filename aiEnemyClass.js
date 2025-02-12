//Bots class
class Warrior{
  constructor(){
    this.hp = 100;
    this.hp_cooldown = 0;
    this.animation_cooldown = 0;
    this.skill_cooldown = 0;
    this.jumping = false;
    this.in_air = true;
    this.fall_factor = 1;
    this.direction = "right";
    this.status = "idle";
    
    this.x = 0;
    this.y = 0;

    this.hitbox = new Sprite(game.images.IdleHitbox,game, this.x, this.y);

    this.animations_name = ["idle", "slash1", "run", "hurt", "dead"];

    this.animations = [];
    this.animations.push(new Animation(game.images.Enemy_idle,9,game,100,55));  // idle
    this.animations.push(new Animation(game.images.Enemy_slash,12,game,100,55));  // slash1
    this.animations.push(new Animation(game.images.Enemy_run,6,game,100,55));  // run
    this.animations.push(new Animation(game.images.Enemy_hurt,5,game,100,55));   // hurt
    this.animations.push(new Animation(game.images.Enemy_dead,23,game,100,55));  //  dead

    // change Enemy animation speed & size
    this.hitbox.scale = 0.20 * canvas.height / this.hitbox.height;
    for(let i = 0; i < this.animations.length; i++){
      this.animations[i].scale = (canvas.height/6) / this.animations[i].height;
      this.animations[i].framerate = 0.15;
    }
  }

  cooldown_timer(){
    this.hitbox.x = this.x;
    this.hitbox.y = this.y;
    
    if(this.animation_cooldown > 0){
      this.animation_cooldown -= 0.5;
    }
    if(this.skill_cooldown > 0){
      this.skill_cooldown -= 0.5;
    }
    if(this.hp_cooldown > 0){
      this.hp_cooldown -= 0.5;
    }
    if(this.endscreen_cooldown > 0){
      this.endscreen_cooldown -= 0.5;
    }
  }

  
  // Checking if Enemy is  dead
  check_if_states(){
    if(this.hp <= 0){ // Check if player is dead
      this.status = "dead";
      this.endscreen_cooldown = 80;
    }
  }

  // Checks for if enemy is hit with or without blocking
  is_hit(attack){
    if(this.status != "block1" && this.status != "block2"){
      
      if(this.hp_cooldown == 0){
        if(attack == "slash1"){
          this.hp -= 10;
        }else if(attack == "slash2"){
          this.hp -= 15;
        }
      }
      this.hp_cooldown = 30;  // equal to other player's animation cooldown
      this.status = "hurt";
      
    }else if(this.status == "block1"){
      this.status = "block2";
    }
  }

  // draw animation at Enemy's current coords
  // set all animations visibility to false
  draw_status(status){
    for(let i = 0; i < this.animations.length; i++){
      this.animations[i].visibility = false;
    }
    let animations_idx = this.animations_name.indexOf(status);
    this.animations[animations_idx].visibility = true;
    // console.log(status);

    // states character is in are different from skills
    let states = ["idle", "run", "fall", "block1"];

    if(states.includes(status) == false && this.skill_cooldown == 0){
      this.animation_cooldown = 25;
      
      if(status == "slash2"){
        this.skill_cooldown = 100;
      }else if(status == "hurt"){
        this.animation_cooldown = 5;
        this.skill_cooldown = 80;
      }else{
        this.skill_cooldown = 80;
      }
    }

    
    //game.context.scale(-1, 1);

    this.animations[animations_idx].draw(this.x, this.y);
    // this.animations[animations_idx].draw(this.x, this.y);
    /*
    
    if(this.flipH == true){
      game.canvasContext.scale(-1, 1);
      this.animations[animations_idx].draw(this.x, this.y);
    }*/
    
  }
  move(){
    if (this.in_air == false && this.jumping == false){
     this.status = "run"; 
    }
    if(this.direction == "right" && this.x <= canvas.width * 0.985){
      this.x += 2;
    }else if(this.direction == "left" && this.x >= canvas.width * 0.015){
      // make all animations face left
      this.x -= 2;
    }
  }
}