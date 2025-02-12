// Player Class
class Player{
  constructor(name, controls_arr, voice_control, img_control){
    if(name == undefined || name == ""){
      this.name = "Hero";  
    }else{
      this.name = name;
    }
  
    this.hp = 100;
    this.hp_cooldown = 0;
    this.animation_cooldown = 0;
    this.skill_cooldown = 0;
    this.jumping = false;
    this.in_air = true;
    this.fall_factor = 1;
    this.direction = "right";
    this.status = "idle";
    this.hp_width = canvas.width * 0.25;
    
    this.x = 0;
    this.y = 0;
    this.hitbox = new Sprite(game.images.IdleHitbox,game, this.x, this.y);

    this.img_control = img_control;
    this.voice_control = voice_control;
    this.controls = {"slash1": controls_arr[0], "slash2": controls_arr[1], "block1": controls_arr[2], "fall": controls_arr[3], "left": controls_arr[4], "right": controls_arr[5]};
    this.animations_name = ["idle", "slash1", "slash2", "block1", "block2", "run", "hurt", "fall", "dead"];
    
    
    this.animations = [];
    this.animations.push(new Animation(game.images.MC_idle,8,game,100,55));  // idle
    this.animations.push(new Animation(game.images.MC_slash1,6,game,100,55));  // slash1
    this.animations.push(new Animation(game.images.MC_slash2,8,game,100,55));  // slash2
    this.animations.push(new Animation(game.images.MC_block1,8,game,100,55));  // block1
    this.animations.push(new Animation(game.images.MC_block2,5,game,100,55));  // block2
    this.animations.push(new Animation(game.images.MC_run,10,game,100,55));  // run
    this.animations.push(new Animation(game.images.MC_hurt,3,game,100,55));   // hurt
    this.animations.push(new Animation(game.images.MC_fall,4,game,100,55));  //  fall
    this.animations.push(new Animation(game.images.MC_dead,10,game,100,55));  //  dead

    // change player animation speed & size

    this.hitbox.scale = 0.20 * canvas.height / this.hitbox.height;
    for(let i = 0; i < this.animations.length; i++){
      this.animations[i].scale = (canvas.height/6) / this.animations[i].height;
      this.animations[i].framerate = 0.15;
    }
    
  }


  cooldown_timer(){
    // repositions hitbox to wherever player is
    this.hitbox.x = this.x;
    this.hitbox.y = this.y;

    // makes all directions of the player's animation & pos equal to the player's current direction & pos
    for(let i = 0; i < this.animations.length; i++){
      this.animations[i].direction = this.direction;
      this.animations[i].x = this.x;
      this.animations[i].y = this.y;
    }
    // reduces cooldown each time game loop reiterates, acting as a "cooldown"
    if(this.animation_cooldown > 0){
      this.animation_cooldown -= 0.5;
    }
    if(this.skill_cooldown > 0){
      this.skill_cooldown -= 0.5;
    }
    if(this.hp_cooldown > 0){
      this.hp_cooldown -= 0.5;
    }
    // resize hp bar for players
    if(this.hp <= 0){
      this.hp_width = 0;
    }else{
      this.hp_width = canvas.width * 0.25 * (this.hp / 100);
    }

    // change hp bar color depending on hp
  }

  // Checking if Player is in ther air/jumping/falling/ or dead
  check_if_states(){
    if(this.animation_cooldown == 0 && this.in_air == false && this.jumping == false){
      this.status = "idle";
    }else if(this.jumping){
      this.status = "fall";  // Change status to jump
      this.y -= 10 * this.fall_factor;  // fall_factor approaches 0, dy approaches 0
      this.fall_factor *= 0.9;

      if(this.fall_factor < 0.05){
        this.in_air = true;
        this.fall_factor = 1;
        this.jumping = false;
      }
    }else if(this.in_air){  // falling downwards
      this.status = "fall";
      this.y += 3 * this.fall_factor;
      if(this.fall_factor <= 1.6){  // fall_factor (acceleration) limit cap is 1.5
        this.fall_factor *= 1.1;
      }
      
      if(this.y >= 0.61 * canvas.height){
        this.fall_factor = 1;
        this.in_air = false;
      }
    }
  }

