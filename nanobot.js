//A Node is a singular circular section of the nanobot.
class Node{
  constructor(x, y, size, parent, head){
    this.x = x
    this.y = y

    this.head = head

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

    if(this.head){
      if(this.parent.nono){
        drawGame(
          this.x - this.size - 10,
          this.y - this.size - 40,
          this.size * 3,
          this.size * 3,
          img[23]
        )
      }
      else{
        drawGame(
          this.x - this.size,
          this.y - this.size,
          this.size * 2,
          this.size * 2,
          img[13]
        )
      }
    }

    else{
      drawGame(
        this.x - this.size,
        this.y - this.size,
        this.size * 2,
        this.size * 2,
        img[4]
      )
    }
  }

  update(){
    this.velocity = Math.abs(this.x - this.oldX, 0)
    this.oldX = this.x
  }
}

//A Connector is a link between the nodes.
class Connector{
  constructor(size, parent){
    this.size = size

    this.parent = parent

    this.maxOffset = size * 2

    //executions per period
    this.velocity = this.maxOffset / (fps/4)

    this.offset = 0

    this.extend = false
    this.retract = false

    this.col = "#CCCCCC"
  }

  draw(){

    let newStuff1 = getZoom(this.lft.x, this.lft.y,
      this.lft.size, this.lft.size)

    let newStuff2 = getZoom(this.rgt.x, this.rgt.y,
      this.rgt.size, this.rgt.size)

    let unit = this.lft.size

    if(this.rgt.rgt == null){
      drawGame(
        this.rgt.x - unit * 6,
        this.lft.y - this.lft.size/4,
        unit*6,
        this.lft.size/2,
        img[5]
      )
    }

    else{
      drawGame(
        this.lft.x,
        this.lft.y - this.lft.size/4,
        unit*6,
        this.lft.size/2,
        img[5]
      )
    }


  }

