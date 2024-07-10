// Código gerado a partir do programa FOFI
const WIDTH = 1000
const HEIGHT = 500
const OBJECTS = []
const SOUNDLIST = []
const CANVAS = { bg: "gray", bgType: "color" }
const MSG = document.getElementById('msg')
// Inicialização de variáveis
var     imagem_1 = 0;
var     imagem_2 = 0;
var     imagem_3 = 0;
var     imagem_4 = 0;
var     tecla = 0;
// Início do código
function setup() {
    createCanvas(WIDTH, HEIGHT);
    background(200);
OBJECTS.forEach((obj) => obj.func(obj));
}
async function draw() { 
background(200);
OBJECTS.forEach((obj) => obj.func(obj));
    tecla = await ler();
    let _TEMP0 = tecla === 1;
    if (_TEMP0) {
        reverter_destaque();
        destacar(imagem_1);
        tocar('acordeon.mp3');
    }
    let _TEMP1 = tecla === 2;
    if (_TEMP1) {
        reverter_destaque();
        destacar(imagem_2);
        tocar('cello.mp3');
    }
    let _TEMP2 = tecla === 3;
    if (_TEMP2) {
        reverter_destaque();
        destacar(imagem_3);
        tocar('violao.mp4');
    }
    let _TEMP3 = tecla === 4;
    if (_TEMP3) {
        reverter_destaque();
        destacar(imagem_4);
        tocar('tambor.mp3');
    }
}
function preload() {
    imagem_1 = criar_imagem("accordion.png", 10, 10);
    imagem_2 = criar_imagem("cello.png", 200, 0);
    imagem_3 = criar_imagem("violao.png", 0, 150);
    imagem_4 = criar_imagem("tambor.png", 370, 250);
    SOUNDLIST.push(loadSound('acordeon.mp3'));
    SOUNDLIST[SOUNDLIST.length - 1].nome = "acordeon.mp3";
    SOUNDLIST.push(loadSound('cello.mp3'));
    SOUNDLIST[SOUNDLIST.length - 1].nome = "cello.mp3";
    SOUNDLIST.push(loadSound('violao.mp4'));
    SOUNDLIST[SOUNDLIST.length - 1].nome = "violao.mp4";
    SOUNDLIST.push(loadSound('tambor.mp3'));
    SOUNDLIST[SOUNDLIST.length - 1].nome = "tambor.mp3";
}

