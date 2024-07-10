# fofi_teste.py
from antlr4 import FileStream
from lexico.analisador_lexico import remover_comentarios, gera_tokens


def main():
    arquivos = ["./lexico/tests/teste.txt", "./lexico/tests/teste1.txt", "./lexico/tests/teste2.txt", "./lexico/tests/teste3.txt"]
    
    # Processa cada arquivo
    for arquivo in arquivos:
        print(f"Processando {arquivo}:")
        try:
            input_stream = FileStream(arquivo, encoding="utf-8")
            input_stream = str(input_stream)
            codigo = remover_comentarios(input_stream)
            print(gera_tokens(codigo))
        except Exception as e:
            print(f"Erro ao processar o arquivo {arquivo}: {e}")
        print()  

if __name__ == "__main__":
    main()