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
  if ( getDistance(a, nano.n[2]) < getDistance(b, nano.n[2]) )
     return -1;
  else
    return 1;
  return 0;
}

function getControlScheme(){
  if(box[0].checked != box[0].oldChecked){
    box[0].checked = true
    box[1].checked = false
    box[2].checked = false
    tutorial.textContent= "Press 1 to control the left arm, 2 to control the right arm";
  }

  else if(box[1].checked != box[1].oldChecked){
    box[1].checked = true
    box[0].checked = false
    box[2].checked = false
    tutorial.textContent= "Press 1 and 2 to control the left arm, 9 and 0 to control the right arm";
  }

  else if(box[2].checked != box[2].oldChecked){
    box[2].checked = true
    box[1].checked = false
    box[0].checked = false
    tutorial.textContent= "Press 1 and 2 to control the left arm, 9 and 0 to control the right arm";
  }

  box[0].oldChecked = box[0].checked
  box[1].oldChecked = box[1].checked
  box[2].oldChecked = box[2].checked
}

function getCellPhysics(){
  if(box[3].checked != box[3].oldChecked){
    box[3].checked = true
    box[4].checked = false
  }

  else if(box[4].checked != box[4].oldChecked){
    box[4].checked = true
    box[3].checked = false
  }

  box[3].oldChecked = box[3].checked
  box[4].oldChecked = box[4].checked

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
  win = true
  lossAlpha += 0.01

  ctx.fillStyle = "#00BB00"
  ctx.globalAlpha = lossAlpha
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.globalAlpha = 1

  if(lossAlpha >= 1){
    lossAlpha = 1
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "100px Arial";
    ctx.fillText("You Win", 750, 550);
    ctx.fillText(finalTime, 450, 750);
  }
}

function drawButtons(){
  ctx.strokeStyle = "#000000"
  ctx.fillStyle = "#FFFFFF"

  ctx.beginPath()
  ctx.arc(120, canvas.height - 120, 80, 0, 2 * Math.PI);
  ctx.arc(340, canvas.height - 120, 80, 0, 2 * Math.PI);
  ctx.arc(canvas.width - 340, canvas.height - 120, 80, 0, 2 * Math.PI);
  ctx.arc(canvas.width - 120, canvas.height - 120, 80, 0, 2 * Math.PI);
  ctx.closePath()
  ctx.fill()


  ctx.fillStyle = "#000000"
  ctx.font = "100px Arial";

  ctx.beginPath()

  ctx.fillText("1", 90, canvas.height - 85);
  ctx.fillText("2", 310, canvas.height - 85);

  ctx.fillText("9", canvas.width - 370, canvas.height - 85);
  ctx.fillText("0", canvas.width - 150, canvas.height - 85);

  ctx.closePath()
  ctx.fill()
}

// Taken from this link:
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function getClick(){
  getControlScheme()
  getCellPhysics()
}


class Scene{
  constructor(){
    this.x = 0
    this.y = 0

    this.w = canvas.width
    this.h = canvas.height

    this.col = "#000000"
  }

  draw(){
    ctx.fillStyle = this.col
    ctx.strokeStyle = this.col
    ctx.clearRect(this.x, this.y, this.w, this.h)
    ctx.fillRect(this.x, this.y, this.w, this.h)
  }
}

//A Node is a singular circular section of the nanobot.
class Node{
  constructor(x, y, size, parent){
    this.x = x
    this.y = y

    this.size = size

    this.velocity = 5

    this.oldX = 0

    this.parent = parent

    this.lft = null
    this.rgt = null

    this.col = "#888888"
  }

  draw(){
    //draws & fills in a circle at the nodes location

    ctx.beginPath()

    ctx.fillStyle = this.col

    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.closePath()

    ctx.fill()

  }

  update(){
    this.velocity = Math.abs(this.x - this.oldX, 0)
    this.oldX = this.x
  }
}

