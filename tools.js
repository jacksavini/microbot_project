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

function youLose(){
  lossAlpha += 0.01

  ctx.fillStyle = "#FF0000"
  ctx.globalAlpha = lossAlpha
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.globalAlpha = 1

  if(lossAlpha >= 1){
    lossAlpha = 1
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "100px Arial";
    ctx.fillText("You Lose", 750, 550);
  }
}

function youWin(){
  lossAlpha += 0.007

  ctx.fillStyle = "#00BB00"
  ctx.globalAlpha = lossAlpha
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.globalAlpha = 1

  if(lossAlpha >= 1){
    lossAlpha = 1
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "100px Arial";
    ctx.fillText("You Win", 750, 550);
    ctx.fillText(timer.finalTime, 450, 750);
  }
}

function getZoom(x, y, w, h){
  let amt = zoominess

  let x2 = x * (amt * 2 + 1)
  let y2 = y * (amt * 2 + 1)

  let w2 = w * (amt * 2 + 1)
  let h2 = h * (amt * 2 + 1)

  x2 -= canvas.width * amt * 0.95
  y2 -= canvas.height * amt * 0.57

  return([x2, y2, w2, h2])

}

function drawPNG(x, y, w, h, img){

  let zoom = getZoom(
    x,
    y,
    w,
    h
  )

  if(typeof dw == undefined){
    ctx.drawImage(
      img,
      zoom[0],
      zoom[1],
      zoom[2],
      zoom[3]
    );
    return
  }
  ctx.drawImage(
    img,
    zoom[0],
    zoom[1],
    zoom[2],
    zoom[3]
  );

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

var timer = {
  time: 0,
  seconds: 120,
  stall:true,
  win:false,
  finalTime:""
}
timer.update = function(){
  if(ctr["1"] || ctr["2"] || ctr["9"] || ctr["0"]) timer.stall = false

  if(!timer.stall){
    timer.time ++

    if(timer.time%fps == 0 && timer.seconds != 0){
      timer.seconds --
    }
  }

  ctx.fillStyle = "#FFFFFF"
  let str = "" + timer.seconds + ""
  ctx.font = "100px Arial";
  ctx.fillText(str, 10, 90);
}
timer.checkWin = function(){
  if(nano.n[2].x >= 1280 && timer.seconds>0 && !timer.win){
    timer.win = true

    let tm = timer.time/fps
    tm = Math.floor(tm * 100)
    tm = tm/100
    timer.finalTime = "Score: " + tm + " seconds"
  }

  if(timer.win){
    youWin()
  }

  if(timer.seconds <= 0 && !timer.win){
    youLose()
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

    drawPNG(
      this.x + canvas.width / 4.1,
      this.y + canvas.height / 7,
      this.w/2, this.h/2, img[3]
    )

  }

  drawTop(){

    drawPNG(
      this.x + canvas.width / 4.1,
      this.y + canvas.height / 7,
      this.w/2,
      this.h/2,
      img[2]
     )

    drawPNG(
       this.x,
       this.y,
       this.w,
       this.h,
       img[0]
      )

  }
}

class Cell{
  constructor(x, y, size){
    this.x = x + Math.random() * size/5
    this.y = y + Math.random() * size/5
    this.size = size + Math.random() * size/2

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

    drawPNG(
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
    ctx.arc(zoom[0],zoom[1],zoom[2],0, 2 * Math.PI);
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
    this.getOrder()

    shuffleArray(this.cells)

    this.shadeCells()
  }

  makeClot(){
    for(let j=0; j<60; j++){
      let start = Math.floor(2*Math.sin(Math.PI/2.001 * (30 - Math.abs(j-30) )/30)*this.size/1.2)-10
      for(let i=0; i<10; i++){  //for(let i=start; i<20 - start; i++){
        this.cells.push(new Cell(
          this.x - (i - 5) * this.size * 2, //this.x - (i - (10 - start/10)) * this.size * 2,
          this.y - (j - 30) * this.size * 2 + 50, //this.y - (j - 30) * this.size * 2,
          this.size
        ))
      }
    }
  }

  getOrder(){
    for(let i=0; i<this.cells.length; i++){
      this.order.push(i)
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
      for(let i=0; i<50; i++){
        for(let j=0; j<this.cells.length; j++){
          this.cells[j].update()
        }
      }
      this.ready = true
    }

    this.order.sort(compareDists);

    for(let i=0; i<this.cells.length; i++){
      let j = this.order[i]
      this.cells[j].update()
    }
  }
}
