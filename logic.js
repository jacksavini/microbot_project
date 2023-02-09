//https://journals.aps.org/pre/abstract/10.1103/PhysRevE.69.062901

const canvas = document.getElementById('canvas')
var ctx = canvas.getContext("2d");

var menu = {state:0}

var zoom = 0
const maxZoom = 1

var screenWidth

canvas.width = 1920;
canvas.height = 1080;

const borderW = 8

const centerX = canvas.width/2
const centerY = canvas.height/2

const screenRatio = canvas.height/canvas.width

canvas.style = "width:" + canvas.width * screenRatio + "px;" +
              "height:" + canvas.height * screenRatio + "px;"

var fps = 60

const gameSize = 40

var img = [
  makeImage("pics/background.png"),
  makeImage("pics/bloodCell.png"),
  makeImage("pics/gameBackgroundTop.png"),
  makeImage("pics/gameBackground.png"),
  makeImage("pics/node.png"),
  makeImage("pics/link.png"),
  makeImage("pics/middleRod.png"),
  makeImage("pics/controls.jpeg"),
  makeImage("pics/credits.jpeg")
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
var nano = new Nanobot(centerX * 0.7, centerY * 0.75, gameSize*0.5)

var clot = new Clot(centerX * 1.1, centerY, gameSize * 0.25)

let mainButtons = [
  new Button(60, 160, 300, 150, "pics/start.png", "pics/startHover.png", 1),
  new Button(60, 350, 300, 150, "pics/controls.png", "pics/controlsHover.png", 5),
  new Button(60, 540, 300, 150, "pics/credits.png", "pics/creditsHover.png", 4)
]
const mainMenu = new Menu(mainButtons)

let subButtons = [
  new Button(50, 50, 150, 150, "pics/back.png", "pics/backHover.png", 3)
]
let subMenu = new Menu(subButtons)

const game = new Game()


function gameState(){
  background.drawBottom()

  nano.update()
  nano.draw()

  clot.update()
  clot.draw()

  background.drawTop()

  game.update()

  subMenu.update()
  subMenu.draw()
}

function zoomState(){
  background.drawBottom()

  nano.draw()

  clot.update()
  clot.draw()

  background.drawTop()

  zoom+= 0.04;

  if(zoom > maxZoom){
    menu.state = 2
    game.timer.seconds = game.timer.startTime
    game.timer.time = 0
    game.timer.stall = true
    game.timer.win = false
    game.alpha = 0
  }
}

function unzoomState(){

  if(zoom >= 1){
    nano = new Nanobot(centerX * 0.7, centerY * 0.75, gameSize*0.5)
    clot = new Clot(centerX * 1.1, centerY, gameSize * 0.25)
  }

  background.drawBottom()

  nano.draw()

  clot.update()
  clot.draw()

  background.drawTop()

  zoom-= 0.04;

  if(zoom < 0){
    zoom = 0
    menu.state = 0
  }
}

function mainMenuState(){
  background.drawBottom()

  nano.draw()

  clot.update()
  clot.draw()

  background.drawTop()

  mainMenu.update()
  mainMenu.draw()
}

function creditsState(){
  drawGUI(0, 0, canvas.width, canvas.height, img[8])

  subMenu.update()
  subMenu.draw()
}

function controlsState(){
  drawGUI(0, 0, canvas.width, canvas.height, img[7])

  subMenu.update()
  subMenu.draw()
}

var states = [
    mainMenuState,
    zoomState,
    gameState,
    unzoomState,
    creditsState,
    controlsState
]

function switchStates(){

}

canvas.addEventListener('click', function(){mainMenu.checkClick()}, false);
canvas.addEventListener('click', function(){subMenu.checkClick()}, false);
//animation() runs each frame
function animate(){

  screenWidth = Math.min(window.innerWidth, (window.innerHeight)/screenRatio)

  canvas.style = "width:" + screenWidth * 0.98 + "px;" +
                "height:" + screenWidth * screenRatio * 0.98 + "px;"

  states[menu.state]()
}

window.onload = setInterval(animate, 1000/fps);
