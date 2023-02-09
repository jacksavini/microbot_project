var mouse = {
  x:0,
  y:0,
  dir:{
    x:0,
    y:0
  }
}
mouse.update = function(event){
  // credit to Rafał S at:
  //https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas?answertab=trending#tab-top
  let rect = canvas.getBoundingClientRect();

  this.dir = normalize(mouse)

  this.x = (event.clientX - (rect.left + borderW/2)) * (canvas.width / (rect.width - borderW))
  this.y = (event.clientY - (rect.top + borderW/2)) * (canvas.height / (rect.height - borderW))
}
window.addEventListener("mousemove", function(){
  mouse.update(event)
});

class Button{
  constructor(x, y, width, height, path, hoverPath, fxnIndex){
    this.x = x
    this.y = y

    this.w = width
    this.h = height

    this.fxnIndex = fxnIndex

    this.img = makeImage(path)
    this.hoverImg = makeImage(hoverPath)

    this.hover = false
  }

  checkHover(){
    if(mouse.x > this.x && mouse.x < this.x + this.w &&
       mouse.y > this.y && mouse.y < this.y + this.h)
    {
      return true
    }
    return false
  }

  click(){
    menu.state = this.fxnIndex
    this.hover = false
  }

  update(){
    this.hover = this.checkHover()
  }

  draw(){
    if(this.hover){
      drawGUI(this.x, this.y, this.w, this.h, this.hoverImg)
      return
    }

    drawGUI(this.x, this.y, this.w, this.h, this.img)

  }
}

class Menu{
  constructor(buttons){
    this.buttons = buttons

    this.state = 0
  }


  draw(){
    for(let b in this.buttons){
      this.buttons[b].draw()
    }
  }

  checkClick(){

    for(let b in this.buttons){

      if(this.buttons[b].hover){
        this.buttons[b].click()
      }
    }
  }


  update(){
    for(let b in this.buttons){
      this.buttons[b].update()
    }
  }

}
