class Scene{
  constructor(){
    this.x = 0
    this.y = 0

    this.w = canvas.width
    this.h = canvas.height

    this.col = "DDDDDD"
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

    this.parent = parent

    this.lft = null
    this.rgt = null

    this.col = "#0000FF"
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
  constructor(size, parent){
    this.size = size

    this.parent = parent

    this.maxOffset = 2 * size

    this.centerNode = parent.n[1]

    //executions per period
    this.velocity = this.maxOffset / period

    this.offset = 0

    this.extended = 0

    this.col = "#FF0000"
  }

  moveLeftNodes(offset){

    let lft = this

    while(lft != null){

      lft = lft.lft
      lft.x += offset
      lft = lft.lft
    }

  }

  moveRightNodes(offset){
    let rgt = this

    while(rgt != null){

      rgt = rgt.rgt
      rgt.x += offset
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
    ctx.strokeStyle = "#440000"

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

    this.distOffset = 0

    this.offsetAll = 0

    this.size = size

    this.n = []
    this.c = []

    this.createStructure()

    this.turn = 0
    this.order = [
      [0, 0], [1, 0], [1, 1], [0, 1]
    ]

    this.link1 = this.c[0]
    this.link2 = this.c[1]
  }

  createStructure(){
    this.n.push( new Node(this.x - this.size * 4, this.y, this.size, this) )
    this.n.push( new Node(this.x, this.y, this.size) )
    this.n.push( new Node(this.x + this.size * 4, this.y, this.size, this) )

    this.c.push( new Connector(this.size, this) )
    this.c.push( new Connector(this.size, this) )

    for(let i=0; i<2; i++){
      this.c[i].lft = this.n[i]
      this.c[i].rgt = this.n[i+1]

      this.n[i+1].lft = this.c[i]
      this.n[i].rgt = this.c[i]

      this.c[i].lftW = i+1
      this.c[i].rgtW = this.c.length - i
      this.c[i].totW = this.c[i].lftW + this.c[i].rgtW
      this.c[i].center = this.n[1]
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

  getDistOffset(){
    let lft = this.n[1].x - this.n[0].x
    let rgt = this.n[2].x - this.n[1].x

    return (lft - rgt) / this.size

  }

  centerNodeOffset(){
    let leftWgt = this.n[1].x - this.n[0].x
    let rightWgt = this.n[2].x - this.n[1].x

    return (leftWgt - rightWgt)/this.size
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
    this.distOffset = this.getDistOffset()

    for(let i=0; i<this.c.length; i++){
      this.c[i].update()
    }

    for(let i=0; i<this.n.length; i++){
      //this.n[i].x += this.centerNodeOffset()

    }

  }
}
