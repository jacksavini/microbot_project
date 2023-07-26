function normalize(obj){
  let mag = Math.abs(Math.sqrt(
    obj.x * obj.x + obj.y * obj.y
  ))
  if(mag <= 0.1){
    mag = 1
  }
  return({
    x:obj.x/mag,
    y:obj.y/mag
  })
}

function getDistance(obj1, obj2){
  let ans = Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2)
  ans = Math.sqrt(ans)

  return(ans)
}

function getDirection(obj1, obj2){
  return(normalize({
    x:obj2.x - obj1.x,
    y:obj2.y - obj1.y
  }))
}

function checkCollision(obj1, obj2){
  let maxDist = obj1.size + obj2.size

  if(getDistance(obj1, obj2) < maxDist) return(true)
  return(false)
}

function compareDists(a,b) {
  if ( getDistance(clot.cells[a], nano.n[2]) < getDistance(clot.cells[b], nano.n[2]) )
     return -1;
  else
    return 1;
  return 0;
}

function getZoom(x, y, w, h){
  let amt = zoom

  // let newX = x1 * (1 - amt) + x2 * amt
  // let newY = y1 * (1 - amt) + y2 * amt
  //
  // let newW = w1 * (1 - amt) + w2 * amt
  // let newH = h1 * (1 - amt) + h2 * amt

  let x2 = x * (amt + 1)
  let y2 = y * (amt + 1)


  let w2 = w * (amt + 1)
  let h2 = h * (amt + 1)

  x2 -= canvas.width * amt * 0.475
  y2 -= canvas.height * amt * 0.285

  return([x2, y2, w2, h2])

}

function getZoom2(x1, y1, w1, h1, x2, y2, w2, h2, amt){

  let newX = x1 * (1 - amt) + x2 * amt
  let newY = y1 * (1 - amt) + y2 * amt

  let newW = w1 * (1 - amt) + w2 * amt
  let newH = h1 * (1 - amt) + h2 * amt

  return([newX, newY, newW, newH])

}

function drawPNG(x, y, w, h, img){

  let zoom = getZoom(
    x, y, w, h
  )

  ctx.drawImage(
    img, zoom[0], zoom[1], zoom[2], zoom[3]
  );
}

function drawGUI(x, y, w, h, img){
  //0, 0, 1920, 1080, -926, -521, 3870, 2177

  ctx.drawImage(
    img, x, y, w, h
  );

}

function drawPNG2(img, x1, y1, w1, h1, x2, y2, w2, h2, zoom){

  let zoomLoc = getZoom2(
    x1, y1, w1, h1, x2, y2, w2, h2, zoom
  )

  ctx.drawImage(
    img, zoomLoc[0], zoomLoc[1], zoomLoc[2], zoomLoc[3],
    0, 0, canvas.width, canvas.height
  );

}

function drawGame(x, y, w, h, img){
  ctx.drawImage(
    img, x, y, w, h
  );
}

function saveGameImg(){
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  background.drawBottom()
  nano.draw()
  clot.draw()
  background.drawTop()
}

function saveGameImg2(){
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  background.drawBottom()

  nano.draw()

  clot.draw()

  background.drawTop()
  background.drawScreen()
  background.drawTippityTop()

  bed.draw()


  docMenu.buttons[1].draw()
  docMenu.buttons[2].draw()
}

// Taken from this link:
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function makeImage(source){
  let img = new Image();
  img.src = source;
  return(img)
}

var cvtHex = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"]

function resetGame(){
  background = new Scene()

  //our main character/nanobot
  nano = new Nanobot(centerX * 0.4, centerY * 0.8, gameSize)

  nono = new Nonobot(-100, centerY * 0.7, gameSize)

  clot = new Clot(centerX * 1.1, centerY, gameSize * 0.5)

  game = new Game()
}

bed = {}

bed.draw = function(){
  drawPNG(
     1100,
     550,
     800,
     500,
     img[15]
  )
}


class Game{
  constructor(){
    this.alpha = 0

    this.timer = {
      time: 0,
      startTime:60,
      seconds: 60,
      stall:true,
      win:false,
      finalTime:""
    }

  }

  checkWin(){
    if(nano.n[2].x >= 1250 && this.timer.seconds>0 && !this.timer.win){
      this.timer.win = true

      let tm = this.timer.time/fps
      tm = Math.floor(tm * 100)
      tm = tm/100
      this.timer.finalTime = "Score: " + tm + " seconds"
    }

    if(this.timer.win){
      this.youWin()
    }

    if(this.timer.seconds <= 0 && !this.timer.win){
      this.youLose()
    }
  }

