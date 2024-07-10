# -*- coding: utf-8 -*-

from utils.classes import NoInterno, NoFolha, SyntaxException, FofiTokens, FofiToken

class AnalisadorSintatico:

    def __init__(self, lista_tokens):
        """
        Inicializa os atributos da classe.
        """
        self.tokens = (
            lista_tokens  # atributo tokens: contém a lista de objetos do tipo Token;
        )
        self.token_corrente = None  # atributo token_corrente: contém o objeto Token que representa o token corrente;
        self.posicao = (
            -1
        )  # atributo posicao: inteiro que guarda o índice do token corrente (um dos tokens da lista de tokens)
        self.proximo_token()

    def proximo_token(self):
        """
        Avança o próximo token da lista de tokens.
        O token corrente ficará disponível no atributo token_corrente.

        """
        if (
            self.posicao <= len(self.tokens) - 2
        ):  # Garante que vai estar sempre em uma faixa válida, caso contrário sempre retorna o último token (EOF)
            self.posicao += 1
            self.token_corrente = self.tokens[self.posicao]

    def lancar_erro(self, tipoEsperado=None):
        """
        Método que lança uma exceção do tipo SyntaxException.
        Ele será chamado pelo método comparar() quando o token esperado for diferente do token corrente.

        OBS: Não modifique as mensagens de erro!
        """
        if tipoEsperado:
            raise SyntaxException(
                f'Token inesperado: "{self.token_corrente.tipo}" ({self.token_corrente.valor}), tipo esperado: "{tipoEsperado}", na linha {self.token_corrente.linha}'
            )
        else:
            raise SyntaxException(
                f'Token inesperado: "{self.token_corrente.tipo}" ({self.token_corrente.valor}) na linha {self.token_corrente.linha}'
            )

    def comparar(self, tipoEsperado):
        """
        Compara o token_corrente com o tipo esperado (tipoEsperado) do token. Caso sejam diferentes, lança uma exceção do tipo SyntaxException.

        """
        # print(
        #     f"  comparar: {self.token_corrente.tipo} {self.token_corrente.valor} {tipoEsperado}"
        # )  # remova o comentário se desejar visualizar as chamadas deste método. Pode ajudar na depuração
        tokenRetorno = self.token_corrente
        if self.token_corrente.tipo == tipoEsperado.upper():
            self.proximo_token()
        else:
            self.lancar_erro(tipoEsperado)
        return tokenRetorno

    def analisar(self):
        """
        Método que será chamado para inicializar a análise sintática.
        Chama o método program().

        Ao implementar a árvore sintática, deve retornar o resultado do método program().
        """
        result = self.program()
        self.comparar("EOF")
        return result

    def program(self):
        """
        Método que analisa a variável <program> da linguagem.

        Ao implementar a árvore sintática, deve retornar um NoInterno com os seguintes parâmetros nomeados: id (um NoFolha com op igual a "id"), declarations, block.
        O valor do atributo op deve ser "program".
        """
        self.comparar("PROGRAMA")
        no_str = str_statement = self.str_statement()
        self.comparar("VAR")
        var_declaration_list = self.var_declaration_list()
        block = self.block()

        return NoInterno(
            "alg",
            str_statement=str_statement,
            block=block,
            declarations=var_declaration_list,
            id=NoFolha("id", no_str.valor, no_str.linha),
        )

    def var_declaration_list(self):
        """
        Método que analisa a variável <var_declaration_list> da linguagem.

        Ao implementar a árvore sintática, deve retornar um NoInterno com os seguintes parâmetros nomeados: var_declaration, prox.
        O valor do atributo op deve ser "var_declaration_list".

        Dica: este método pode fazer uma chamada recursiva para si mesmo. Pense em como usar isso para ligar os nós da árvore sintática!
        """
        if self.token_corrente.tipo == "TYPE":
            var_declaration = self.var_declaration()
            var_declaration_list = self.var_declaration_list()
            return NoInterno(
                "varDeclarationList",
                varDeclaration=var_declaration,
                prox=var_declaration_list,
            )
        elif self.token_corrente.tipo == "LBLOCK":
            return None
        else:
            self.comparar("TYPE")

    def var_declaration(self):
        """
        Método que analisa a variável <var_declaration> da linguagem.

        Ao implementar a árvore sintática, deve retornar um NoInterno com os seguintes parâmetros nomeados: type (um NoFolha com op igual a "type"), identifier_list.
        O valor do atributo op deve ser "var_declaration".
        """
        no_type = self.comparar("TYPE")
        no_identifier_list = self.identifier_list()
        self.comparar("SEMICOLON")
        return NoInterno(
            "varDeclaration",
            type=NoFolha("type", no_type.valor, no_type.linha),
            identifierList=no_identifier_list,
        )

    def identifier_list(self):
        """
        Método que analisa a variável <identifier_list> da linguagem.

        Ao implementar a árvore sintática, deve retornar um NoInterno com os seguintes parâmetros nomeados: id (um NoFolha com op igual a "id"), prox.
        O valor do atributo op deve ser "identifier_list".

        Dica: este método pode fazer uma chamada recursiva para si mesmo. Pense em como usar isso para ligar os nós da árvore sintática!
        """
        no_id = self.comparar("ID")
        if self.token_corrente.tipo == "COMMA":
            self.comparar("COMMA")
            prox = self.identifier_list()
            return NoInterno(
                "identifierList", id=NoFolha("id", no_id.valor, no_id.linha), prox=prox
            )
        else:
            return NoInterno(
                "identifierList", id=NoFolha("id", no_id.valor, no_id.linha), prox=None
            )

    def block(self):
        """
        Método que analisa a variável <block> da linguagem.

        Ao implementar a árvore sintática, deve retornar um NoInterno com o seguinte parâmetro nomeado: statement_list.
        O valor do atributo op deve ser "block".
        """
        self.comparar("LBLOCK")
        no_statement_list = self.statement_list()
        self.comparar("RBLOCK")

        return NoInterno("block", statementList=no_statement_list)

    def statement_list(self):
        """
        Método que analisa a variável <statement_list> da linguagem.

        Ao implementar a árvore sintática, deve retornar um NoInterno com os seguintes parâmetros nomeados: statement, prox.
        O valor do atributo op deve ser "statement_list".

        Dica: este método pode fazer uma chamada recursiva para si mesmo. Pense em como usar isso para ligar os nós da árvore sintática!
        """
        if (
            self.token_corrente.tipo == "ID"
            or self.token_corrente.tipo == "SE"
            or self.token_corrente.tipo == "ENQUANTO"
            or self.token_corrente.tipo == "REPITA"
            or self.token_corrente.tipo == "FUNCIN"
            or self.token_corrente.tipo == "FUNCOUT"
        ):
            no_statement = self.statement()
            prox = self.statement_list()
            return NoInterno("statementList", statement=no_statement, prox=prox)
        else:
            return None

    def statement(self):
        """
        Método que analisa a variável <statement> da linguagem.
        Compara se o token corrente é OUT, IF ou ID, e chama o método específico de cada caso.

        Esse método não cria nenhum nó na árvore sintática, mas deve retornar o objeto obtido ao chamar os métodos:
            out_statement(), if_statement() ou assign_statement().
        """
        if self.token_corrente.tipo == "ID":
            return self.assign_statement()
        elif self.token_corrente.tipo == "SE":
            return self.if_statement()
        elif self.token_corrente.tipo == "ENQUANTO":
            return self.while_statement()
        elif self.token_corrente.tipo == "REPITA":
            return self.repeat_statement()
        else:
            return self.command_statement()

    def assign_statement(self):
        """
        Método que analisa a variável <assign_statement> da linguagem.

        Ao implementar a árvore sintática, deve retornar um NoInterno com os seguintes parâmetros nomeados, a depender do tipo de atribuição:
            - se o token corrente for IN: id (um NoFolha com op igual a "id", contendo a variável que está recebendo o valor da atribuição), input_statement;
            - caso contrário: id (um NoFolha com op igual a "id", contendo a variável que está recebendo o valor da atribuição), expression;
        O valor do atributo op deste NoInterno deve ser "assign_statement".
        """
        no_id = self.comparar("ID")
        self.comparar("ASSIGN")
        if self.token_corrente.tipo == "FUNCIN":
            input_statement = self.input_statement()
            self.comparar("SEMICOLON")
            return NoInterno(
                "assignStatement",
                id=NoFolha("id", no_id.valor, no_id.linha),
                inStatement=input_statement,
            )
        elif self.token_corrente.tipo == "DQUOTE":
            str_statement = self.str_statement()
            self.comparar("SEMICOLON")
            return NoInterno(
                "assignStatement",
                id=NoFolha("id", no_id.valor, no_id.linha),
                str_statement=str_statement,
            )
        else:
            no_expression = self.expression()
            self.comparar("SEMICOLON")
            return NoInterno(
                "assignStatement",
                id=NoFolha("id", no_id.valor, no_id.linha),
                expression=no_expression,
            )

    def input_statement(self):
        """
        Método que analisa a variável <input_statement> da linguagem.

        Ao implementar a árvore sintática, deve retornar um NoFolha com op igual a "in" e o valor igual a "in".
        """
        funcToken = None
        paramList = []
        if (
            self.token_corrente.valor == "ler_numero"
            or self.token_corrente.valor == "ler_binario"
        ):
            funcToken = self.comparar("FUNCIN")
            self.comparar("LPAR")
            paramList.append(self.str_statement())
            self.comparar("RPAR")
        elif (
            self.token_corrente.valor == "ler"
            or self.token_corrente.valor == "consultar"
        ):
            funcToken = self.comparar("FUNCIN")
            self.comparar("LPAR")
            self.comparar("RPAR")
        elif self.token_corrente.valor == "criar_figura":
            funcToken = self.comparar("FUNCIN")
            self.comparar("LPAR")
            paramList.append(self.str_statement())
            self.comparar("COMMA")
            paramList.append(self.str_statement())
            self.comparar("COMMA")
            paramList.append(self.sum_expression())
            self.comparar("COMMA")
            paramList.append(self.sum_expression())
            self.comparar("COMMA")
            paramList.append(self.sum_expression())
            self.comparar("RPAR")
        elif self.token_corrente.valor == "criar_imagem":
            funcToken = self.comparar("FUNCIN")
            self.comparar("LPAR")
            paramList.append(self.str_statement())
            self.comparar("COMMA")
            paramList.append(self.sum_expression())
            self.comparar("COMMA")
            paramList.append(self.sum_expression())
            self.comparar("RPAR")
        else:
            funcToken = self.comparar("FUNCIN")
            self.comparar("LPAR")
            paramList.append(self.sum_expression())
            self.comparar("COMMA")
            paramList.append(self.sum_expression())
            self.comparar("RPAR")
        return NoInterno(
            op=funcToken.tipo,
            valor=funcToken.valor,
            linha=funcToken.linha,
            params=paramList,
        )

    def if_statement(self):
        """
        Método que analisa a variável <if_statement> da linguagem.

        Ao implementar a árvore sintática, deve retornar um NoInterno com os seguintes parâmetros nomeados: expression, blockIf, blockElse.
        O valor do atributo op deve ser "if_statement".
        """
        block_else = None
        self.comparar("SE")
        self.comparar("LPAR")
        no_expression = self.expression()
        self.comparar("RPAR")
        block_if = self.block()
        if self.token_corrente.tipo == "SENAO":
            self.comparar("SENAO")
            block_else = self.block()
        return NoInterno(
            "ifStatement",
            expression=no_expression,
            blockIf=block_if,
            blockElse=block_else,
        )

    def while_statement(self):
        self.comparar("ENQUANTO")
        self.comparar("LPAR")
        no_expression = self.expression()
        self.comparar("RPAR")
        block = self.block()
        return NoInterno("WhileStatement", expression=no_expression, block=block)

    def repeat_statement(self):
        self.comparar("REPITA")
        self.comparar("LPAR")
        no_expression = self.sum_expression()
        self.comparar("RPAR")
        block = self.block()
        return NoInterno("repeatStatement", expression=no_expression, block=block)

    def command_statement(self):
        funcToken = None
        paramList = []
        if self.token_corrente.valor == "mostrar":
            funcToken = self.comparar("FUNCOUT")
            self.comparar("LPAR")
            if self.token_corrente.tipo == "DQUOTE":
                paramList.append(self.str_statement())
            else:
                paramList.append(self.sum_expression())
            self.comparar("RPAR")
        elif (
            self.token_corrente.valor == "limpar"
            or self.token_corrente.valor == "reverter_destaque"
        ):
            funcToken = self.comparar("FUNCOUT")
            self.comparar("LPAR")
            self.comparar("RPAR")
        elif (
            self.token_corrente.valor == "inicializar_com_cor"
            or self.token_corrente.valor == "inicializar_com_imagem"
            or self.token_corrente.valor == "tocar"
        ):
            funcToken = self.comparar("FUNCOUT")
            self.comparar("LPAR")
            paramList.append(self.str_statement())
            self.comparar("RPAR")
        elif self.token_corrente.valor == "redefinir_figura":
            funcToken = self.comparar("FUNCOUT")
            self.comparar("LPAR")
            paramList.append(self.sum_expression())
            self.comparar("COMMA")
            paramList.append(self.str_statement())
            self.comparar("COMMA")
            paramList.append(self.str_statement())
            self.comparar("COMMA")
            paramList.append(self.sum_expression())
            self.comparar("COMMA")
            paramList.append(self.sum_expression())
            self.comparar("COMMA")
            paramList.append(self.sum_expression())
            self.comparar("RPAR")
        elif self.token_corrente.valor == "redefinir_imagem":
            funcToken = self.comparar("FUNCOUT")
            self.comparar("LPAR")
            paramList.append(self.sum_expression())
            self.comparar("COMMA")
            paramList.append(self.str_statement())
            self.comparar("COMMA")
            paramList.append(self.sum_expression())
            self.comparar("COMMA")
            paramList.append(self.sum_expression())
            self.comparar("RPAR")
        elif self.token_corrente.valor == "mover":
            funcToken = self.comparar("FUNCOUT")
            self.comparar("LPAR")
            paramList.append(self.sum_expression())
            self.comparar("COMMA")
            paramList.append(self.sum_expression())
            self.comparar("COMMA")
            paramList.append(self.sum_expression())
            self.comparar("RPAR")
        # DESTACAR & ESPERAR
        else:
            funcToken = self.comparar("FUNCOUT")
            self.comparar("LPAR")
            paramList.append(self.sum_expression())
            self.comparar("RPAR")
        self.comparar("SEMICOLON")
        return NoInterno(
            op=funcToken.tipo,
            valor=funcToken.valor,
            linha=funcToken.linha,
            params=paramList,
        )

    def str_statement(self):
        self.comparar("DQUOTE")
        str_token = self.comparar("STR")
        self.comparar("DQUOTE")
        return NoFolha("str", str_token.valor, str_token.linha)

    def expression(self):
        """
        Método que analisa a variável <expression> da linguagem.

        Ao implementar a árvore sintática, deve retornar um NoInterno com os seguintes parâmetros nomeados:
            - oper: uma string contendo o operador relacional utilizado: ==, <>, < <=, >, >=, |. Se não tiver operador relacional, deve ter valor igual a None.
            - esq: recebe o resultado da sum_expression esquerda;
            - dir: caso exista um operador relacional, recebe o resultado da sumExpressioin direita;
        O valor do atributo op deve ser "expression".

        Dica: a partir deste ponto, todos os nós do tipo NoInterno terão os atributos nomeados esq e dir, ou seja, podemos considerar que a partir daqui
        teremos uma árvore binária!
        """
        esq = self.sum_expression()
        oper = None
        direita = None
        if self.token_corrente.tipo == "OPREL":
            oper = self.token_corrente.valor
            self.comparar("OPREL")
            direita = self.sum_expression()
        return NoInterno("expression", oper=oper, esq=esq, dir=direita)

    def sum_expression(self):
        """
        Método que analisa a variável <sum_expression> da linguagem.
        Deve chamar o método multiplicative_term(), e em seguida sum_expression2().

        Ao implementar a árvore sintática, deve guardar o objeto retornado pelo método multiplicative_term(), e em seguida
        passar este objeto como parâmetro para sum_expression2(). Ao final, retorne o valor (objeto) retornado por sum_expression2().
        """
        mult_term = self.multiplicative_term()
        sum_exp2 = self.sum_expression2(mult_term)
        return sum_exp2

    def sum_expression2(self, esq=None):
        """
        Método que analisa a variável <sum_expression2> da linguagem.
        Se o token corrente for um OPSUM, deve:
            1- processar (comparar) o OPSUM;
            2- chamar o método multiplicative_term();
            3- chamar o método sum_expression2(), ou seja, faz uma chamada recursiva;

        Ao implementar a árvore sintática, considere as seguintes alterações:
            Se o token corrente for um OPSUM, deve:
                1- processar (comparar) o token OPSUM;
        2- chamar o método multiplicative_term();
        3- Criar um NoInterno com op igual a "sum_expression", e os seguintes parâmetros nomeados:
            - oper: uma string representando o lexema associado ao OPSUM: +, -;
            - esq: recebe o valor do parâmetro esq;
            - dir: recebe o objeto retornado quando chamamos o método multiplicative_term() no passo 2;
        4- retorna o resultado de sum_expression2() (chamada recursiva), passando o NoInterno criado no passo 3 como parâmetro;

        Se o token corrente não for um OPSUM, retorna o parâmetro esq.
        """
        if self.token_corrente.tipo == "OPSUM":
            valor = self.token_corrente.valor
            self.comparar("OPSUM")
            no_mult_term = self.multiplicative_term()
            no_sum_exp_internno = NoInterno(
                "sum_expression", oper=valor, esq=esq, dir=no_mult_term
            )
            return self.sum_expression2(no_sum_exp_internno)
        else:
            return esq

    def multiplicative_term(self):
        """
        Método que analisa a variável <multiplicative_term> da linguagem.
        Deve chamar o método power_term(), e em seguida multiplicative_term2().

        Ao implementar a árvore sintática, deve guardar o objeto retornado pelo método power_term(), e em seguida
        passar este objeto como parâmetro para multiplicative_term2(). Ao final, retorne o valor retornado por multiplicativeTerm2().
        """
        power_term = self.power_term()
        no_mult_term2 = self.multiplicative_term2(power_term)
        return no_mult_term2

    def multiplicative_term2(self, esq=None):
        """
        Método que analisa a variável <multiplicative_term2> da linguagem.
        Se o token corrente for um OPMUL, deve:
            1- processar (comparar) o OPMUL;
            2- chamar o método power_term();
            3- chamar o método multiplicative_term2(), ou seja, faz uma chamada recursiva;

        Ao implementar a árvore sintática, considere as seguintes alterações:
            Se o token corrente for um OPMUL, deve:
                1- processar (comparar) o token OPMUL;
        2- chamar o método power_term();
        3- Criar um NoInterno com op igual a "multiplicative_term", e os seguintes parâmetros nomeados:
            - oper: uma string representando o lexema associado ao OPMUL: ., :, %, #;
            - esq: recebe o valor do parâmetro esq;
            - dir: recebe o objeto retornado quando chamamos o método power_term() no passo 2;
        4- retorna o resultado de multiplicative_term2() (chamada recursiva), passando o NoInterno criado no passo 3 como parâmetro;

        Se o token corrente não for um OPMUL, retorna o parâmetro esq.
        """
        if self.token_corrente.tipo == "OPMUL":
            valor = self.token_corrente.valor
            self.comparar("OPMUL")
            power_term = self.power_term()
            no_interno = NoInterno(
                "multiplicative_term", oper=valor, esq=esq, dir=power_term
            )
            return self.multiplicative_term2(no_interno)
        else:
            return esq

    def power_term(self):
        """
        Método que analisa a variável <power_term> da linguagem. Deve:
            1- chamar o método factor();
            Se o token corrente for OPPOW, faz os 2 próximos passos:
                2- processar (comparar) o OPPOW;
            3- chamar o método power_term(), ou seja, faz uma chamada recursiva;

        Ao implementar a árvore sintática, considere as seguintes alterações:
            1- guarde o objeto retornada pelo método factor();
        Se o token corrente NÃO é um OPPOW, retorne o objeto obtida acima;
        Caso contrário (se o token corrente é um OPPOW), faça os próximos passos:
            2- processe (comparar) o token OPMUL;
        3- chame o método power_term() e guarde o objeto retornado;
        4- Criar um NoInterno com op igual a "power_term", e os seguintes parâmetros nomeados:
            - oper: uma string representando o lexema associado ao OPPOW: ^;
            - esq: recebe o objeto retornado quando chamamos factor() no passo 1;
            - dir: recebe o objeto retornado quando chamamos o método power_term() no passo 3;
        5- retorna o NoInterno criado no passo 4;

        Dica: Note que este método é diferente de sum_expression2 e multiplicative_term2: isso acontece porque queremos que a operação de
        exponenciação tenha associatividade à direita, enquanto que soma e multiplicação possuem associatividade à esquerda!
        """
        factor = self.factor()
        if self.token_corrente.tipo == "OPPOW":
            self.comparar("OPPOW")
            power_term = self.power_term()
            no_interno = NoInterno("power_term", oper="^", esq=factor, dir=power_term)
            return no_interno
        else:
            return factor

    def factor(self):
        """
        Método que analisa a variável <factor> da linguagem. Deve:
            1- testar se o token corrente é um OPSUM. Se sim, processe-o (comparar);
        2- testar se o token corrente é um ID, ou um NUMBER, ou um BOOLEAN. Se for, processe o respectivo token;
        3- caso os testes do passo 2 falhem, então é uma nova expressão. Neste caso:
            - processe um LPAR
            - chame o método expression()
            - processe um RPAR

        Ao implementar a árvore sintática, o método deve sempre retornar um NoInterno com op igual a "factor", e os seguintes parâmetros nomeados em comum:
            - sinal: uma string que representa o sinal do factor. Por padrão deve ser '+', mas se o factor possuir um OPSUM na frente, deve ser o valor associado a este OPSUM;
            - esq: None
            - dir: None
        Se o token for um ID:
            - adicione um atributo nomeado extra chamado factor, cujo valor é um NoFolha com op igual a 'id', e o valor é igual ao valor associado ao token;
        Se o token for um NUMBER:
            - adicione um atributo nomeado extra chamado factor, cujo valor é um NoFolha com op igual a 'num', e o valor é igual ao valor associado ao token;
        Se o token for um BOOLEAN:
            - adicione um atributo nomeado extra chamado factor, cujo valor é um NoFolha com op igual a 'log', e o valor é igual ao valor associado ao token;
        Se for um LPAR (caso contrário aos de cima):
            - adicione um atributo nomeado extra chamado expression, com o objeto retornado pelo método expression()

        Em seguida, faça com que o método retorne o NoInterno criado.
        """
        sinal = NoFolha("OPSUM", "+", None)
        if self.token_corrente.tipo == "ID":
            factor = NoFolha("id", self.token_corrente.valor, self.token_corrente.linha)
            idToken = self.comparar("ID")
            sinal.linha = idToken.linha
            return NoInterno("factor", sinal=sinal, esq=None, dir=None, factor=factor)
        elif self.token_corrente.tipo == "INT":
            factor = NoFolha(
                "num", self.token_corrente.valor, self.token_corrente.linha
            )
            intToken = self.comparar("INT")
            sinal.linha = intToken.linha
            return NoInterno("factor", sinal=sinal, esq=None, dir=None, factor=factor)
        elif self.token_corrente.tipo == "BOOL":
            factor = NoFolha(
                "log", self.token_corrente.valor, self.token_corrente.linha
            )
            boolToken = self.comparar("BOOL")
            sinal.linha = boolToken.linha
            return NoInterno("factor", sinal=sinal, esq=None, dir=None, factor=factor)
        elif self.token_corrente.tipo == "NAO":
            naoToken = self.comparar("NAO")
            sinal.op = "nao"
            sinal.valor = naoToken.valor
            sinal.linha = naoToken.linha
            factor = self.factor()
            return NoInterno("factor", sinal=sinal, esq=factor, dir=None)

        elif self.token_corrente.tipo == "LPAR":
            lparToken = self.comparar("LPAR")
            expression = self.expression()
            self.comparar("RPAR")
            sinal.linha = lparToken.linha
            return NoInterno(
                "factor", sinal=sinal, esq=None, dir=None, expression=expression
            )

        elif self.token_corrente.tipo == "OPSUM":
            opsumToken = self.comparar("OPSUM")
            factor = self.factor()
            sinal.valor = opsumToken.valor
            sinal.linha = opsumToken.linha
            return NoInterno("factor", sinal=sinal, esq=factor, dir=None)


def analisar_sintaticamente(listaTokens: FofiTokens) -> NoInterno:
    a: AnalisadorSintatico = AnalisadorSintatico(listaTokens)
    return a.analisar()