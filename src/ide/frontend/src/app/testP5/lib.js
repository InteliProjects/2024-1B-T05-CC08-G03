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

/**
Função bloqueante (semelhante ao input() do Python) que exibe um prompt de entrada de dados e retorna um valor do tipo numero. Caso o usuário não informe um número inteiro, continue exibindo novos prompts solicitando um número. O parâmetro msg é do tipo texto, e representa uma mensagem informativa para o usuário.
*/
function ler_numero(msg) {
	let num = Number(prompt(msg));
	while (!Number.isInteger(num)) num = Number(prompt(msg));
	return num;
}

/**
Função bloqueante (semelhante ao input() do Python) que exibe um prompt com confirm para que o usuário confirme ou cancele uma ação, e retorna um valor do tipo binario (v ou f). O parâmetro msg é do tipo texto, e representa uma mensagem informativa para o usuário.
*/
function ler_binario(msg) {
	let response = window.confirm(msg);
	console.log(response);
	return response;
}

/**
Função bloqueante (semelhante ao input() do Python) que aguarda uma entrada do tapete (toque em algum quadrante). Retorna um número inteiro (valor do tipo numero)
*/
function ler() {
	return new Promise((resolve) => {
	  function keyHandler(event) {
		if (event.key in DICIONARIO_DE_KEYS) {
		  console.log(DICIONARIO_DE_KEYS[event.key]);
		  resolve(DICIONARIO_DE_KEYS[event.key]);
		  document.removeEventListener('keydown', keyHandler);
		  document.removeEventListener('mousedown', mouseHandler);
		}
	  }
  
	  function mouseHandler(event) {
		let button;
		switch (event.button) {
		  case 0:
			button = "left";
			break;
		  case 1:
			button = "middle";
			break;
		  case 2:
			button = "right";
			break;
		  default:
			button = "unknown";
		}
  
		if (button in DICIONARIO_DE_KEYS) {
		  resolve(DICIONARIO_DE_KEYS[button]);
		} else {
		  let direction;
		  if (event.clientY < window.innerHeight / 2) {
			direction = "mouse_up";
		  } else {
			direction = "mouse_down";
		  }
  
		  if (event.clientX < window.innerWidth / 2) {
			direction = "mouse_left";
		  } else {
			direction = "mouse_right";
		  }
  
		  resolve(DICIONARIO_DE_KEYS[direction]);
		}
  
		document.removeEventListener('keydown', keyHandler);
		document.removeEventListener('mousedown', mouseHandler);
	  }
  
	  console.log("Esperando...");
	  document.addEventListener('keydown', keyHandler);
	  document.addEventListener('mousedown', mouseHandler);
	});
  }
  

/**
Função não-bloqueante que guarda a última entrada do tapete (toque em algum quadrante). Ao ser chamada, essa função retorna um inteiro entre 0 e 12, onde 0 representa que nenhum quadrante foi pressionado desde a última chamada a consultar(). Caso algum quadrante seja pressionado durante a execução da aplicação, ao chamar consultar() na próxima vez, será retornado um código entre 1 e 12.
*/
function consultar() {
	if (keyIsPressed) {
		return DICIONARIO_DE_KEYS[key];
	}
	document.body.onmousedown = function () {
		return DICIONARIO_DE_KEYS[mouseButton.toString()];
	};
	return 0;
}

/**
Função que recebe 5 parâmetros:
● tipo: texto com o tipo da figura: “circulo” ou “quadrado”. Se for diferente, não faz nada;
● cor: texto com a cor da figura (qualquer definição válida de cor em JS/CSS);
● x: numero com a coordenada inicial x no canvas;
● y: numero com a coordenada inicial y no canvas;
● tamanho: tamanho inicial da figura: se for um círculo, será o seu raio, e se for um quadrado,
será o tamanho do lado;
A função retorna um valor do tipo numero, que representa a referência (identificador único) da figura criada. Este número é um inteiro, que representa o índice desta figura em uma lista JS interna à aplicação, que serve para armazenar as definições das figuras (objetos) criadas. O valor retornado pode ser -1, caso o tipo seja inválido.
*/
function criar_figura(tipo, cor, x, y, tamanho) {
	switch (tipo) {
		case "quadrado":
			OBJECTS.push({
				tipo: tipo,
				cor: cor,
				largura: tamanho,
				altura: tamanho,
				posicao: { x: x, y: y },
				func: drawRect,
				retangular: true,
				opacidade: 255,
			});
			return OBJECTS.length - 1;
		case "circulo":
			OBJECTS.push({
				tipo: tipo,
				cor: cor,
				largura: tamanho,
				altura: tamanho,
				posicao: { x: x, y: y },
				func: drawCircle,
				retangular: false,
				opacidade: 255,
			});
			return OBJECTS.length - 1;
	}
	return -1;
}

