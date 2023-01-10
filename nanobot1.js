function linspace(x1, x2, n){
  let fin = []
  for (let i=0; i<n; i++){
    fin.push(x1 + (x2 - x1)*(i/(n-1)))
  }

  return fin
}

function mult(m1, m2){
  let fin = []

  for(let i=0; i<m1.length; i++){
    fin.push([])
    for(let j=0; j<m2[0].length; j++){
      fin[i].push(0)
      for(let k=0; k<m2.length; k++){
        fin[i][j] += m1[i][k] * m2[k][j]
      }
    }
  }

  return fin
}

function sum(m1){
  let fin = 0

  for(let i=0; i<m1.length; i++){
    if( !Array.isArray(m1[i]) ){
      fin += m1[i]
      continue
    }

    else{
      for(let j=0; j<m1[i].length; j++){
        fin += m1[i][j]
      }
    }
  }

  return fin
}

function getNanoVelocities(l1Now, l1Next, l2Now, l2Next){
  var mu=1;
  var d=10;
  var a=1;
  var eps=4*a;
  var w=1;

  var dl1
  var dl2

  var l1
  var l2

  var nt=20;
  var t=linspace(0,eps/w,nt);

  // var m=zeros(3,3);
  // var dl=zeros(3,1);
  // var v1=zeros(1,nt);
  // var x=zeros(3,1);

  var m=[
    [0,0,0],
    [0,0,0],
    [0,0,0]
  ]
  var dl=[
    [0],
    [0],
    [0]
  ]
  var v1=[];
  for(let i=0; i<nt; i++){v1.push(0)}
  var x=[
    [0],
    [0],
    [0]
  ]

  // L1Now=1;
  // L1Next=0;
  // L2Now=1;
  // L2Next=0;

  // for i=1:nt
  //
  //     if l1Now == 0 && l1Next==0;
  //         l1 = d-eps;
  //         dl1 = 0;
  //     elseif l1Now == 0 && l1Next==1;
  //         l1 = d-eps+w*t(i);
  //         dl1=W;
  //     elseif l1Now == 1 && l1Next==0;
  //         l1 = d-w*t(i);
  //         dl1= -w;
  //     elseif l1Now == 1 && l1Next==1;
  //         l1 = d;
  //         dl1=0;
  //     end
  //
  //
  //     if l2Now == 0 && l2Next==0;
  //         l2 = d-eps;
  //         dl2 = 0;
  //     elseif l2Now == 0 && l2Next==1;
  //         l2 = d-eps+w*t(i);
  //         dl2=w;
  //     elseif l2Now == 1 && l2Next==0;
  //         l2 = d-w*t(i);
  //         dl2= -w;
  //     elseif l2Now == 1 && l2Next==1;
  //         l2 = d;
  //         dl2=0;
  //     end

  for(let i=0; i<nt; i++){

    if (l1Now == 0 && l1Next==0){
      l1 = d-eps;
      dl1 = 0;
    }

    else if (l1Now == 0 && l1Next==1){
      l1 = d-eps+w*t[i];
      dl1=w;
    }

    else if (l1Now == 1 && l1Next==0){
      l1 = d-w*t[i];
      dl1= -w;
    }

    else if (l1Now == 1 && l1Next==1){
      l1 = d;
      dl1=0;
    }



    if(l2Now == 0 && l2Next==0){
      l2 = d-eps;
      dl2 = 0;
    }

    else if (l2Now == 0 && l2Next==1){
      l2 = d-eps+w*t[i];
      dl2=w;
    }

    else if (l2Now == 1 && l2Next==0){
      l2 = d-w*t[i];
      dl2= -w;
    }

    else if (l2Now == 1 && l2Next==1){
      l2 = d;
      dl2=0;
    }


    //     L1 = D-eps-W*t(i);
    //     L2 = D-eps;
    //     dl1 = -W;
    //     dl2 = 0;

    let pi = Math.PI

    m[0][0]=1/6/pi/mu/a;
    m[0][1]=1/4/pi/mu/l1;
    m[0][2]=1/4/pi/mu/(l1+l2);
    m[1][0]=m[0][1];
    m[1][1]=m[0][0];
    m[1][2]=1/4/pi/mu/l2;
    m[2][0]=m[0][2];
    m[2][1]=m[1][2];
    m[2][2]=m[0][0];

    let im=math.inv(m);

    dl[0][0]=0;
    dl[1][0]=dl1;
    dl[2][0]=dl1+dl2;

    v1[i]= -sum(mult(im,dl))/sum(mult( im, [[1], [1], [1]] ));
  }


  v2=[]
  v3=[]

  for(let i=0; i<v1.length; i++){
    v2.push(v1[i] + dl1)
    v3.push(v1[i] + dl1 + dl2)
  }

  return [v1, v2, v3]


  // x[0][0]=trapz(t,v1);
  // x[1][0]=trapz(t,v2);
  // x[2][0]=trapz(t,v3);
}

