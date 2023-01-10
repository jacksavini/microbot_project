timer.seconds = 20

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

    ctx.fillStyle = "#555555"
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 1.772, 4.511)
    ctx.arc(this.x + (3*this.size)/10, this.y, this.size * 1.1, 4.245, 2.037, true)
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
    this.control1()
    // if(controlScheme == 1) this.control2()
    // if(controlScheme == 2) this.control3()

    for(let i=0; i<this.c.length; i++){
      this.c[i].update()
    }

    this.moveNodes()

    this.n[0].update()
    this.n[1].update()
    this.n[2].update()
  }
}