//A Connector is a link between the nodes.
class Connector{
  constructor(size, parent, key){
    this.size = size

    this.parent = parent

    this.key = key

    this.maxOffset = 4 * size

    //executions per period
    this.velocity = this.maxOffset / period

    this.offset = 0

    this.extend = false
    this.retract = false

    this.growing = false
    this.shrinking = false

    this.col = "#CCCCCC"
  }

  draw(){
    ctx.beginPath()

    ctx.lineWidth = this.size
    ctx.strokeStyle = this.col

    ctx.moveTo(this.lft.x, this.lft.y)
    ctx.lineTo(this.rgt.x, this.rgt.y)

    ctx.stroke()
  }

  update(){
    if(this.extend){
      this.offset+=this.velocity
    }

    if(this.retract){
      this.offset-=this.velocity
    }

    if(this.offset > this.maxOffset){
      this.offset = this.maxOffset
      this.extend = false
    }

    if(this.offset < 0){
      this.offset = 0
      this.retract = false
    }
  }
}


class Nanobot{
  constructor(x, y, size){
    this.x = x
    this.y = y

    this.d = 0

    this.size = size

    this.n = []
    this.c = []

    this.createStructure()

    this.turn = 0
    this.order = [
      [0, 0], [1, 0], [1, 1], [0, 1]
    ]
  }

  createStructure(){
    this.n.push( new Node(this.x - this.size * 4, this.y, this.size, this) )
    this.n.push( new Node(this.x, this.y, this.size) )
    this.n.push( new Node(this.x + this.size * 4, this.y, this.size, this) )

    this.c.push( new Connector(this.size, this, "1") )
    this.c.push( new Connector(this.size, this, "2") )

    for(let i=0; i<2; i++){
      this.c[i].lft = this.n[i]
      this.c[i].rgt = this.n[i+1]

      this.n[i+1].lft = this.c[i]
      this.n[i].rgt = this.c[i]

      this.c[i].lftW = i+1
      this.c[i].rgtW = this.c.length - i
      this.c[i].totW = this.c[i].lftW + this.c[i].rgtW
      this.c[i].center = this.n[1]

      this.c[i].otherC = this.c[ (i + 1) % 2 ]
    }
  }

  moveNodes(){
    let v = 0

    let t1 = this.c[0].offset / this.c[0].maxOffset
    let t2 = this.c[1].offset / this.c[1].maxOffset

    for(let i=0; i<3; i++){
      this.n[i].x += (this.size/11) * (this.c[0].extend - this.c[0].retract) * (1 + (1 - t2))/2
      this.n[i].x -= (this.size/11) * (this.c[1].extend - this.c[1].retract) * (1 + (1 - t1))/2
    }

    this.n[0].x = (this.n[1].x - 4 * this.size - this.c[0].offset)
    this.n[2].x = (this.n[1].x + 4 * this.size + this.c[1].offset)
  }

  control1(){
    if(ctr["1"]){
      this.c[0].extend = true
      this.c[0].retract = false
    }
    else{
      this.c[0].extend = false
      this.c[0].retract = true
    }

    if(ctr["2"]){
      this.c[1].extend = true
      this.c[1].retract = false
    }
    else{
      this.c[1].extend = false
      this.c[1].retract = true
    }
  }

  control2(){
    if(ctr["1"]){
      this.c[0].extend = true
      this.c[0].retract = false
    }

    if(ctr["2"]){
      this.c[0].extend = false
      this.c[0].retract = true
    }

    if(ctr["9"]){
      this.c[1].extend = true
      this.c[1].retract = false
    }

    if(ctr["0"]){
      this.c[1].extend = false
      this.c[1].retract = true
    }
  }

  control3(){
    if(ctr["1"]) this.c[0].extend = true
    else this.c[0].extend = false

    if(ctr["2"]) this.c[0].retract = true
    else this.c[0].retract = false

    if(ctr["9"]) this.c[1].extend = true
    else this.c[1].extend = false

    if(ctr["0"]) this.c[1].retract = true
    else this.c[1].retract = false
  }

