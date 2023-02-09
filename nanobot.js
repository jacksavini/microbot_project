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

    drawPNG(
      this.x - this.size,
      this.y - this.size,
      this.size * 2,
      this.size * 2,
      img[4]
    )
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

    this.maxOffset = size * 2

    //executions per period
    this.velocity = this.maxOffset / (fps/4)

    this.offset = 0

    this.extend = false
    this.retract = false

    this.col = "#CCCCCC"
  }

  draw(){
    ctx.beginPath()

    let newStuff1 = getZoom(this.lft.x, this.lft.y,
      this.lft.size, this.lft.size)

    let newStuff2 = getZoom(this.rgt.x, this.rgt.y,
      this.rgt.size, this.rgt.size)

    ctx.lineWidth = newStuff1[2]
    ctx.strokeStyle = this.col

    ctx.moveTo(newStuff1[0], newStuff1[1])
    ctx.lineTo(newStuff2[0], newStuff2[1])

    ctx.stroke()

    let unit = this.lft.size

    if(this.rgt.rgt == null){
      drawPNG(
        this.rgt.x - unit * 6,
        this.lft.y - this.lft.size/2,
        unit*6,
        this.lft.size,
        img[5]
      )
    }

    else{
      drawPNG(
        this.lft.x,
        this.lft.y - this.lft.size/2,
        unit*6,
        this.lft.size,
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
    this.x = x
    this.y = y

    this.size = size

    this.bias = 0.5

    this.n = []
    this.c = []

    this.createStructure()
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

      this.c[i].center = this.n[1]
    }
  }

  moveNodes(){

    let t1 = this.c[0].offset / this.c[0].maxOffset
    let t2 = this.c[1].offset / this.c[1].maxOffset

    this.n[1].x += this.c[0].extend * this.c[0].velocity/3 * (1 + (1 - t2) * this.bias)
    this.n[1].x -= this.c[0].retract * this.c[0].velocity/3 * (1 + (1 - t2) * this.bias)

    this.n[1].x -= this.c[1].extend * this.c[0].velocity/3 * (1 + (1 - t1) * this.bias)
    this.n[1].x += this.c[1].retract * this.c[0].velocity/3 * (1 + (1 - t1) * this.bias)

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

    drawPNG(
      this.n[1].x - this.size*3,
      this.n[1].y - this.size * 0.6,
      this.size * 6,
      this.size * 1.2,
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