  update(){
    if(this.extend || this.retract){
      this.offset += (this.velocity * (this.extend - this.retract))
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
    this.x = centerX * 0.4
    this.y = centerY * 0.85

    this.size = size

    this.bias = 0.6

    this.n = []
    this.c = []

    this.nono = false

    this.createStructure()
  }

  createStructure(){
    this.n.push( new Node(this.x - this.size * 4, this.y, this.size, this, false) )
    this.n.push( new Node(this.x, this.y, this.size, false) )
    this.n.push( new Node(this.x + this.size * 4, this.y, this.size, this, true) )

    this.c.push( new Connector(this.size, this) )
    this.c.push( new Connector(this.size, this) )

    for(let i=0; i<2; i++){
      this.c[i].lft = this.n[i]
      this.c[i].rgt = this.n[i+1]

      this.n[i+1].lft = this.c[i]
      this.n[i].rgt = this.c[i]

      this.c[i].center = this.n[1]
    }
  }

  moveNodes(){

    // t1 & t2 are the connectors' offsets

    let t1 = this.c[0].offset / this.c[0].maxOffset
    let t2 = this.c[1].offset / this.c[1].maxOffset

    // calculating the movement of the middle node
    this.n[1].x += this.c[0].extend * this.c[0].velocity/3 * (1 + (1 - t2) * this.bias)
    this.n[1].x -= this.c[0].retract * this.c[0].velocity/3 * (1 + (1 - t2) * this.bias)

    this.n[1].x -= this.c[1].extend * this.c[0].velocity/3 * (1 + (1 - t1) * this.bias)
    this.n[1].x += this.c[1].retract * this.c[0].velocity/3 * (1 + (1 - t1) * this.bias)

    // moving the other nodes in relation to the middle one
    this.n[0].x = (this.n[1].x - 4 * this.size - this.c[0].offset)
    this.n[2].x = (this.n[1].x + 4 * this.size + this.c[1].offset)

  }

  control(){
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

  draw(){
    for(let i=0; i<this.c.length; i++){
      this.c[i].draw()
    }

    drawGame(
      this.n[1].x - this.size*3,
      this.n[1].y - this.size * 0.4,
      this.size * 6,
      this.size * 0.8,
      img[6]
    )

    for(let i=0; i<this.n.length; i++){
      this.n[i].draw()
    }
  }

  update(){
    this.control()

    for(let i=0; i<this.c.length; i++){
      this.c[i].update()
    }

    this.moveNodes()

    this.n[0].update()
    this.n[1].update()
    this.n[2].update()
  }
}


class Nonobot{
  constructor(x, y, size){

    this.x = x
    this.y = y

    this.bias = 1

    this.size = size
    this.n = []
    this.c = []

    this.states = [[1, 0], [1, 1], [0, 1], [0, 0]]

    this.state = 0
    this.startTime = 2
    this.timer = this.startTime

    this.stop = false

    this.nono = true

    this.createStructure()
  }

  createStructure(){
    this.n.push( new Node(this.x - this.size * 4, this.y, this.size, this, false) )
    this.n.push( new Node(this.x, this.y, this.size, false) )
    this.n.push( new Node(this.x + this.size * 4, this.y, this.size, this, true) )

    this.c.push( new Connector(this.size, this) )
    this.c.push( new Connector(this.size, this) )

    this.c[0].velocity*=2
    this.c[1].velocity*=2

    for(let i=0; i<2; i++){
      this.c[i].lft = this.n[i]
      this.c[i].rgt = this.n[i+1]

      this.n[i+1].lft = this.c[i]
      this.n[i].rgt = this.c[i]

      this.c[i].center = this.n[1]
    }
  }

  moveNodes(){

    // t1 & t2 are the connectors' offsets

    let t1 = this.c[0].offset / this.c[0].maxOffset
    let t2 = this.c[1].offset / this.c[1].maxOffset

    // calculating the movement of the middle node
    this.n[1].x += this.c[0].extend * this.c[0].velocity/3 * (1 + (1 - t2) * this.bias)
    this.n[1].x -= this.c[0].retract * this.c[0].velocity/3 * (1 + (1 - t2) * this.bias)

    this.n[1].x -= this.c[1].extend * this.c[0].velocity/3 * (1 + (1 - t1) * this.bias)
    this.n[1].x += this.c[1].retract * this.c[0].velocity/3 * (1 + (1 - t1) * this.bias)

    // moving the other nodes in relation to the middle one
    this.n[0].x = (this.n[1].x - 4 * this.size - this.c[0].offset)
    this.n[2].x = (this.n[1].x + 4 * this.size + this.c[1].offset)

  }

  control(){
    if(this.stop){
      this.c[0].extend = true
      this.c[1].extend = true
      return
    }

    if(this.states[this.state][0]){
      this.c[0].extend = true
      this.c[0].retract = false
    }

    else{
      this.c[0].extend = false
      this.c[0].retract = true
    }

    if(this.states[this.state][1]){
      this.c[1].extend = true
      this.c[1].retract = false
    }

    else{
      this.c[1].extend = false
      this.c[1].retract = true
    }
  }

  draw(){


    for(let i=0; i<this.c.length; i++){
      this.c[i].draw()
    }

    drawGame(
      this.n[0].x,
      this.n[0].y,
      this.n[2].x - this.n[0].x,
      220,
      img[22]
    )

    drawGame(
      this.n[1].x - this.size*3,
      this.n[1].y - this.size * 0.4,
      this.size * 6,
      this.size * 0.8,
      img[6]
    )

    for(let i=0; i<this.n.length; i++){
      this.n[i].draw()
    }
  }

  update(){

    if(!this.stop && this.n[1].x >= canvas.width/2){
      this.stop = true
    }

    this.startTime = 6

    if(this.timer < 0){
      this.timer = this.startTime
      this.state = (this.state + 1)%4
    }

    this.timer -= 1

    this.control()

    for(let i=0; i<this.c.length; i++){
      this.c[i].update()
    }

    this.moveNodes()

    this.n[0].update()
    this.n[1].update()
    this.n[2].update()
  }
}
