//https://journals.aps.org/pre/abstract/10.1103/PhysRevE.69.062901


const canvas = document.getElementById('canvas')
var ctx = canvas.getContext("2d");

canvas.width = 1920;
canvas.height = 1080;

const borderW = 8

const centerX = canvas.width/2
const centerY = canvas.height/2

const scr_ratio = 0.5

var fps = 60

const period = fps/10

var time = 0
var turn = 0

const gameSize = 40

canvas.style = "width:" + canvas.width * scr_ratio + "px;" +
              "height:" + canvas.height * scr_ratio + "px;"

//controller setup
const ctr = {}
window.addEventListener("keydown", function(event){
  ctr[String.fromCharCode(event.keyCode)] = 1;

  if (event.keyCode == 16){
    ctr["SHFT"] = 1;
  }

  if (event.keyCode == 32){
    ctr["SPACE"] = 1;
  }

  if (event.keyCode == 13){
    ctr["ENT"] = 1;
  }
});
window.addEventListener("keyup", function(event){
  ctr[String.fromCharCode(event.keyCode)] = 0;

  if (event.keyCode == 16){
    ctr["SHFT"] = 0;
  }

  if (event.keyCode == 32){
    ctr["SPACE"] = 0;
  }

  if (event.keyCode == 13){
    ctr["ENT"] = 0;
  }
});

var mouse = {
  x:0,
  y:0,
  old:{
    x:0,
    y:0
  },
  oldOld:{
    x:0,
    y:0
  },
  dir:{
    x:0,
    y:0
  }
}
mouse.update = function(event){
  // credit to Rafał S at:
  //https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas?answertab=trending#tab-top
  let rect = canvas.getBoundingClientRect();

  this.oldOld = {
    x:this.old.x,
    y:this.old.y
  }

  this.old = {
    x:this.x,
    y:this.y
  }

  this.dir = normalize(mouse)

  this.x = (event.clientX - rect.left)/scr_ratio - borderW
  this.y = (event.clientY - rect.top)/scr_ratio - borderW
}
window.addEventListener("mousemove", function(){
  mouse.update(event)
});

//canvas background
const background = new Scene()

//our main character/nanobot
const nano = new Nanobot(centerX/2, centerY, gameSize)

const clot = new Clot((centerX * 3)/2, centerY, gameSize)

//animation() runs each frame
function animate(){

  background.draw()

  if(time % period == 0){
    nano.nextTurn()
  }

  nano.update()
  nano.draw()

  clot.update()
  clot.draw()

  time++

}

window.onload = setInterval(animate, 1000/fps);
