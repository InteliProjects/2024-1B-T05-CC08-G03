# README

## Visão Geral do Projeto

Este projeto é um framework de compilação que inclui análise léxica, análise sintática, análise semântica e geração de código. Ele lê o código de entrada, processa-o através de várias etapas de compilação e produz os resultados. O projeto está dividido em quatro módulos principais:

1. Análise Léxica
2. Análise Sintática
3. Análise Semântica
4. Geração de Código

## Requisitos

- Python 3.8 ou superior

## Estrutura do Projeto

- `lexico/`: Contém o analisador léxico.
- `sintatico/`: Contém o analisador sintático.
- `semantico/`: Contém o analisador semântico.
- `gerador/`: Contém o gerador de código.
- `utils/`: Contém classes utilitárias.

## Como Executar

### Passo a Passo


1. **Instale as dependências:**

    Certifique-se de ter o Python 3.8 ou superior instalado. Recomenda-se o uso de um ambiente virtual.

    ```bash
    python -m venv venv
    source venv/bin/activate  # No Windows, use `venv\Scripts\activate`
    pip install -r requirements.txt
    ```

2. **Execute o script principal:**

    ```bash
    python compilador.py <modo> [<caminho_do_arquivo>]
    ```

    Onde `<modo>` pode ser:
    - `lexico`: Para executar a análise léxica.
    - `sintatico`: Para executar a análise sintática.
    - `semantico`: Para executar a análise semântica.
    - `gerador`: Para executar a geração de código.
    - `file`: Para processar um arquivo de código.

    ### Observações:
    
    - **Modo `file`**: Este modo aceita um caminho de arquivo como argumento. O arquivo deve conter o código a ser processado. Exemplo:
      
      ```bash
      python compilador.py file <caminho_do_arquivo>
      ```

    - **Outros Modos (`lexico`, `sintatico`, `semantico`, `gerador`)**: Nesses modos, você deve colar o código desejado diretamente no terminal. Após colar o código, adicione `.EOF` em uma nova linha para indicar o fim da entrada e pressione Enter. Exemplo:
      
      ```bash
      python compilador.py lexico
      ```
      
      Em seguida, cole seu código, adicione `.EOF` e pressione Enter.


### Exemplos de Uso

Para executar os exemplos que já estão na pasta de exemplos, você pode usar o comando:

```bash
python3 compilador.py file example/exemplo6.1.axe
```
```js
    // Código gerado a partir do programa FOFI
    const WIDTH = 1000
    const HEIGHT = 500
    const OBJECTS = []
    const SOUNDLIST = []
    const CANVAS = { bg: "gray", bgType: "color" }
    const MSG = document.getElementById('msg')
    // Inicialização de variáveis
    var     x = false;
    var     y = 0;
    var     z = 0;
    // Início do código
    function setup() {
        createCanvas(WIDTH, HEIGHT);
        background(200);
        let _TEMPVAR1 = 5 - 3;
        let _TEMPVAR2 = 4 * 2;
        let _TEMPVAR3 = _TEMPVAR1 + _TEMPVAR2;
        y = _TEMPVAR3
        let _TEMPVAR4 = 2 + y;
        let _TEMPVAR5 = 9 % 5;
        let _TEMPVAR6 = _TEMPVAR4 / _TEMPVAR5;
        z = _TEMPVAR6
        let _TEMPVAR7 = z ** 2;
        let _TEMPVAR8 = y ** _TEMPVAR7;
        let _TEMP9 = _TEMPVAR8 >= 1000
        let _TEMP10 = y === 10;
        let _TEMPVAR11 = _TEMP9 && _TEMP10;
        x = _TEMPVAR11
        mostrar(x);
        OBJECTS.forEach((obj) => obj.func(obj));
    }
    function preload() {
    }
```


Este é um dos casos de uso fornecidos pelo professor para teste na última sprint.

