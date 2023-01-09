//https://journals.aps.org/pre/abstract/10, .1103/PhysRevE.69.062901

const canvas = document.getElementById('canvas')
var ctx = canvas.getContext("2d");

var lossAlpha = 0

var time = 0
var timeRatio = 1

const pi = Math.PI

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

const gameSize = 100

const x1 = 500
const y1 = 500

const x2 = 800
const y2 = 500

const x3 = 1100
const y3 = 500


function drawCell(x, y){

  //draws & fills in a circle at the cell's location
  ctx.fillStyle = "#FF0000"

  ctx.beginPath()
  ctx.arc(x, y, gameSize, 0, 2 * pi);
  ctx.closePath()
  ctx.fill()

  // big shadow
  ctx.fillStyle = "#990000"
  ctx.beginPath()
  ctx.arc(x, y, gameSize, 1.772, 4.511)
  ctx.arc(x + (3*gameSize)/10, y, gameSize * 1.1, 4.245, 2.037, true)
  ctx.closePath()
  ctx.fill()

  // small left shadow
  ctx.beginPath()
  ctx.arc(x, y, gameSize * 0.5, 1.772, 4.511)
  ctx.arc(x + (3*gameSize * 0.5)/10, y, gameSize * 0.5 * 1.1, 4.245, 2.037, true)
  ctx.closePath()
  ctx.fill()

  // small right shadow
  ctx.beginPath()
  ctx.arc(x, y, gameSize * 0.5, -0.902, 0.902)
  ctx.arc(x - (2.4*gameSize * 0.5)/10, y, gameSize * 0.5 * 1.1, 0.427, -0.427, true)
  ctx.closePath()
  ctx.fill()


}

function drawCell2(x, y){

  ctx.fillStyle = "#00FF00"

  ctx.beginPath()
  ctx.arc(x, y, gameSize * 1.25, 0, 2 * pi);
  ctx.closePath()
  ctx.fill()

  //draws & fills in a circle at the cell's location
  ctx.fillStyle = "#FF0000"

  ctx.beginPath()
  ctx.arc(x - 13 * gameSize/10, y, gameSize * 2, -pi/6, pi/6);
  ctx.arc(x, y + 3*gameSize/4, gameSize/2, pi/6, 5 * pi/6);
  ctx.arc(x + 13*gameSize/10, y, gameSize * 2, 5*pi/6, 7*pi/6);
  ctx.arc(x, y - 3*gameSize/4, gameSize/2, 7 * pi/6, 11 * pi/6);
  ctx.closePath()
  ctx.fill()



}

function drawSpinCell(x, y){
  ctx.fillStyle = "#ff0000"

  let b =  2/(timeRatio*timeRatio+3)
  let c = b - 0.5
  ctx.beginPath()
  ctx.arc(x - timeRatio * (1.3 * gameSize), y, gameSize * (1 + timeRatio * 0.75), -pi/6 , pi/6);
  ctx.arc(x, y + timeRatio * (3/4) * gameSize, gameSize * 1 - timeRatio * 0.75 * gameSize, pi/6, 5 * pi/6);
  ctx.arc(x + timeRatio * (1.3 * gameSize), y, gameSize * (1 + timeRatio * 0.75), 5*pi/6, 7*pi/6);
  ctx.arc(x, y - timeRatio * (3/4) * gameSize, gameSize * 1 - timeRatio * 0.75 * gameSize, 7*pi/6, 11 * pi/6);
  ctx.closePath()
  ctx.fill()



  ctx.fillStyle = "#990000"
  ctx.beginPath()
  ctx.arc(x, y + timeRatio * (3/4) * gameSize, gameSize * 1 - timeRatio * 0.75 * gameSize, (2 * pi)/3 - b, 5 * pi/6);
  ctx.arc(x + timeRatio * (1.3 * gameSize), y, gameSize * (1 + timeRatio * 0.75), 5*pi/6, 7*pi/6);
  ctx.arc(x, y - timeRatio * (3/4) * gameSize, gameSize * 1 - timeRatio * 0.75 * gameSize, 7*pi/6, 4 * pi/3 + b);

  ctx.arc(x+gameSize/5, y - timeRatio * (3/4) * gameSize, gameSize * 1 - timeRatio * 0.75 * gameSize, 4 * pi/3 + c, 7*pi/6, true);
  ctx.arc(x + timeRatio * (1.3 * gameSize) +gameSize/5, y, gameSize * (1 + timeRatio * 0.75), 7*pi/6, 5*pi/6, true);
  ctx.arc(x+gameSize/5, y + timeRatio * (3/4) * gameSize, gameSize * 1 - timeRatio * 0.75 * gameSize, 5 * pi/6, 2 * pi/3 - c, true);
  ctx.closePath()
  ctx.fill()
}

//animation() runs each frame
function animate(){
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawCell(x1, y1)
  drawCell2(x2, y2)
  drawSpinCell(x3, y3)

  time++
  timeRatio = Math.cos(time/20) * 0.5 + 0.5

}

window.onload = setInterval(animate, 1000/fps);