  draw(){
    for(let i=0; i<this.c.length; i++){
      this.c[i].draw()
    }

    ctx.beginPath()

    ctx.moveTo(this.n[1].x - 3 * this.size, this.y)
    ctx.lineTo(this.n[1].x + 3 * this.size, this.y)

    ctx.lineWidth *= 1.2
    ctx.strokeStyle = "#AAAAAA"

    ctx.stroke()

    for(let i=0; i<this.n.length; i++){
      this.n[i].draw()
    }
  }

  update(){
    if(box[0].checked) this.control1()
    if(box[1].checked) this.control2()
    if(box[2].checked) this.control3()

    for(let i=0; i<this.c.length; i++){
      this.c[i].update()
    }

    this.moveNodes()

    this.n[0].update()
    this.n[1].update()
    this.n[2].update()
  }
}


class Cell{
  constructor(x, y, size){
    this.x = x + Math.random() * size
    this.y = y + Math.random() * size

    this.size = size + Math.random() * size/2

    this.dir = {
      x:0,
      y:0
    }

    this.drawsize = 1.5

    this.velocity = 0

    this.col = "#FF0000"
  }

  bounce(obj){
    // Different bounce physics
    if(box[3].checked){
      this.velocity = obj.velocity * 0.8
    }

    if(box[4].checked){
      let c = obj.velocity + this.velocity
      this.velocity = (c/2)
      obj.velocity = (c/2)
    }

    this.dir = getDirection(obj, this)

    if(obj == nano.n[2] || obj == nano.n[1] || obj == nano.n[0]){
      while(checkCollision(obj, this)){
        this.x += this.dir.x * 2
        this.y += this.dir.y * 2
      }
      this.dir = getDirection(obj, this)
    }

    this.x += this.dir.x * this.velocity
    this.y += this.dir.y * this.velocity
  }

  move(){
    this.x += this.dir.x * this.velocity
    this.y += this.dir.y * this.velocity

    if(box[3].checked) this.velocity*=0.999
    if(box[4].checked) this.velocity*=0.9

    if(this.velocity <= 0){
      this.velocity = 0
    }

  }

  update(){

    if(this.velocity > 0){
      this.move()
    }

    for(let i=0; i<3; i++){
      if(checkCollision(nano.n[i], this)){
        this.bounce(nano.n[i])
      }
    }

    for(let i=0; i<clot.cells.length; i++){

      if(clot.cells[i] == this) continue

      let check = checkCollision(clot.cells[i], this)

      if( check ){
        clot.cells[i].bounce(this)
      }
    }

  }

  draw(){
    //draws & fills in a circle at the nodes location

    ctx.beginPath()
    ctx.fillStyle = this.col

    ctx.arc(this.x, this.y, this.size * this.drawsize, 0, 2 * Math.PI);
    ctx.closePath()

    ctx.fill()

  }
}


class Clot{
  constructor(x, y, size){
    this.x = x
    this.y = y

    this.broke = false

    this.size = size/4

    this.cells = []

    this.makeClot()
  }

  makeClot(){
    for(let j=0; j<60; j++){
      let start = Math.floor(2*Math.sin(Math.PI/2.001 * (30 - Math.abs(j-30) )/30)*this.size/1.2)-10
      for(let i=0; i<10; i++){  //for(let i=start; i<20 - start; i++){
        this.cells.push(new Cell(
          this.x - (i - 5) * this.size * 2, //this.x - (i - (10 - start/10)) * this.size * 2,
          this.y - (j - 30) * this.size * 2, //this.y - (j - 30) * this.size * 2,
          this.size
        ))
      }
    }
  }

  draw(){
    for(let i=0; i<this.cells.length; i++){
      this.cells[i].draw()
    }
  }

  update(){
    shuffleArray(this.cells)
    // this.cells.sort(compareDists);

    if(ctr["T"]) this.broken = true;

    for(let i=0; i<this.cells.length; i++){
      this.cells[i].update()
    }
  }
}
