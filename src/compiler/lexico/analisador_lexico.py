import sys
import os
from lexico.grammar.fofi import fofi
from lexico.grammar.Lexer import Lexer
from antlr4 import InputStream, Token
from utils.classes import FofiToken, FofiTokens
from utils.comments import handle_comentario_inline, handle_comentario_Block

sys.path.append(os.path.join(os.path.dirname(__file__), "../.."))


def remover_comentarios(string: str) -> str:
    """
    Remove todos os comentários, seja em linha ou em bloco, de uma string.

    Parâmetros:
    string (str): A string que contém os comentários a serem removidos.

    Retorna:
    (str): A string sem os comentários.
    """
    string = handle_comentario_Block(string)
    string = handle_comentario_inline(string)
    return string


def gera_tokens(codigo: str) -> FofiTokens:
    """
    Gera os tokens a partir do codigo fonte

    Parâmetros:
    codigo (str): Codigo fonte

    Retorna:
    (FofiTokens): Lista de tokens léxicos
    """
    input_stream: InputStream = InputStream(codigo)
    lexer: Lexer = fofi(input_stream)
    lista_tokens: FofiTokens = FofiTokens()
    token: Token = lexer.nextToken()
    while token.type != Token.EOF:
        if lexer.symbolicNames[token.type] == "STR":
            texto = token.text[1:-1]
            lista_tokens.append(FofiToken("DQUOTE", '"', token.line))
            conta_linhas = texto.count("\n")
            lista_tokens.append(
                FofiToken(lexer.symbolicNames[token.type], texto, token.line)
            )
            lista_tokens.append(FofiToken("DQUOTE", '"', token.line + conta_linhas))
        else:
            lista_tokens.append(
                FofiToken(lexer.symbolicNames[token.type], token.text, token.line)
            )
        token = lexer.nextToken()

    lista_tokens.append(FofiToken("EOF", "EOF", token.line))
    return lista_tokens


def analisar_lexicamente(codigo: str) -> FofiTokens:
    """
        Roda analisador léxico em um código fonte

    Parâmetros:
    codigo (str): Codigo fonte

    Retorna:
    (FofiTokens): Lista de tokens léxicos
    """
    return gera_tokens(remover_comentarios(codigo.lower()))
