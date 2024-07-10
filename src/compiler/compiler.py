import sys
from lexico.analisador_lexico import analisar_lexicamente
from sintatico.analisador_sintatico import analisar_sintaticamente
from semantico.analisador_semantico import analisar_semanticamente
from gerador.gerador_codigo import gerar_codigo
from utils.classes import NoInterno

if __name__ == "__main__":
    if len(sys.argv) > 1:
        code: str = ""
        if sys.argv[1] != "file":
            while True:
                line: str = input()
                if line == ".EOF":
                    break
                code += line + "\n"
        match sys.argv[1]:
            case "lexico":
                try:
                    result: str = analisar_lexicamente(code).get_json()
                    print(0)
                    print(result)
                except Exception as e:
                    print(1)
                    print(e)
            case "sintatico":
                try:
                    result: str = analisar_sintaticamente(
                        analisar_lexicamente(code)
                    ).toString()
                    print(0)
                    print(result)
                except Exception as e:
                    print(1)
                    print(e)
            case "semantico":
                try:
                    analisar_semanticamente(
                        analisar_sintaticamente(analisar_lexicamente(code))
                    )
                    print(0)
                except Exception as e:
                    print(1)
                    print(e)
            case "gerador":
                try:
                    ast: NoInterno = analisar_sintaticamente(analisar_lexicamente(code))
                    # ast: NoInterno = analisar_semanticamente(
                    #     analisar_sintaticamente(analisar_lexicamente(code))
                    # )
                    result: str = gerar_codigo(ast)
                    print(0)
                    print(result)
                except Exception as e:
                    print(1)
                    print(e)
            case "file":
                file = open(sys.argv[2], "r")
                code = file.read()
                file.close()
                try:
                    ast: NoInterno = analisar_sintaticamente(analisar_lexicamente(code))
                    # ast: NoInterno = analisar_semanticamente(
                    #     analisar_sintaticamente(analisar_lexicamente(code))
                    # )
                    result: str = gerar_codigo(ast)
                    print(0)
                    print(result)
                except Exception as e:
                    print(1)
                    print(e)
            case _:
                print(1)
                print(
                    "Invalid arguments provided. Run with: 'lexico', 'sintatico', 'semantico' or 'gerador'"
                )
    else:
        print(1)
        print(
            "No arguments provided. Run with: 'lexico', 'sintatico', 'semantico' or 'gerador'"
        )
