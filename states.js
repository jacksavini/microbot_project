function gameState(){
  background.drawBottom()

  nano.update()
  nano.draw()

  clot.update()
  clot.draw()

  background.drawTop()

  monitor.update()
  monitor.draw()
  bed.draw()

  game.update()
  game.draw()

  subMenu.update()
  subMenu.draw()

  if(game.timer.win){
    nono.update()
    nono.draw()
  }

  background.drawTippityTop()

}

function pauseGameState(){
  background.drawBottom()

  nano.draw()

  clot.draw()

  background.drawTop()
  background.drawTippityTop()

  monitor.draw()
  bed.draw()

  game.draw()

  ctx.fillStyle = "#000000"
  ctx.globalAlpha = 0.7
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.globalAlpha = 1

  ctx.fillStyle = "#FFFFFF"
  ctx.fillText("Paused", 750, 550);

  pauseMenu.update()
  pauseMenu.draw()
}

function zoomState(){

  zoom+= 0.04;

  if(zoom >= maxZoom){
    menu.state = 2
    zoom = maxZoom
  }

  drawPNG2(img[14], 0, 0, 1920, 1080, 462, 158, 952, 532, zoom)
  monitor.update()

  monitor.draw()
}

function unzoomState(){

  if(zoom >= maxZoom){
    resetGame()
  }

  zoom-= 0.04;

  if(zoom <= 0){
    menu.state = 5
    zoom = 0
  }
  clot.draw()

  drawPNG2(img[14], 0, 0, 1920, 1080, 462, 158, 952, 532, zoom)
  monitor.update()
  monitor.draw()
}

function mainMenuState(){
  background.drawBottom()

  nano.draw()

  clot.draw()

  background.drawTop()
  background.drawScreen()
  background.drawTippityTop()

  monitor.update()
  monitor.draw()

  mainMenu.update()
  mainMenu.draw()
}

function nextBubble(){
  background.drawBottom()

  nano.draw()

  clot.update()
  clot.draw()

  background.drawTop()
  background.drawScreen()
  background.drawTippityTop()

  monitor.update()
  monitor.drawPole()
  monitor.draw()
  bed.draw()

  docMenu.update()
  docMenu.draw()

  bubble.nextLine()
  bubble.draw()

  menu.state = 5
}

function doctorState(){
  background.drawBottom()

  nano.draw()

  clot.update()
  clot.draw()

  background.drawTop()
  background.drawScreen()

  background.drawTippityTop()

  monitor.update()

  monitor.drawPole()
  bed.draw()
  monitor.draw()

  docMenu.update()
  docMenu.draw()

  bubble.draw()



}

function creditsState(){
  background.drawBottom()

  nano.draw()

  clot.update()
  clot.draw()

  background.drawTop()
  background.drawScreen()
  background.drawTippityTop()

  monitor.drawPole()
  bed.draw()
  monitor.draw()

  docMenu.draw()

  bubble.draw()

  drawGUI(150, 0, canvas.width - 300, canvas.height, img[8])

  creditMenu.update()
  creditMenu.draw()

}

function controlsState(){
  drawGUI(0, 0, canvas.width, canvas.height, img[7])

  subMenu.update()
  subMenu.draw()
}

function startMenuState(){
  ctx.fillStyle = "#FFFFFF"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(img[11], 100, 0, canvas.width, canvas.height)
  ctx.drawImage(img[15], 600, 630, 800, 450)

  startMenu.update()
  startMenu.draw()

  drawGUI(600, 260, 800, 340, img[21])
}

function resetGameState(){
  resetGame()
  background.drawBottom()

  nano.update()
  nano.draw()

  clot.update()
  clot.draw()

  background.drawTop()

  monitor.update()
  monitor.draw()
  bed.draw()

  game.update()
  game.draw()

  subMenu.update()
  subMenu.draw()

  background.drawTippityTop()

  menu.state = 2

}

const states = [
    mainMenuState,
    zoomState,
    gameState,
    unzoomState,
    creditsState,
    doctorState,
    startMenuState,
    nextBubble,
    pauseGameState,
    resetGameState
]
