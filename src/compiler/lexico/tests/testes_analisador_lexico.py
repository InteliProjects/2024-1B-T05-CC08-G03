import pytest as ptest

from lexico.analisador_lexico import remover_comentarios  # pylint: disable=import-error


@ptest.mark.parametrize(
    "numero_teste,string,resultado",
    [
        (1, "#Este é um comentário.", ""),
        (2, "Este é um texto. # Este é um comentário.", "Este é um texto. "),
        (3, "Este é um texto.\n# Este é um comentário.", "Este é um texto.\n"),
        (4, "#Este não é um texto.\nEste é um texto.", "\nEste é um texto."),
        (
            5,
            "Este é um texto.\n#Este é um comentário.\nEste é um texto",
            "Este é um texto.\n\nEste é um texto",
        ),
    ],
)
def test_comentario_em_linha(numero_teste: int, string: str, resultado: str) -> None:
    """
    Testa a função remover_comentarios para comentários em linha.

    Parâmetros:
    numero_teste (int): Número do teste.
    string (str): Texto de entrada com comentários em linha.
    resultado (str): Resultado esperado após remover os comentários.
    """
    resultado_obtido: str = remover_comentarios(string)
    assert resultado_obtido == resultado, f"Erro no teste {numero_teste}"


@ptest.mark.parametrize(
    "numero_teste,string,resultado",
    [
        (
            6,
            """/# Este é um comentário em bloco.
     Que pode ter várias linhas #/""",
            "\n",
        ),
        (
            7,
            """Este é um texto.
/# Este é um comentário em bloco.
Que pode ter várias linhas #/
Aqui há mais texto.""",
            "Este é um texto.\n\n\nAqui há mais texto.",
        ),
        (
            8,
            """Este é um texto sobre o Grupo Guiados pelo Axé.
/# Este é um comentário em bloco.
Que pode ter várias linhas #/
Aqui há mais um texto sobre os Guiados Pelo Axé.""",
            "Este é um texto sobre o Grupo Guiados pelo Axé.\n\n\nAqui há mais um texto sobre os Guiados Pelo Axé.",
        ),
        (
            9,
            """Este é o grupo Guiados pelo Axé.
/# Este é um comentário em bloco.
Que pode ter várias linhas #/
Composto por Arthur, Marcelo, Fábio, Godoy e Guilherme.
/# Isso também é um comentário em 
Teste
comentário em bloco #/
Axe Axe Axe.""",
            "Este é o grupo Guiados pelo Axé.\n\n\nComposto por Arthur, Marcelo, Fábio, Godoy e Guilherme.\n\n\n\nAxe Axe Axe.",
        ),
    ],
)
def test_comentario_em_bloco(numero_teste: int, string: str, resultado: str):
    """
    Testa a função remover_comentarios para comentários em bloco.

    Parâmetros:
    numero_teste (int): Número do teste.
    string (str): Texto de entrada com comentários em bloco.
    resultado (str): Resultado esperado após remover os comentários.
    """
    resultado_obtido: str = remover_comentarios(string)
    assert resultado_obtido == resultado, f"Erro no teste {numero_teste}"
