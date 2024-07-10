const TOCANDO = { audio: undefined };
var objeto0 = 0;
var objeto1 = 0;
var objeto2 = 0;
var objeto3 = 0;
var quadrante = 0;
// Início do código
const WIDTH = 1800;
const HEIGHT = 800;
const OBJECTS = [];
const SOUNDLIST = [];

function setup() {
	createCanvas(WIDTH, HEIGHT);
}
function draw() {
	background(200);
	OBJECTS.forEach((obj) => obj.func(obj));
	quadrante = consultar();
	let _TEMP0 = quadrante === 1;
	if (_TEMP0) {
		tocar("do.m4a", TOCANDO);
	}
	let _TEMP3 = quadrante === 2;
	if (_TEMP3) {
        tocar("re.m4a", TOCANDO);
	}
	let _TEMP1 = quadrante === 3;
	if (_TEMP1) {
        tocar("mi.ogg", TOCANDO);
	}
	let _TEMP4 = quadrante === 4;
	if (_TEMP4) {
        tocar("fa.m4a", TOCANDO);
	}
}

function preload() {
	SOUNDLIST.push(loadSound("do.m4a"));
	SOUNDLIST[SOUNDLIST.length - 1].nome = "do.m4a";
	SOUNDLIST.push(loadSound("re.m4a"));
	SOUNDLIST[SOUNDLIST.length - 1].nome = "re.m4a";
	SOUNDLIST.push(loadSound("mi.ogg"));
	SOUNDLIST[SOUNDLIST.length - 1].nome = "mi.ogg";
	SOUNDLIST.push(loadSound("fa.m4a"));
	SOUNDLIST[SOUNDLIST.length - 1].nome = "fa.m4a";
}
