//https://journals.aps.org/pre/abstract/10.1103/PhysRevE.69.062901

const canvas = document.getElementById('canvas')
var ctx = canvas.getContext("2d");

var zoomSlider = document.getElementById("zoomSlider")
var zoominess = zoomSlider.value

var screenWidth

var lossAlpha = 0

canvas.width = 1920;
canvas.height = 1080;

const borderW = 8

const centerX = canvas.width/2
const centerY = canvas.height/2

const screenRatio = canvas.height/canvas.width

canvas.style = "width:" + canvas.width * screenRatio + "px;" +
              "height:" + canvas.height * screenRatio + "px;"

var fps = 60
var period = fps/3

const gameSize = 40

var img = [
  makeImage("background.png"),
  makeImage("bloodCell.png"),
  makeImage("gameBackgroundTop.png"),
  makeImage("gameBackground.png"),
  makeImage("node.png"),
  makeImage("link.png"),
  makeImage("middleRod.png")
]


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
const nano = new Nanobot(centerX * 0.7, centerY * 0.8, gameSize*0.5)

const clot = new Clot(centerX * 1.2, centerY, gameSize * 0.25)

//animation() runs each frame
function animate(){
  if(ctr["H"]){
    zoomSlider.value = (parseInt(zoomSlider.value) + 5)
  }

  screenWidth = Math.min(window.innerWidth, (window.innerHeight)/screenRatio)

  canvas.style = "width:" + screenWidth * 0.95 + "px;" +
                "height:" + screenWidth * screenRatio * 0.95 + "px;"

  zoominess = zoomSlider.value/200

  background.drawBottom()

  nano.update()
  nano.draw()

  clot.update()
  clot.draw()

  background.drawTop()

  timer.update()
  timer.checkWin()
}

window.onload = setInterval(animate, 1000/fps);
