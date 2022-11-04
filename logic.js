//https://journals.aps.org/pre/abstract/10.1103/PhysRevE.69.062901


const canvas = document.getElementById('canvas')
var ctx = canvas.getContext("2d");

canvas.width = 1920;
canvas.height = 1080;

const centerX = canvas.width/2
const centerY = canvas.height/2

const scr_ratio = 0.5

var fps = 60

const period = fps/10

var time = 0
var turn = 0

const nanoSize = 40

canvas.style = "width:" + canvas.width * scr_ratio + "px;" +
              "height:" + canvas.height * scr_ratio + "px;"

//controller setup
const ctr = {}
window.addEventListener("keydown", function(event){
  ctr[String.fromCharCode(event.keyCode)] = 1;

  if (event.keyCode == 16){
    ctr["SHFT"] = 1;
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

  if (event.keyCode == 13){
    ctr["ENT"] = 0;
  }
});

//canvas background
const background = new Scene()

//our main character/nanobot
const nano = new Nanobot(centerX, centerY, nanoSize)

//animation() runs each frame
function animate(){

  background.draw()

  if(time % period == 0){
    nano.nextTurn()
  }

  nano.update()
  nano.draw()

  time++

}

window.onload = setInterval(animate, 1000/fps);
