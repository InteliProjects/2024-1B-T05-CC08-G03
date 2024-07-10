const DICIONARIO_DE_KEYS = {
	ArrowUp: 1,
	ArrowDown: 2,
	ArrowLeft: 3,
	ArrowRight: 4,
	" ": 5,
	Enter: 6,
	left: 7,
	right: 8,
	mouse_up: 9,
	mouse_down: 10,
	mouse_left: 11,
	mouse_right: 12,
};

function mover(i, x, y) {
	OBJECTS[i].posicao.y -= y;
	OBJECTS[i].posicao.x += x;
}

function consultar() {
	if (keyIsPressed) {
		return DICIONARIO_DE_KEYS[key];
	}
	document.body.onmousedown = function () {
		return DICIONARIO_DE_KEYS[mouseButton.toString()];
	};
}

function criar_figura(tipo, cor, x, y, tamanho) {
	switch (tipo) {
		case "quadrado":
			OBJECTS.push({
				tipo: tipo,
				cor: cor,
				tamanho: tamanho,
				posicao: { x: x, y: y },
				func: drawRect,
			});
			break;
		case "circulo":
			OBJECTS.push({
				tipo: tipo,
				cor: cor,
				tamanho: tamanho,
				posicao: { x: x, y: y },
				func: drawCircle,
			});
			break;
	}
	return OBJECTS.length - 1;
}

function criar_imagem(arq, x, y) {
	OBJECTS.push({
		img: loadImage(arq),
		posicao: { x: x, y: y },
		func: drawImage,
	});
	return OBJECTS.length - 1;
}

function tocar(arq) {
	sound = SOUNDLIST.find((obj) => obj.nome === arq);
    console.log(sound)
	if (!sound.isPlaying()) {
		sound.play();
	}
}

function drawRect(obj) {
	fill(obj.cor);
	rect(obj.posicao.x, obj.posicao.y, obj.tamanho, obj.tamanho);
}
function drawCircle(obj) {
	fill(obj.cor);
	circle(obj.posicao.x, obj.posicao.y, obj.tamanho);
}

function drawImage(obj) {
	image(obj.img, obj.posicao.x, obj.posicao.y);
}
