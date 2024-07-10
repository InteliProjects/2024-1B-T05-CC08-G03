let x = 0;
let y = 0;
let squareSize = 50; // Tamanho do quadrado
let speed = 5; // Velocidade de movimento

function setup() {
  createCanvas(800, 600);
}

function draw() {
  background(220);

  // Desenha o quadrado vermelho na posição atual
  fill(255, 0, 0);
  rect(x, y, squareSize, squareSize);

  // Verifica as teclas pressionadas e atualiza a posição do quadrado
  if (keyIsDown(LEFT_ARROW)) {
    x -= speed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    x += speed;
  }
  if (keyIsDown(UP_ARROW)) {
    y -= speed;
  }
  if (keyIsDown(DOWN_ARROW)) {
    y += speed;
  }

  // Limita o movimento do quadrado dentro da tela
  x = constrain(x, 0, width - squareSize);
  y = constrain(y, 0, height - squareSize);
}