//A Node is a singular circular section of the nanobot.
class Node{
  constructor(x, y, size){
    this.x = x
    this.y = y

    this.size = size

    this.velocity = 5

    this.oldX = 0

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
  constructor(size, key){
    this.size = size

    this.maxOffset = 4 * size

    //executions per period
    this.velocity = this.maxOffset / period

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
}


class Nanobot{
  constructor(x, y, size){
    this.x = x
    this.y = y

    this.active = false
    this.move = "0000"

    this.moveFrame = 0
    this.waitFrame = 0
    this.movements = {}

    for(let i1=0; i1<2; i1++){
      for(let i2=0; i2<2; i2++){
        for(let i3=0; i3<2; i3++){
          for(let i4=0; i4<2; i4++){
            let str = i1.toString() + i2.toString() +
                      i3.toString() + i4.toString()

            this.movements[str] = getNanoVelocities(i1, i2, i3, i4)

          }
        }
      }
    }

    this.d = 0

    this.size = size

    this.n = []
    this.c = []

    this.createStructure()

    this.turn = 0
    this.order = [
      [0, 0], [1, 0], [1, 1], [0, 1]
    ]

    this.v = [

    ]
  }

  createStructure(){
    this.n.push( new Node(this.x - this.size * 4, this.y, this.size) )
    this.n.push( new Node(this.x, this.y, this.size) )
    this.n.push( new Node(this.x + this.size * 4, this.y, this.size) )

    this.c.push( new Connector(this.size, "1") )
    this.c.push( new Connector(this.size, "2") )

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

  updateMove(){
    let oldMove = this.move

    let i0 = this.move[1]
    let i2 = this.move[3]

    let i1
    let i3

    if(ctr["1"]){
      i1 = "1"
    }

    else if(ctr["2"]){
      i1 = "0"
    }

    else i1 = this.move[1]

    if(ctr["9"]){
      i3 = "1"
    }

    else if(ctr["0"]){
      i3 = "0"
    }

    else i3 = this.move[3]

    if(i1 == this.move[1] && i3 == this.move[3]){
      this.active=false
      return
    }

    this.move = i0 + i1 + i2 + i3
  }

  moveNodes(){
    if(this.active && this.waitFrame == 0){
      let mv = this.movements[this.move]

      this.n[0].x += this.size * mv[0][this.moveFrame]/5
      this.n[1].x += this.size * mv[1][this.moveFrame]/5
      this.n[2].x += this.size * mv[2][this.moveFrame]/5

      this.n[0].update()
      this.n[1].update()
      this.n[2].update()
    }

    if(ctr["Y"]){
      this.n[0].x += 4
      this.n[1].x += 4
      this.n[2].x += 4
    }
  }

  checkWait(){
    if(this.active){
      if(this.waitFrame > 0){
        this.waitFrame --
        if(this.waitFrame == 0){
          this.updateMove()
        }
      }
    }

    else{
      if(ctr["1"] || ctr["2"] || ctr["9"] || ctr["0"]){
        this.waitFrame = 4
        this.active = true
      }
    }
  }

  updateFrames(){
    this.checkWait()

    if(this.active && this.waitFrame == 0){
      this.moveFrame ++
    }

    if(this.moveFrame == 20){
      this.active = false
      this.moveFrame = 0
      return
    }
  }

  update(){
    this.updateFrames()
    this.moveNodes()
    this.draw()
  }
}