  // Checks for if player is hit with or without blocking
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
      if(this.hp <= 0){
        this.status = "dead";
      }else{
        this.status = "hurt";
      }
    }else if(this.status == "block1"){
      this.status = "block2";
    }

  }

  // For Controlling Using Keys
  check_player_inputs(){
    // if input skills
    if(this.skill_cooldown == 0 && this.jumping == false && this.in_air == false){
      // for each control, check if pressed corresponding key
      let control_keys = Object.keys(this.controls);
      
      for(let i = 0; i < 3; i++){
        if(key.pressed[this.controls[control_keys[i]]]){
          this.status = control_keys[i];
        }
      }
    }

    // if jumping, cannot jump again
    if(key.pressed[this.controls["fall"]] && this.jumping == false && this.in_air == false){
        this.status = "fall";
        this.jumping = "true";
    }

    // if input walking
    if(this.animation_cooldown == 0){
      if(key.pressed[this.controls["left"]]){
        this.direction = "left";
        this.move();
      }else if(key.pressed[this.controls["right"]]){
        this.direction = "right";
        this.move();
      }
    } 
  }

  
  // For Controlling Using Camera/Images
  imageInputs(){
    let command;
    let possibility = 0.65; // possibility threshold is 65%

    // img_control is an array of jsons - [{class_name: probability}, ...]

    if(prediction != null && this.img_control != ""){
      for(let i = 0; i < prediction.length; i++){
        let curr_json = prediction[i];
        let class_name = curr_json.className;
        // console.log(curr_json["probability"], class_name);
  
        // sets command equal to img class with greatest possibility
        if(curr_json["probability"] > possibility){
          possibility = curr_json["probability"];
          if(command == "left"){
            if(curr_json["probability"] > 94){ // if left, probability has to be greater than 94%
              command = class_name;
            }
          }else{ // if not left
            command = class_name;
          }
          
        }
      
      }  
    }

    //  Img Command for Left And Right
    if(command == "Left"){
      this.direction = "left";
      this.move();
    }else if(command == "Right"){
      this.direction = "right";
      this.move();
    }

    //  Img Command for Jumping
    if(command == "Jump" && this.jumping == false && this.in_air == false){
        this.status = "fall";
        this.jumping = "true";
    }

    if(this.skill_cooldown == 0 && this.jumping == false && this.in_air == false){
      // for each control, check if pressed corresponding key
      let actions = ["slash1", "slash2", "block1"];
      let command2 = ["Slash1", "Slash2", "Block"];
      
      for(let i = 0; i < 3; i++){
        if(command == command2[i]){
          this.status = actions[i];
        }
      }
    }
  }
  
  //  For Controlling Using Voice
  voiceInputs(){
    let possibility = 0.4;
    let voice_keys = Object.keys(this.voice_control);
    let command;

    if(this.voice_control != ""){
      for(let i = 0; i < voice_keys.length; i++){
        //  Gets the command stated with the greatest possibility    
        if(this.voice_control[voice_keys[i]] > possibility){
          possibility = this.voice_control[voice_keys[i]];
          command = voice_keys[i];
        }
      }
  
      //  Voice Command for Left And Right
      if(command == "Left"){
        this.direction = "left";
        this.move();
      }else if(command == "Right"){
        this.direction = "right";
        this.move();
      } 
    }

    //  Voice Command for Jumping
    if(command == "Jump" && this.jumping == false && this.in_air == false){
        this.status = "fall";
        this.jumping = "true";
    }

    if(this.skill_cooldown == 0 && this.jumping == false && this.in_air == false){
      // for each control, check if pressed corresponding key
      let actions = ["slash1", "slash2", "block1"];
      let command2 = ["Hit 1", "Slash 2", "Block"];
      
      for(let i = 0; i < 3; i++){
        if(command == command2[i]){
          this.status = actions[i];
        }
      }
    }
  }
    

  // draw animation at player's current coords
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

      if(status == "dead"){
        this.animation_cooldown = 40;
      }else if(status == "slash2"){
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
      this.x -= 2;
    }
  }
}