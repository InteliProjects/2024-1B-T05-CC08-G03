# import pytest
from lexico.analisador_lexico import analisar_lexicamente
from sintatico.analisador_sintatico import analisar_sintaticamente
from semantico.analisador_semantico import (
    analisar_semanticamente,
    SemanticException,
    nice_print,
)


def test(numero_teste: int, codigo: str, resultado: str):

    try: 
        analisar_semanticamente(analisar_sintaticamente(analisar_lexicamente(codigo)))
    except Exception as e:
        print(e)

if __name__ == "__main__":
    test(
        4,
        """programa "garota"
        var
        numero x;
        {
        x: "eu sou o godoy";
        }""",
        "Passou",
    ),