import json

class FofiToken:

    def __init__(self, tipo, valor, linha):
        self.tipo = tipo
        self.valor = valor
        self.linha = linha

    def __repr__(self):
        return f"({self.tipo} {self.valor} {self.linha})"

    def to_dict(self):
        return {
            "tipo": self.tipo,
            "valor": self.valor,
            "linha": self.linha
        }


class FofiTokens(list[FofiToken]):

    def print_json(self) -> None:
        json_list: list = [token.to_dict() for token in self]
        print(json.dumps(json_list, ensure_ascii=False))

class LexicalException(Exception):
	"""
	Define uma classe (vazia) que representa um erro léxico.
	Herda da classe Exception.
	"""
	pass


class SyntaxException(Exception):
	"""
	Define uma classe (vazia) que representa um erro sintático.
	Herda da classe Exception.
	"""
	pass


class NoInterno:
	"""
	Classe que representa um nó interno na árvore sintática.
	Recebe como parâmetros:
		- uma string op (operador). Por padrão, use o nome do método que criou o objeto;
		- **kwargs: um conjunto de parâmetros nomeados que serão armazenados como um dicionário (atributo d);
	"""

	def __init__(self, op, **kwargs):
		self.op = op
		self.d = {}
		for k, v in kwargs.items():
			self.d[k] = v


	def get(self, k):
		return self.d.get(k)


	def __repr__(self):
		listaParametros = []
		# Os parâmetros nomeados aparecerão sempre ordenados para facilitar a comparação.
		# Desta maneira, a ordem em que eles forem definidos não vai importar:
		for k in sorted(self.d.keys()):
			valor = self.d[k]
			if type(valor) == str:
				valor = f'"{valor}"'
			listaParametros.append(f"{k}={valor}")
		parametrosStr = ", ".join(listaParametros)
		if len(parametrosStr) > 0:
			parametrosStr = ", " + parametrosStr
		return f'NoInterno(op="{self.op}"{parametrosStr})'


class NoFolha:
	"""
	Classe que representa um nó folha da árvore sintática.
	Um nó folha pode ser: um TYPE, ID, NUMBER, BOOLEAN.
	"""

	def __init__(self, op, valor, linha):
		self.op = op
		self.valor = valor
		self.linha = linha
	

	def __repr__(self):
		return f'NoFolha(op="{self.op}", valor="{self.valor}", linha={self.linha})'