  youLose(){
    this.alpha += 0.007

    ctx.fillStyle = "#000000"
    ctx.globalAlpha = this.alpha
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.globalAlpha = 1

    if(this.alpha >= 0.8){
      this.alpha = 0.8
      ctx.fillStyle = "#FFFFFF"
      ctx.font = "100px Arial";
      ctx.fillText("You Lose", 750, 550);
    }
  }

  youWin(){
    this.alpha += 0.007

    ctx.fillStyle = "#000000"
    ctx.globalAlpha = this.alpha
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.globalAlpha = 1

    if(this.alpha >= 0.8){
      this.alpha = 0.8
      ctx.fillStyle = "#FFFFFF"
      ctx.font = "100px Arial";
      ctx.fillText("You Win", 750, 550);
      ctx.fillText(this.timer.finalTime, 450, 750);
    }
  }

  updateTimer(){
    if(menu.state == 2 || menu.state == 8) this.timer.stall = false

    if(!this.timer.stall && !this.timer.win){
      this.timer.time ++

      if(this.timer.time%fps == 0 && this.timer.seconds != 0){
        this.timer.seconds --
      }
    }
  }

  draw(){
    let str = "" + this.timer.seconds + ""

    ctx.fillStyle = "#FFFFFF"
    ctx.font = "100px Arial";
    ctx.fillText(str, 1642, 200);
    this.checkWin()

  }

  update(){
    this.updateTimer()
  }

}

class Scene{
  constructor(){
    this.x = 0
    this.y = 0

    this.w = canvas.width
    this.h = canvas.height

  }

  drawBottom(){
    ctx.clearRect(this.x, this.y, this.w, this.h)

    drawGame(
      this.x,
      this.y,
      this.w, this.h, img[3]
    )

  }

  drawTop(){
    drawGame(
      this.x,
      this.y,
      this.w,
      this.h,
      img[2]
    )
  }

  drawScreen(){
    drawPNG(
       463,
       157,
       950,
       950 * 1080/1920,
       img[9]
    )
  }

  drawTippityTop(){
    drawPNG2(
       img[0],
       0,
       0,
       5686,
       3188,
       1370,
       466,
       2820,
       1570,
       zoom
    )





    // drawPNG(
    //    1577,
    //    320,
    //    250,
    //    60,
    //    img[17]
    // )
  }
}

class Cell{
  constructor(x, y, size){
    // this.x = x + Math.random() * size/5
    // this.y = y + Math.random() * size/5
    // this.size = size * 0.8 + Math.random() * size/2

    this.x = x
    this.y = y
    this.size = size

    this.dir = {
      x:0,
      y:0
    }
    this.velocity = 0

    let magnification = 1.5
    this.drawsize = this.size * magnification
  }

  bounce(obj){

    // Different bounce physics
    // only changes the bouncee's velocity (this)

    // equalizes and alters velocity for both the bouncer & bouncee

    let c = obj.velocity + this.velocity
    this.velocity = (c/2)
    obj.velocity = (c/2)

    let overlap = getDistance(obj, this)
    overlap -= obj.size
    overlap -= this.size

    overlap = Math.min(overlap, 0)
    overlap = Math.abs(overlap)


    // direction is based on a vector, going from the center of
    // one cell, to the center of the other, as they collide
    this.dir = getDirection(obj, this)

    // checks if the nanobot is being bounced off of. If so,
    // it is extra careful to not overlap with any cells.


    this.x += this.dir.x * overlap
    this.y += this.dir.y * overlap

    this.dir = getDirection(obj, this)


    // moves the cell away from its collision
    this.x += this.dir.x * this.velocity
    this.y += this.dir.y * this.velocity
  }

  move(){

    // initial movement of the cell, independent of any collisions
    this.x += this.dir.x * this.velocity
    this.y += this.dir.y * this.velocity

    // this will trigger at each frame to diminish the cell's velocity
    this.velocity*=0.9

  }

