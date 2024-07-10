## Documentação Compilador


Este documento tem como objetivo documentar todos os testes conduzidos nos três componentes analisadores (léxico, sintático e semântico) do compilador.

O compilador está sendo desenvolvido em Python. Ele foi projetado para processar códigos escritos na linguagem FOFI, criada pela nossa turma, traduzindo-os para JavaScript.

## Analisador Léxico

A principal função é ler o código-fonte, que é escrito na linguagem FOFI, e decompor esse texto em uma série de elementos chamados tokens. Esses tokens representam unidades lógicas do código, como identificadores, palavras-chave, símbolos, constantes e operadores.

Antes de identificar todos os tokens do código-fonte, o analisador léxico precisa remover os comentários do código. Dito isso, para testar se a função remover comentários está funcionando, criou-se dois arquivos python, um usando o pytest e outro um arquivo python normal.

### Testes Remover Comentários

Primeiro, é necessário ir até o diretório chamado léxico

```
cd src/compiler/lexico/tests
```
Quando estiver no diretório tests, realize o seguinte comando:

```
pytest testes_analisador_lexico.py
```

Caso não tenha a biblioteca instalada, use o seguinte comando:

```
python -m pip install pytest
```

Já para conseguir rodar o outro arquivo de teste, devemos voltar para o diretório do compiler e rodar o seguinte comando:

```
python -m lexico.tests.testes_comentario
```

Esse arquivo possui diversos testes, por exemplo:

**Código com comentário**

```
"""programa
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
```

**Código depois da função remover comentário**

```
programa
"Descrição do programa (como uma string)
Nesta seção, você poderá escrever um texto de múltiplas linhas,
descrevendo o funcionamento básico do programa e dando instruções ao
usuário da aplicação. Esse texto deverá aparecer em algum lugar na
interface desenvolvida por vocês."






var
numero x, y, z;
texto a, b;
{
x: 0;
y: 5;
a: "ola";
b: “mundo”;
se (a = b e b != a){
mostrar("Ola");
}
senao{
mostrar("nao sei");
}
enquanto (x < y){
x: x + 1;
mostrar(x);
}
repita(10) {



}
}

```

Depois de remover os comentário em linha e comentários em bloco, devemos enviar o código para o analisador léxico, que irá separar e identificar os tokens do código-fonte.

Para testar, devemos estar no diretório do compiler e roda o seguinte script

```
python -m lexico.tests.fofi_teste
```

Com esse script, iremos testar 4 códigos diferentes, em que 2 deles estão corretos e outros 2 apresentam carácteres que não pertencem à linguagem FOFI.

### Exemplo 1:

foi usando o seguinte código de exemplo:

```
programa
var
    numero x;
{
    x : 123;
    x : x + 1;
}
```

Ao usar o analisador léxico, retorna a seguinte lista de tokens:

```
[(PROGRAMA programa 1), 
(VAR var 2), 
(TYPE numero 3), (ID x 3), (SEMICOLON ; 3), 
(LBLOCK { 4), 
(ID x 5), (ASSIGN : 5), (INT 123 5), (SEMICOLON ; 5), 
(ID x 6), (ASSIGN : 6), (ID x 6), (OPSUM + 6), (INT 1 6), (SEMICOLON ; 6), 
(RBLOCK } 7), 
(EOF EOF 7)]
```

Verificando token por token, conseguimos verificar que todos os carácteres foram lidos pelo analisador léxico.

### Exemplo 2:

Nesse exemplo, foi colocado um carácter incorreto de proposito, com o intuito de verificar se o analisador léxico consegue identificar o carácter.

```
programa
var
    numero x;
{
    x : 12.3;
    x : x + 1;
}
```

Resultado:

```
line 5:10 token recognition error at: '.'

[(PROGRAMA programa 1), 
(VAR var 2), 
(TYPE numero 3), (ID x 3), (SEMICOLON ; 3), 
(LBLOCK { 4), 
(ID x 5), (ASSIGN : 5), (INT 12 5), (INT 3 5), (SEMICOLON ; 5), 
(ID x 6), (ASSIGN : 6), (ID x 6), (OPSUM + 6), (INT 1 6), (SEMICOLON ; 6), 
(RBLOCK } 7), (EOF EOF 7)]
```

O analisador léxico conseguiu identificar a existência de um token não permitido, no caso foi o carácter '.' na linha 5.

### Exemplo 3

Nesse exemplo, já foi utilizado um código mais complexo, com comentários em linha e comentários em bloco.

