from lexico.analisador_lexico import remover_comentarios
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))


def teste_comentarios_linha():
    """
    Testa a função para remover comentários em linha.
    """
    TEXTO_COM_COMENTARIO_INLINE_1 = "Este é um texto. # Este é um comentário."
    print("Teste 1:\n")
    print(remover_comentarios(TEXTO_COM_COMENTARIO_INLINE_1))
    print("---" * 20)

    TEXTO_COM_COMENTARIO_INLINE_2 = """Este é um texto.
    # Este é um comentário.
    Aqui há mais texto. # Outro comentário."""
    print("Teste  2:\n")
    print(remover_comentarios(TEXTO_COM_COMENTARIO_INLINE_2))
    print("---" * 20)


def teste_comentarios_bloco():
    """
    Testa a função para remover comentários em bloco.
    """
    TEXTO_COM_COMENTARIO_BLOCK_1 = """Este é o grupo Guiados pelo Axé.
/# Este é um comentário em bloco.
Que pode ter várias linhas #/
Composto por Arthur, Marcelo, Fábio, Godoy e Guilherme.
/# Isso também é um comentário em bloco
comentário em bloco #/
Axe Axe Axe."""

    print("Teste 1:\n")
    print(remover_comentarios(TEXTO_COM_COMENTARIO_BLOCK_1))
    print("---" * 20)

    TEXTO_COM_COMENTARIO_BLOCK_2 = """Este é um texto.
/# Este é um comentário em bloco.
/# Este é um comentário aninhado. #/
Que pode ter várias linhas #/
Aqui há mais texto."""
    print("Teste 2:\n")
    print(remover_comentarios(TEXTO_COM_COMENTARIO_BLOCK_2))
    print("---" * 20)

    TEXTO_COM_COMENTARIO_BLOCK_3 = """/# Este é um comentário em bloco.
Que pode ter várias linhas #/"""
    print("Teste 3:\n")
    print(remover_comentarios(TEXTO_COM_COMENTARIO_BLOCK_3))
    print("---" * 20)

    TEXTO_MUSICA_AXE = """programa
"Descrição do programa (como uma string)
Nesta seção, você poderá escrever um texto de múltiplas linhas,
descrevendo o funcionamento básico do programa e dando instruções ao
usuário da aplicação. Esse texto deverá aparecer em algum lugar na
interface desenvolvida por vocês."

/# Este é um
comentário de
múltiplas linhas #/
# Comentário de uma única linha
# Abaixo fica a seção de declaração de variáveis
var
numero x, y, z; # ou seja, x, y e z são do tipo numero (inteiro)
texto a, b;
{
x: 0;
y: 5;
a: "ola";
b: “mundo”;
se (a = b e b != a){
mostrar("Ola");
}
senao{ # o bloco senao é opcional
mostrar("nao sei");
}
enquanto (x < y){
x: x + 1;
mostrar(x);
}
repita(10) {
/# o que estiver aqui dentro será repetido 10 vezes.
Note que não há variável de controle dentro deste bloco
#/
}
}
"""
    print("Teste 4:\n")
    print(remover_comentarios(TEXTO_MUSICA_AXE))
    print("---" * 20)


def run_testes():
    print("Testando comentario em linha:\n")
    teste_comentarios_linha()
    print("\nTestando comentarios em bloco:\n")
    teste_comentarios_bloco()


if __name__ == "__main__":
    run_testes()
