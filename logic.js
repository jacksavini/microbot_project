//https://journals.aps.org/pre/abstract/10.1103/PhysRevE.69.062901

const canvas = document.getElementById('canvas')
var ctx = canvas.getContext("2d");

var lossAlpha = 0

canvas.width = 1920;
canvas.height = 1080;

const borderW = 8

const centerX = canvas.width/2
const centerY = canvas.height/2

const scr_ratio = 0.5

canvas.style = "width:" + canvas.width * scr_ratio + "px;" +
              "height:" + canvas.height * scr_ratio + "px;"

var fps = 60

const period = fps/3

const gameSize = 40

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

//canvas background
const background = new Scene()

//our main character/nanobot
const nano = new Nanobot(centerX/2, centerY, gameSize)

const clot = new Clot((centerX * 3)/2, centerY, gameSize)

//animation() runs each frame
function animate(){
  if(ctr["H"]) ctr["H"] = false

  background.draw()

  nano.update()
  nano.draw()

  clot.update()
  clot.draw()

  timer.update()
  timer.checkWin()
}

window.onload = setInterval(animate, 1000/fps);