```
programa
"Este programa é mais complexo que o primeiro"
var
    numero a, b, soma;
    binario c, aconteceu;
    texto s;
{
    x : 0;
    y : -2; # ignore este comentário
    soma : x + y;
    /#
    Seu analisador deve ignorar essas linhas, mas ao mesmo tempo
precisa contá-las, mesmo que estejam dentro de um comentário.
    #/
    c : f;
    s : "Programar em FOFI é muito divertido";
    se (soma < x^2 e (y <= -2 ou c = v)){
    aconteceu : nao c;
    mostrar(s);
}
    senao{
        # esta linha deve ser ignorada e contabilizada
        x = consultar();
        repita(5) {
            x : 16;
            enquanto (x != 0){
                mostrar(x);
                x : x / 2;
            }
        }
    }
    y : aleatorio(-10, 2);
}
```

Usando o analisador léxico:

```
[(PROGRAMA programa 1), 
(DQUOTE " 2), (STR Este programa é mais complexo que o primeiro 2), (DQUOTE " 2), 
(VAR var 3), 
(TYPE numero 4), (ID a 4), (COMMA , 4), (ID b 4), (COMMA , 4), (ID soma 4), (SEMICOLON ; 4), 
(TYPE binario 5), (ID c 5), (COMMA , 5), (ID aconteceu 5), (SEMICOLON ; 5), 
(TYPE texto 6), (ID s 6), (SEMICOLON ; 6), 
(LBLOCK { 7), 
(ID x 8), (ASSIGN : 8), (INT 0 8), (SEMICOLON ; 8), 
(ID y 9), (ASSIGN : 9), (OPSUM - 9), (INT 2 9), (SEMICOLON ; 9), 
(ID soma 10), (ASSIGN : 10), (ID x 10), (OPSUM + 10), (ID y 10), (SEMICOLON ; 10), 
(ID c 15), (ASSIGN : 15), (BOOL f 15), (SEMICOLON ; 15), 
(ID s 16), (ASSIGN : 16), (DQUOTE " 16), (STR Programar em FOFI é muito divertido 16), (DQUOTE " 16), (SEMICOLON ; 16), 
(SE se 17), (LPAR ( 17), (ID soma 17), (OPREL < 17), (ID x 17), (OPPOW ^ 17), (INT 2 17), (OPMUL e 17), (LPAR ( 17), (ID y 17), (OPREL <= 17), (OPSUM - 17), (INT 2 17), (OPSUM ou 17), (ID c 17), (OPREL = 17), (BOOL v 17), (RPAR ) 17), (RPAR ) 17), (LBLOCK { 17), 
(ID aconteceu 18), (ASSIGN : 18), (NAO nao 18), (ID c 18), (SEMICOLON ; 18), 
(FUNCOUT mostrar 19), (LPAR ( 19), (ID s 19), (RPAR ) 19), (SEMICOLON ; 19), 
(RBLOCK } 20), 
(SENAO senao 21), (LBLOCK { 21), 
(ID x 23), (OPREL = 23), (FUNCIN consultar 23), (LPAR ( 23), (RPAR ) 23), (SEMICOLON ; 23), 
(REPITA repita 24), (LPAR ( 24), (INT 5 24), (RPAR ) 24), (LBLOCK { 24), (ID x 25), 
(ASSIGN : 25), (INT 16 25), (SEMICOLON ; 25), 
(ENQUANTO enquanto 26), (LPAR ( 26), (ID x 26), (OPREL != 26), (INT 0 26), (RPAR ) 26), (LBLOCK { 26), 
(FUNCOUT mostrar 27), (LPAR ( 27), (ID x 27), (RPAR ) 27), (SEMICOLON ; 27), 
(ID x 28), (ASSIGN : 28), (ID x 28), (OPMUL / 28), (INT 2 28), (SEMICOLON ; 28), 
(RBLOCK } 29), 
(RBLOCK } 30), 
(RBLOCK } 31), 
(ID y 32), (ASSIGN : 32), (FUNCIN aleatorio 32), (LPAR ( 32), (OPSUM - 32), (INT 10 32), (COMMA , 32), (INT 2 32), (RPAR ) 32), (SEMICOLON ; 32), 
(RBLOCK } 33), (EOF EOF 33)]
```

Nesse exemplo, o analisador conseguiu retornar todos os tokens corretamente.

### Exemplo 4:

Nesse ultimo exemplo, foi pego o exemplo 3 como base e adicionado 2 caracteres inesxistente na linguage FOFI:

