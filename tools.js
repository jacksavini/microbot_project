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

class Scene{
  constructor(){
    this.x = 0
    this.y = 0

    this.w = canvas.width
    this.h = canvas.height

    this.col = "990000"
  }

  draw(){
    ctx.fillStyle = this.col
    ctx.strokeStyle = this.col
    ctx.clearRect(this.x, this.y, this.w, this.h)
    ctx.fillRect(this.x, this.y, this.w, this.h)
  }
}


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
}


class Connector{
  constructor(size, parent, key){
    this.size = size

    this.parent = parent

    this.key = key

    this.maxOffset = 2 * size

    //executions per period
    this.velocity = this.maxOffset / period

    this.offset = 0
    this.extended = 0

    this.col = "#CCCCCC"
  }

  distOffset(){
    let c1 = (this.otherC.rgt.x - this.otherC.lft.x)
    let c2 = (this.rgt.x - this.lft.x)
    return (c1 - c2) / (this.size * 4)
  }

  moveLeftNodes(offset){

    let d = this.distOffset()

    let lft = this

    while(lft != null){

      lft = lft.lft
      lft.x += offset + d
      lft = lft.lft
    }

  }

  moveRightNodes(offset){

    let d = this.distOffset()

    let rgt = this

    while(rgt != null){

      rgt = rgt.rgt
      rgt.x += offset + d
      rgt = rgt.rgt
    }

  }

  extend(){
    if(this.offset >= this.maxOffset){
      return
    }

    this.offset += this.velocity

    let lftMove = (-1 * this.rgtW / this.totW) * this.velocity
    let rgtMove = (this.lftW / this.totW) * this.velocity

    //these while loops run through all the nodes to the left and right of each
    //connector, and changes their positions.
    this.moveLeftNodes(lftMove)
    this.moveRightNodes(rgtMove)
  }

  retract(){
    if(this.offset < 0){
      return
    }

    this.offset -= this.velocity

    let lftMove = (this.rgtW / this.totW) * this.velocity
    let rgtMove = (-1 * this.lftW / this.totW) * this.velocity

    //these while loops run through all the nodes to the left and right of each
    //connector, and changes their positions.
    this.moveLeftNodes(lftMove)
    this.moveRightNodes(rgtMove)
  }

  draw(){
    ctx.beginPath()

    ctx.lineWidth = this.size
    ctx.strokeStyle = this.col

    ctx.moveTo(this.lft.x, this.lft.y)
    ctx.lineTo(this.rgt.x, this.rgt.y)

    ctx.stroke()

    ctx.beginPath()

    ctx.lineWidth = this.size * 1.2
    ctx.strokeStyle = "#AAAAAA"

    let center = this.parent.n[1]

    ctx.moveTo(
      center.x - 3 * this.size,
      center.y
    )

    ctx.lineTo(
      center.x + 3 * this.size,
      center.y
    )

    ctx.stroke()
  }

  update(){
    if(this.extended) this.extend()
    else this.retract()
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

  nextTurn(){
    this.turn++
    this.turn = this.turn % 4

    let new1 = this.order[this.turn][0]
    let new2 = this.order[this.turn][1]

    this.c[0].extended = new1
    this.c[1].extended = new2
  }

  distanceOffset(){
    let moving
    let still

    let center = this.n[2].x - this.n[0].x
    let o2 = this.n[2].x - this.n[1].x

    this.d += (o1 - o2) * 10 /this.size

    for(let i=0; i<this.n.length; i++){
      this.n[i].x += 100 * (o1 - o2)/this.size
    }
  }

  draw(){
    for(let i=0; i<this.c.length; i++){
      this.c[i].draw()
    }

    for(let i=0; i<this.n.length; i++){
      this.n[i].draw()
    }

  }

  update(){
    if(ctr[" "]){
      for(let i=0; i<this.n.length; i++){
        this.n[i].x += 0.05 * this.size
      }
    }

    // this.distanceOffset()
    for(let i=0; i<this.c.length; i++){
      this.c[i].update()
    }
  }
}


class Cell{
  constructor(x, y, size){
    this.x = x
    this.y = y

    this.size = size*0.5 + Math.random() * size * 0.2

    this.dir = {
      x:0,
      y:0
    }

    this.colliding = false

    this.velocity = 0

    this.col = "#FF0000"
  }

  bounce(obj){
    this.velocity = obj.velocity * 0.8
    this.dir = getDirection(obj, this)

    this.x += this.dir.x * this.velocity
    this.y += this.dir.y * this.velocity
  }

  move(){
    this.x += this.dir.x * this.velocity
    this.y += this.dir.y * this.velocity

    this.velocity*=0.9999

    if(this.velocity <= 0){
      this.velocity = 0
    }

  }

  update(){

    if(this.velocity > 0){
      this.move()
    }

    this.colliding = false
    for(let i=0; i<3; i++){
      if(checkCollision(nano.n[i], this)){
        this.bounce(nano.n[i])
      }
    }


    let cellPick

    for(let i=0; i<clot.cells.length; i++){

      if(clot.cells[i] == this) continue

      if( checkCollision(clot.cells[i], this) ){
        clot.cells[i].bounce(this)
      }
    }
  }

  draw(){
    //draws & fills in a circle at the nodes location

    ctx.beginPath()

    ctx.fillStyle = this.col

    ctx.arc(this.x, this.y, this.size * 1.5, 0, 2 * Math.PI);
    ctx.closePath()

    ctx.fill()

  }
}


class Clot{
  constructor(x, y, size){
    this.x = x
    this.y = y

    this.size = size/2

    this.cells = []

    this.makeClot()
  }

  makeClot(){
    for(let i=0; i<20; i++){
      for(let j=0; j<60; j++){
        this.cells.push(new Cell(
          this.x - (i - 10) * this.size + 6*(Math.random() - 0.5),
          this.y - (j - 30) * this.size + 6*(Math.random() - 0.5),
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
    this.cells.sort(compareDists);

    for(let i=0; i<this.cells.length; i++){
      this.cells[i].update()
    }
  }
}
