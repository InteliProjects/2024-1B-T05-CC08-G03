# import pytest
from lexico.analisador_lexico import analisar_lexicamente
from sintatico.analisador_sintatico import analisar_sintaticamente
from semantico.analisador_semantico import (
    analisar_semanticamente,
    SemanticException,
    nice_print,
)

# @pytest.mark.parametrize(
#     "numero_teste,codigo,resultado",
#     [
#         (
#             1,
#             """programa
#             "Esse programa testa o analisador semantico da linguagem fofi, inicializando variáveis com valores não declarados"
#             var
#                 numero a, b, c;
#                 texto d;
#                 binario g, h, i;
#             {
#                 a: b;
#                 c: a;
#                 g: h e i;
#             }
#             """,
#             "Erro",
#         ),
#         (
#             2,
#             """programa
#             "Esse programa testa o analisador semantico da linguagem fofi, inicializando variáveis com o tipo incorreto"
#             var
#             numero a, b, c;
#             texto d, s;
#             binario g, h, i;
#             {
#                 g: v;
#                 s: g;
#                 }
#             """,
#             "Erro",
#         ),
#         (
#             3,
#             """
#             programa "Dinâmica do jogo"
#             var
#             numero objeto0;
#             numero objeto1;
#             numero objeto2;
#             numero quadrante;

#             {
#             objeto0: criar_imagem("../../uploads/leaozinho.png", 1, 1);
#             objeto1: criar_imagem("../../uploads/cachorro.webp", 1, 1);
#             objeto2: criar_figura("quadrado", "
#             enquanto(v){
#             quadrante: consultar();

#             se (quadrante = 1) {
#             mover(objeto0, 1, -21);
#             tocar("../../uploads/leaozinho.png");
#             }
#             se (quadrante = 3) {
#             mover(objeto1, 1, 2);
#             }
#             }

#             }
#             """,
#             "Passou",
#         ),
#         (
#             4,
#             """programa ""
#             var
#                 numero x;
#             {
#             x : 123;
#             x : x + 1;
#             }""",
#             "Passou",
#         ),
#     ],
# )

def test(numero_teste: int, codigo: str, resultado: str):

    try: 
        analisar_semanticamente(analisar_sintaticamente(analisar_lexicamente(codigo)))
    except Exception as e:
        print(e)

    # resultado_obtido: str
    # passou: bool
    # try:
    #     _ = analisar_semanticamente(
    #         analisar_sintaticamente(analisar_lexicamente(codigo))
    #     )
    #     passou = True
    # except SemanticException as e:
    #     nice_print("=", e)
    #     passou = False
    # resultado_obtido = "Passou" if passou else "Erro"
    # assert resultado_obtido == resultado, f"Erro no teste {numero_teste}"


if __name__ == "__main__":
    test(
        4,
        """programa ""
            var
                numero x;
            {
            x : 123;
            x : x + 1;
            }""",
        "Passou",
    ),