```
programa
"Este programa é mais complexo que o primeiro"
var
    numero a, b, soma;
    binario c, aconteceu;
    texto s;
{
    x : 0;
    y : -2; # ignore este comentário
    soma : x + y;
    /#
    Seu analisador deve ignorar essas linhas, mas ao mesmo tempo
precisa contá-las, mesmo que estejam dentro de um comentário.
    #/
    c : f;
    s : "Programar em FOFI é muito divertido";
    se (soma < x^2 e (y <= -2 ou c = v)){
        aconteceu : nao c;
        mostrar(s);
    }
    senao{
        # esta linha deve ser ignorada e contabilizada
        x = consultar();
        repita(5) {
            x : 16;
            enquanto (x != 0 && y < 0){
                mostrar(x);
                x : x / 2;
            }
        }
    }
    y : aleatorio(-10, 2);
}
```

Jogando o código no analisador léxico:

```
line 26:29 token recognition error at: '&'
line 26:30 token recognition error at: '&'

[(PROGRAMA programa 1), 
(DQUOTE " 2), (STR Este programa é mais complexo que o primeiro 2), (DQUOTE " 2), 
(VAR var 3), 
(TYPE numero 4), (ID a 4), (COMMA , 4), (ID b 4), (COMMA , 4), (ID soma 4), (SEMICOLON ; 4), 
(TYPE binario 5), (ID c 5), (COMMA , 5), (ID aconteceu 5), (SEMICOLON ; 5), 
(TYPE texto 6), (ID s 6), (SEMICOLON ; 6), 
(LBLOCK { 7), 
(ID x 8), (ASSIGN : 8), (INT 0 8), (SEMICOLON ; 8), 
(ID y 9), (ASSIGN : 9), (OPSUM - 9), (INT 2 9), (SEMICOLON ; 9), 
(ID soma 10), (ASSIGN : 10), (ID x 10), (OPSUM + 10), (ID y 10), (SEMICOLON ; 10), 
(ID c 15), (ASSIGN : 15), (BOOL f 15), (SEMICOLON ; 15), 
(ID s 16), (ASSIGN : 16), (DQUOTE " 16), (STR Programar em FOFI é muito divertido 16), (DQUOTE " 16), (SEMICOLON ; 16), 
(SE se 17), (LPAR ( 17), (ID soma 17), (OPREL < 17), (ID x 17), (OPPOW ^ 17), (INT 2 17), (OPMUL e 17), (LPAR ( 17), (ID y 17), (OPREL <= 17), (OPSUM - 17), (INT 2 17), (OPSUM ou 17), (ID c 17), (OPREL = 17), (BOOL v 17), (RPAR ) 17), (RPAR ) 17), (LBLOCK { 17), 
(ID aconteceu 18), (ASSIGN : 18), (NAO nao 18), (ID c 18), (SEMICOLON ; 18), 
(FUNCOUT mostrar 19), (LPAR ( 19), (ID s 19), (RPAR ) 19), (SEMICOLON ; 19), 
(RBLOCK } 20), 
(SENAO senao 21), (LBLOCK { 21), 
(ID x 23), (OPREL = 23), (FUNCIN consultar 23), (LPAR ( 23), (RPAR ) 23), (SEMICOLON ; 23), 
(REPITA repita 24), (LPAR ( 24), (INT 5 24), (RPAR ) 24), (LBLOCK { 24), 
(ID x 25), (ASSIGN : 25), (INT 16 25), (SEMICOLON ; 25), 
(ENQUANTO enquanto 26), (LPAR ( 26), (ID x 26), (OPREL != 26), (INT 0 26), (ID y 26), (OPREL < 26), (INT 0 26), (RPAR ) 26), (LBLOCK { 26), 
(FUNCOUT mostrar 27), (LPAR ( 27), (ID x 27), (RPAR ) 27), (SEMICOLON ; 27), 
(ID x 28), (ASSIGN : 28), (ID x 28), (OPMUL / 28), (INT 2 28), (SEMICOLON ; 28), 
(RBLOCK } 29), 
(RBLOCK } 30), 
(RBLOCK } 31), 
(ID y 32), (ASSIGN : 32), (FUNCIN aleatorio 32), (LPAR ( 32), (OPSUM - 32), (INT 10 32), (COMMA , 32), (INT 2 32), (RPAR ) 32), (SEMICOLON ; 32), 
(RBLOCK } 33), (EOF EOF 33)]
```

No caso, foi encontrado dois tokens incorretos, sendo eles && na linha 26 do teste.

Com isso, conseguimos concluir que o analisador léxico consegue remover os comentários, preservado as linhas. Além de identificar a ocorrência de tokens incorretos no código.