/**
Função que recebe 3 parâmetros:
● arq: texto com o nome do arquivo da imagem que deverá ser carregada no canvas;
● x: numero com a coordenada inicial x no canvas;
● y: numero com a coordenada inicial y no canvas;
A função retorna um valor do tipo numero, que representa a referência (identificador único) da imagem criada. Este número é um inteiro, que representa o índice desta figura em uma lista JS interna à aplicação, que serve para armazenar as definições das figuras (objetos) criadas.
*/
function criar_imagem(arq, x, y) {
	img = {
		tipo: "img",
		img: loadImage(arq),
		posicao: { x: x, y: y },
		func: drawImage,
		retangular: true,
		opacidade: 255,
	};

	Object.defineProperty(img, "largura", {
		get: function () {
			return this.img.width;
		},
	});

	Object.defineProperty(img, "altura", {
		get: function () {
			return this.img.height;
		},
	});

	OBJECTS.push(img);
	return OBJECTS.length - 1;
}

/**
Função que recebe 2 parâmetros:
● ref1: numero que representa a referência da primeira figura e/ou imagem (índice desta figura na lista JS interna);
● ref2: numero que representa a referência da segunda figura e/ou imagem (índice desta figura na lista JS interna);
A função retorna um valor do tipo binario, informando se os dois objetos colidiram ou não, com base nas coordenadas x,y atuais de cada um deles.
*/
function colidiu(obj1, obj2) {
	bool = obj1.retangular && obj2.retangular;
	obj1 = OBJECTS[obj1];
	obj2 = OBJECTS[obj2];
	if (bool)
		return collideRectRect(
			obj1.posicao.x,
			obj1.posicao.y,
			obj1.largura,
			obj1.altura,
			obj2.posicao.x,
			obj2.posicao.y,
			obj2.largura,
			obj2.altura,
		);
	circular = [obj1, obj2].find((obj) => obj.retangular === false);
	retangular = [obj1, obj2].find((obj) => obj.retangular === true);
	return collideRectCircle(
		retangular.posicao.x,
		retangular.posicao.y,
		retangular.largura,
		retangular.altura,
		circular.posicao.x,
		circular.posicao.y,
		circular.altura,
	);
}