  update(){

    if(this.velocity > 0){
      this.move()
    }

    // checks for nanobot collision
    for(let i=0; i<3; i++){
      if(checkCollision(nano.n[i], this)){
        this.bounce(nano.n[i])
      }
    }

    // checks all other cells for a collision
    for(let i=0; i<clot.cells.length; i++){

      if(clot.cells[i] == this) continue

      if( checkCollision(clot.cells[i], this) ){
        clot.cells[i].bounce(this)
      }
    }
  }

  draw(){

    drawGame(
      this.x - this.drawsize,
      this.y - this.drawsize,
      this.drawsize*2,
      this.drawsize*2,
      img[1]
     )

    ctx.globalAlpha = this.col
    ctx.fillStyle = "#000000"

    let zoom = getZoom(
      this.x,
      this.y,
      this.drawsize,
      this.drawsize
    )

    ctx.beginPath()
    ctx.arc(this.x,this.y,this.drawsize,0, 2 * Math.PI);
    ctx.closePath()
    ctx.fill()

    ctx.globalAlpha = 1

  }
}

class Clot{
  constructor(x, y, size){
    this.x = x
    this.y = y

    this.ready = false

    this.size = size

    this.cells = []
    this.makeClot()

    this.order = []

    for(let i=0; i<this.cells.length; i++){
      this.order.push(i)
    }

    this.shadeCells()
  }

  makeClot(){

    for(let i=0; i<cellInfo.length; i++){
      this.cells.push(new Cell(
        cellInfo[i][0], //this.x - (i - (10 - start/10)) * this.size * 2,
        cellInfo[i][1], //this.y - (j - 30) * this.size * 2,
        cellInfo[i][2]
      ))
    }
    if(this.ready){
      this.ready = false
    }
  }

  shadeCells(){
    for(let i=0; i<this.cells.length; i++){

      let brightness = 1 - (100 + Math.floor( (i/this.cells.length) * 156))/256
      this.cells[i].col = brightness

      let col2 = "#"
      let brightness2 = Math.floor( (i/this.cells.length) * 155)
      col2 += cvtHex[ Math.floor(brightness2/16) ]
      col2 += cvtHex[ brightness2 % 16 ]
      col2 += "0000"
      this.cells[i].col2 = col2
    }
  }

  draw(){
    for(let i=0; i<this.cells.length; i++){
      this.cells[i].draw()
    }
  }

  update(){
    if(!this.ready){

      this.ready = true

    }

    this.order.sort(compareDists);

    for(let i=0; i<this.cells.length; i++){
      let j = this.order[i]
      this.cells[j].update()
    }
  }
}

class SpeechBubble{
  constructor(x, y, w, h, img, lines){
    this.x = x
    this.y = y
    this.w = w
    this.h = h

    this.img = img
    this.lines = lines

    this.lineIndex = 0

    this.line = this.lines[this.lineIndex]
  }

  nextLine(){
    this.lineIndex = (this.lineIndex + 1) % (this.lines.length)
    this.lineIndex = Math.max(this.lineIndex, 1)
    this.line = this.lines[this.lineIndex]
  }

  draw(){

    drawPNG(this.x - this.w/2, this.y - this.h/2, this.w, this.h, this.img)

    ctx.save();

    ctx.translate( -this.x, -this.y);

    ctx.rotate( Math.PI / 17 );

    ctx.translate( this.x , this.y);


    ctx.textAlign = "center";

    ctx.fillStyle = "#000000"
    ctx.font = "25px Arial";

    ctx.fillText(this.line[0], this.x + 90, this.y - 200, this.w - 60);
    ctx.fillText(this.line[1], this.x + 90, this.y - 150, this.w - 60);

    ctx.restore();

  }
}

class Monitor{
  constructor(){
    this.left=1575
    this.top= 325
    this.w = 1829 - this.left
    this.h = 390 - this.top

    this.img = img[17]

    this.x = 0
    this.y = 0

    this.poleAlpha = 1

  }

  update(){
    this.x += 10

    if(this.x > this.img.width/2){
      this.x -= this.img.width/2
    }
  }

  drawPole(){

    ctx.fillStyle = "#BBBBBB"

    ctx.fillRect(
      1684,
      350,
      40,
      500
     )
  }

  draw(){
    ctx.drawImage(
      img[16],
      1550,
      250 - (zoom * 200),
      300,
      500
    )

    ctx.drawImage(
      this.img,
      this.x,
      0,
      this.img.width/2,
      this.img.height,
      this.left,
      this.top - (zoom * 200),
      this.w,
      this.h
    )

  }
}
