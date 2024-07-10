// Código gerado a partir do programa FOFI
const WIDTH = 1500
const HEIGHT = 750
const OBJECTS = []
const SOUNDLIST = []
const CANVAS = { bg: "gray", bgType: "color" }
const MSG = document.getElementById('msg')
// Inicialização de variáveis
var     objeto0 = 0;
var     quadrante = 0;
// Início do código
function setup() {
    createCanvas(WIDTH, HEIGHT);
    background(200);
OBJECTS.forEach((obj) => obj.func(obj));
}
function draw() { 
background(200);
drawBg();
OBJECTS.forEach((obj) => obj.func(obj));
    quadrante = consultar();
    let _TEMP0 = quadrante === 1;
    if (_TEMP0) {
        mover(objeto0, -3, 0);
    }
}
function preload() {
objeto0 = criar_imagem("cachorro.webp", 10, 10);
}

