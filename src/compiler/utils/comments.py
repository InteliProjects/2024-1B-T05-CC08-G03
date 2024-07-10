import re


def handle_comentario_inline(string: str) -> str:
    """
    Remove comentários em linha de uma string.

    Parâmetros:
    string (str): A string que pode conter comentários em linha.

    Retorna:
    str: A string sem os comentários em linha.
    """
    pattern: str = r"#.*$"

    return re.sub(pattern, "", string, flags=re.MULTILINE)


def handle_comentario_Block(string: str) -> str:
    """
    Remove comentários em bloco de uma string, mantendo a estrutura original do código.

    Parâmetros:
    string (str): A string que pode conter comentários em bloco.

    Retorna:
    str: A string sem os comentários em bloco, mantendo as quebras de linha necessárias.
    """

    # Função auxiliar para substituir cada bloco de comentário por quebras de linha
    def substituir_linhas(match):
        # Conta quantas quebras de linha existem no bloco de comentário
        num_linhas = match.group(0).count("\n")
        # Retorna o mesmo número de quebras de linha para manter o layout
        return "\n" * num_linhas

    # Padrão que encontra os blocos de comentários entre /# e #/
    pattern = r"/#.*?#/\n*"

    # Substitui os blocos de comentários por linhas vazias
    return re.sub(pattern, substituir_linhas, string, flags=re.DOTALL)
