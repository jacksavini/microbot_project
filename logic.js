//https://journals.aps.org/pre/abstract/10.1103/PhysRevE.69.062901

const canvas = document.getElementById('canvas')
var ctx = canvas.getContext("2d");

var menu = {
  state:6,
  start:true
}

var zoom = 0
const maxZoom = 1

var screenWidth
var screenRatio = 0.2

var creditsAlpha = 0

canvas.width = 1920;
canvas.height = 1080;

const borderW = 8

const centerX = canvas.width/2
const centerY = canvas.height/2

// const screenRatio = 0.5
//
// canvas.style = "width:" + canvas.width * screenRatio + "px;" +
//               "height:" + canvas.height * screenRatio + "px;"

var fps = 60

const gameSize = 40

var img = [
  makeImage("pics/background.png"),
  makeImage("pics/bloodCell.png"),
  makeImage("pics/gameBackgroundTop2.png"),
  makeImage("pics/gameBackground.png"),
  makeImage("pics/regularNode.png"),
  makeImage("pics/link.png"),
  makeImage("pics/middleRod.png"),
  makeImage("pics/controls.jpeg"),
  makeImage("pics/credits-names.png"),
  makeImage("pics/screenImg.png"),
  makeImage("pics/happydoctor.png"),
  makeImage("pics/Operation_Lights_1.png"),
  makeImage("pics/speechbubble.png"),
  makeImage("pics/headNode.png"),
  makeImage("pics/zoomImg.png"),
  makeImage("pics/bed.png"),
  makeImage("pics/heartratemonitor.png"),
  makeImage("pics/heartrateline.png"),
  makeImage("pics/scu.png"),
  makeImage("pics/science.png"),
  makeImage("pics/marvel.png"),
  makeImage("pics/Title.png"),
  makeImage("pics/youWin.png"),
  makeImage("pics/partyNode.png"),
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

function setUp(){
  background = new Scene()

  //our main character/nanobot
  nano = new Nanobot(centerX * 0.4, centerY * 0.8, gameSize)

  clot = new Clot(centerX * 1.1, centerY, gameSize * 0.5)

  game = new Game()
}

const monitor = new Monitor()

//canvas background
var background = new Scene()

//our main character/nanobot
var nano = new Nanobot(centerX * 0.4, centerY * 0.8, gameSize)

var nono = new Nonobot(-100, centerY * 0.7, gameSize)

var clot = new Clot(centerX * 1.1, centerY, gameSize * 0.5)

let startButtons = [
  new Button(800, 540, 400, 200, "pics/start.png", "pics/startHover.png", 5)
]
const startMenu = new Menu(startButtons)

let mainButtons = [
  new Button(800, 600, 400, 200, "pics/start.png", "pics/startHover.png", 1),
  new Button(50, 350, 300, 150, "pics/controls.png", "pics/controlsHover.png", 5),
  new Button(1570, 880, 300, 150, "pics/credits.png", "pics/creditsHover.png", 4)
]
const mainMenu = new Menu(mainButtons)

let subButtons = [
  new Button(40, 40, 160, 140, "pics/back.png", "pics/backHover.png", 3),
  new Button(210, 40, 160, 140, "pics/pause.png", "pics/pauseHover.png", 8),
  new Button(380, 40, 160, 140, "pics/return.png", "pics/returnHover.png", 9)
]
let subMenu = new Menu(subButtons)

let pauseButtons = [
  new Button(40, 40, 160, 140, "pics/back.png", "pics/backHover.png", 3),
  new Button(210, 40, 160, 140, "pics/play.png", "pics/playHover.png", 2),
  new Button(380, 40, 160, 140, "pics/return.png", "pics/returnHover.png", 9)
]
let pauseMenu = new Menu(pauseButtons)

let creditButtons = [
  new Button(40, 40, 160, 140, "pics/back.png", "pics/backHover.png", 3)
]
let creditMenu = new Menu(creditButtons)

let docButtons = [
  new Button(720, 320, 400, 200, "pics/start.png", "pics/startHover.png", 1),
  new Button(50, 200, 400, 800, "pics/happydoctor.png", "pics/happydoctorHover.png", 7),
  new Button(1570, 930, 320, 110, "pics/credits.png", "pics/creditsHover.png", 4)
]
const docMenu = new Menu(docButtons)

canvas.addEventListener('click', function(){startMenu.checkClick()}, false);
canvas.addEventListener('click', function(){mainMenu.checkClick()}, false);
canvas.addEventListener('click', function(){subMenu.checkClick()}, false);
canvas.addEventListener('click', function(){creditMenu.checkClick()}, false);
canvas.addEventListener('click', function(){docMenu.checkClick()}, false);
canvas.addEventListener('click', function(){pauseMenu.checkClick()}, false);

var game = new Game()

var docLines = [
  ["Click me for",  "some useful tips."],
  ["Press '1' and '2'",  "to control the bot"],
  ["Find a pattern that","moves the bot forward"],
  ["Keep going until","you break the clot"],
  ["To win, break the clot", "within the time limit"],
  ["Don't give up! You'll", "get it if you keep trying" ]
]

var bubble = new SpeechBubble(470, 250, 300, 200, img[12], docLines)

function getCells(cells){
  s = "["
  for(let i=0; i<cells.length; i++){
    s += "["
    s += clot.cells[i].x
    s += ", "
    s += clot.cells[i].y
    s += ", "
    s += clot.cells[i].size
    s += "],"
  }
  console.log(s)
}

//animation() runs each frame
function animate(){
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // if(ctr["3"]){
  //   game.timer.seconds = 3
  // }
  //
  // if(ctr["4"]){
  //   for(let i=0; i<nano.n.length; i++){
  //     nano.n[i].x+=100
  //   }
  // }

  states[menu.state]()

  if(menu.state == 5 && (img[9].height == 0 || img[14].height == 0)){
    menu.start = false
  }

  if (ctr["P"]){getCells(cellInfo)}

}


window.onload = function(){
  setInterval(animate, 1000/fps);
}
