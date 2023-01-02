//https://journals.aps.org/pre/abstract/10, .1103/PhysRevE.69.062901

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

//animation() runs each frame
function animate(){
  ctx.clearRect(0,0,canvas.width, canvas.height)
  ctx.fillStyle = "#FF0000"

  // ctx.beginPath()
  // ctx.arc(canvas.width/2, canvas.height/2, 50, 0, Math.PI*2)
  // ctx.closePath()
  // ctx.fill()
  //
  // ctx.fillStyle = "#AA0000"
  // ctx.beginPath()
  // ctx.arc(canvas.width/2 + 15, canvas.height/2, 55, 0, Math.PI*2, true)
  // ctx.closePath()
  // ctx.fill()

  //cos(theta1) = -0.2
  //cos(theta2) = -0.454545...
  //use arccos to solve

  ctx.fillStyle = "#00FF00"
  ctx.beginPath()
  ctx.arc(canvas.width/2, canvas.height/2, 50, 1.772, 4.511)
  ctx.arc(canvas.width/2 + 15, canvas.height/2, 55, 4.245, 2.037, true)
  ctx.closePath()
  ctx.fill()


}

window.onload = setInterval(animate, 1000/fps);