/**
Função que recebe 2 parâmetros do tipo numero, e retorna um valor do tipo numero aleatório entre min (inclusive) e max (inclusive).
*/
function aleatorio(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
Função que recebe um parâmetro (que pode ser de 3 tipos: numero, binario ou texto), e exibe a sua representação como string na tela.
*/
function mostrar(msg) {
	MSG.innerHTML += `<p>${new Date().toUTCString()} - ${msg}</p>`;
}

/**
Função que limpa (remove todos os objetos) o canvas que representa a tela da aplicação.
*/
function limpar() {
	OBJECTS.length = 0;
	SOUNDLIST.length = 0;
	MSG.innerHTML = "";
}

/**
Função que recebe um parâmetro do tipo texto que representa a cor de fundo do canvas, e modifica o plano de fundo para a cor recebida por parâmetro.
*/
function inicializar_com_cor(cor) {
	CANVAS.bg = cor;
	CANVAS.bgType = "cor";
}

/**
Função que recebe um parâmetro do tipo texto que representa a cor de fundo do canvas, e modifica o plano de fundo para a cor recebida por parâmetro.
*/
function inicializar_com_imagem(ref) {
	CANVAS.bg = loadImage(ref);
	CANVAS.bgType = "img";
}

/**
Função que recebe 6 parâmetros e reaproveita uma referência existente para modificar a figura vinculada a ela:
● ref: referência para a figura (já existente);
● tipo: texto com o tipo da figura: “circulo” ou “quadrado”. Se for diferente, não faz nada;
● cor: texto com a cor da figura (qualquer definição válida de cor em JS/CSS);
● x: numero com a coordenada inicial x no canvas;
● y: numero com a coordenada inicial y no canvas;
● tamanho: tamanho inicial da figura: se for um círculo, será o seu raio, e se for um quadrado, será o tamanho do lado;
Se a referência não existia antes (isto é, se não existia esta posição na lista interna em JS), então não faz nada.
*/
function redefinir_figura(ref, tipo, cor, x, y, tamanho) {
	if (0 <= ref && ref < OBJECTS.length) {
		switch (tipo) {
			case "quadrado":
				OBJECTS[ref] = {
					tipo: tipo,
					cor: cor,
					largura: tamanho,
					altura: tamanho,
					posicao: { x: x, y: y },
					func: drawRect,
					retangular: true,
					opacidade: 255,
				};
				break;
			case "circulo":
				OBJECTS[ref] = {
					tipo: tipo,
					cor: cor,
					largura: tamanho,
					altura: tamanho,
					posicao: { x: x, y: y },
					func: drawCircle,
					retangular: false,
					opacidade: 255,
				};
				break;
		}
	}
}

/**
Função que recebe 4 parâmetros e reaproveita uma referência para modificar a imagem vinculada a ela:
● ref: referência para a figura (já existente);
● arq: texto com o nome do arquivo da imagem que deverá ser carregada no canvas;
● x: numero com a coordenada inicial x no canvas;
● y: numero com a coordenada inicial y no canvas;
Se a referência não existia antes (isto é, se não existia esta posição na lista interna em JS), então não faz nada.
*/
function redefinir_imagem(ref, arq, x, y) {
	if (0 <= ref && ref < OBJECTS.length) {
		img = {
			tipo: "img",
			img: loadImage(arq),
			posicao: { x: x, y: y },
			func: drawImage,
			retangular: true,
			opacidade: 255,
		};

		Object.defineProperty(img, "largura", {
			get: function () {
				return this.img.width;
			},
		});

		Object.defineProperty(img, "altura", {
			get: function () {
				return this.img.height;
			},
		});

		OBJECTS[ref] = img;
	}
}

/**
Função que recebe três parâmetros do tipo numero, representando:
● ref: referência para a figura (já existente);
● dx: o deslocamento no eixo x, que pode ser positivo ou negativo;
● dy: o deslocamento no eixo y, que pode ser positivo ou negativo;
*/
function mover(ref, dx, dy) {
	OBJECTS[ref].posicao.y -= dy;
	OBJECTS[ref].posicao.x += dx;
}

/**
Função que recebe um parâmetro do tipo numero representando a referência de uma figura e/ou imagem e a destaca, isto é, faz com que todos os outros objetos no cenário fiquem translúcidos. O nível de opacidade pode ser definido por cada grupo, de acordo com preferências pessoais e estéticas.
*/
function destacar(obj) {
	reverter_destaque();
	OBJECTS.filter((o) => o !== OBJECTS[obj]).forEach((o) => (o.opacidade = 127));
}

/**
Função que reverte a opacidade de todos os objetos (figuras ou imagens) para os níveis normais
(nenhuma opacidade).
*/
function reverter_destaque() {
	OBJECTS.forEach((o) => (o.opacidade = 255));
}

/**
Função que recebe um parâmetro do tipo texto com o nome do arquivo de áudio e o toca imediatamente.
*/
function tocar(arq) {
	sound = SOUNDLIST.find((obj) => obj.nome === arq);
	if (!sound.isPlaying()) {
		sound.play();
	}
}

/**
Função que recebe 1 parâmetro do tipo numero, representando:
● t: tempo de parar em milissegundos
Bloqueia a execução do programa em t milissegundos.
*/
function esperar(t) {
	let time = millis();
	t += time;
	let sent = false;
	while (millis() < t) {
		if (!sent) {
			console.log("PARO!");
			sent = !sent;
		}
		console.log(t - millis());
	}
}

/**
Função que desenha o background na tela.
*/
function drawBg() {
	if (CANVAS.bg !== undefined) {
		switch (CANVAS.bgType) {
			case "cor":
				fill(CANVAS.bg);
				rect(0, 0, CANVAS.width, CANVAS.height);
				return;
			case "img":
				image(CANVAS.bg, 0, 0);
				CANVAS.bg.resize(WIDTH, HEIGHT);
				return;
		}
	}
}

/**
Função que recebe 1 parâmetro:
● obj: Objeto do quadrado que será desenhado na tela
Desenha quadrados na tela
*/
function drawRect(obj) {
	let rgb = color(obj.cor).maxes.rgb;
	fill(rgb[0], rgb[1], rgb[2], obj.opacidade);
	rect(obj.posicao.x, obj.posicao.y, obj.altura, obj.largura);
}

/**
Função que recebe 1 parâmetro:
● obj: Objeto do círculo que será desenhado na tela
Desenha círculos na tela
*/
function drawCircle(obj) {
	let rgb = color(obj.cor).maxes.rgb;
	fill(rgb[0], rgb[1], rgb[2], obj.opacidade);
	circle(obj.posicao.x, obj.posicao.y, obj.largura);
}

/**
Função que recebe 1 parâmetro:
● obj: Objeto da imagem que será desenhada na tela
Desenha imagens na tela
*/
function drawImage(obj) {
	tint(255, obj.opacidade);
	console.log(obj.img);
	image(obj.img, obj.posicao.x, obj.posicao.y);
}
