from utils.classes import (
    NoInterno,
    NoFolha,
    NoTabela,
    SemanticException,
    SyntaxException,
    FofiTokens,
    FofiToken,
)

class AnalisadorSemantico:

    def __init__(self, arvoreSintatica):
        self.teste = True
        self.arvore = arvoreSintatica
        self.tabela = {}

    def analisar(self):
        """
        Método que inicializa o processo de análise semântica.
        """

        self.visitarAlg()

    def visitarAlg(self):
        """
        Adiciona o ID do programa à tabela de símbolos: a chave é o próprio nome (valor) do identificador, e o valor é um NoTabela com valor None e type "alg".
        Chama:
            - visitarDeclarations(), passando o nó "declarations" por parâmetro;
            - visitarBlock(), passando o nó "block" por parâmetro;
        """

        self.visitarDeclarations(self.arvore.get("declarations"))
        self.visitarBlock(self.arvore.get("block"))

    def visitarDeclarations(self, noDeclarations):
        """
        Recebe um nó "declarations" por parâmetro. Possui um laço que percorre cada declaração da lista "varDeclarationList", e chama o método
        visitarVarDeclaration() passando cada nó "varDeclaration" contido na lista como parâmetro.
        """

        while noDeclarations is not None:
            self.visitarVarDeclaration(noDeclarations.get("varDeclaration"))
            noDeclarations = noDeclarations.get("prox")

    def visitarVarDeclaration(self, noVarDeclaration):
        """
        Recebe um nó "varDeclaration" por parâmetro. Possui um laço que percorre a lista "identifierList", para obter os identificadores declarados no programa.
        Ao processar cada identificador, verifica se ele já existe na tabela de símbolos. Se existir, lance uma SemanticException com a seguinte mensagem:
            - O identificador "NOME_DO_IDENTIFICADOR" na linha NUMERO_DA_LINHA foi declarado anteriormente
        Caso o ID não exista na lista, adicione-o à tabela de símbolos da seguinte maneira:
            - chave: nome do identificador
            - valor: NoTabela(None, type_DO_IDENTIFICADOR)
        Dica: o valor None significa que o identificador ainda não foi inicializado.
        Dica: o type do identificador está disponível no objeto noVarDeclaration.
        """

        tipo_identificador = noVarDeclaration.get("type").valor

        current = noVarDeclaration.get("identifierList")

        while current is not None:

            identificador = current.get("id")
            id_nome = identificador.valor
            id_linha = identificador.linha

            if id_nome in self.tabela.keys():
                raise SemanticException(
                    f'O identificador "{id_nome}" na linha {id_linha} foi declarado anteriormente'
                )

            tipo_identificador = (
                "log" if (tipo_identificador == "binario") else tipo_identificador
            )
            tipo_identificador = (
                "num" if (tipo_identificador == "numero") else tipo_identificador
            )

            self.tabela[id_nome] = NoTabela(None, tipo_identificador)

            current = current.get("prox")

    def visitarBlock(self, noBlock):
        """
        Recebe um nó "block" por parâmetro. Como um "block" possui apenas um "statementList", você pode processar todo o "statementList" dentro deste método.
        Mas se preferir, pode criar métodos adicionais.

        Possui um laço que percorre a lista "statementList", para obter os nós "statement" dentro deste bloco.

        Se o "statement" for um "assignStatement", faça o seguinte:
            1- obtenha o "id" (L-value) da atribuição;
            2- verifique se este id está contido na tabela de símbolos. Se não estiver, lance uma SemanticException com a mensagem:
                - O identificador "NOME_DO_IDENTIFICADOR" na linha NUMERO_DA_LINHA não foi declarado

            3- verifique se este "statement" possui um nó "expression". Caso positivo, chame o método visitarExpression() passando o nó "expression" como parâmetro;
            4- obtenha o valor retornado pelo método visitarExpression(), e verifique, através da tabela de símbolos, se o valor retornado é do mesmo type do id (L-value).
            Caso sejam de types diferentes, lance uma SemanticException com a mensagem:
                - O identificador "NOME_DO_IDENTIFICADOR" na linha NUMERO_DA_LINHA não pode receber uma expressão do type "type_RETORNADO_PELA_EXPRESSION"
            5- atualize o valor associado ao id (L-value) na tabela de símbolos com um valor diferente de None. Lembre-se que todo identificador não inicializado
            possui o seu valor na tabela igual a None. Sugestão: este valor pode ser o próprio nome do identificador.

        Se o "statement" for um "outStatement", faça o seguinte:
            - chame o método visitarExpression() passando o nó "expression" como parâmetro;

        Se o "statement" for um "ifStatement", faça o seguinte:
            1- chame o método visitarBlock() de maneira recursiva, passando o nó "blockIf" como parâmetro;
            2- se o "statement" possuir um "blockElse", faça o mesmo com o "blockElse".
        """
        current = noBlock.get("statementList")

        while current is not None:

            statement = current.get("statement")

            if statement.op == "assignStatement":
                self._process_assignStatement(statement)

            elif statement.op == "outStatement":
                self.visitarExpression(statement.get("expression"))

            elif statement.op == "ifStatement":
                self._process_ifStatement(statement)

            current = current.get("prox")

    def _process_assignStatement(self, statement):

        id = statement.get("id")
        id_nome = id.valor
        id_linha = id.linha

        if id_nome not in self.tabela.keys():
            raise SemanticException(
                f'O identificador "{id_nome}" na linha {id_linha} não foi declarado'
            )

        if statement.get("expression"):
            valor = self.visitarExpression(statement.get("expression"))

            if valor.tipo in ["num", "log"] and self.tabela[id_nome].tipo != valor.tipo:
                tipo_no_erro = valor.tipo
                match valor.tipo:
                    case "num":
                        tipo_no_erro = "numero"
                    case "log":
                        tipo_no_erro = "binario"
                raise SemanticException(
                    f'O identificador "{id_nome}" na linha {id_linha} não pode receber uma expressão do type "{tipo_no_erro}"'
                )

            self.tabela[id_nome] = NoTabela(valor.valor, self.tabela[id_nome].tipo)

        elif statement.get("str_statement"):
            valor = statement.get("str_statement")

            if self.tabela[id_nome].tipo != "texto":
                tipo_no_erro = valor.tipo
                match self.tabela[id_nome].tipo:
                    case "num":
                        tipo_no_erro = "numero"
                    case "log":
                        tipo_no_erro = "binario"
                raise SemanticException(
                    f'O identificador "{id_nome}" na linha {id_linha} não pode receber uma expressão do type "{tipo_no_erro}"'
                )

            self.tabela[id_nome] = NoTabela(valor.valor, self.tabela[id_nome].tipo)

    def _process_ifStatement(self, statement):
        self.visitarBlock(statement.get("blockIf"))

        if statement.get("blockElse"):
            self.visitarBlock(statement.get("blockElse"))

    def visitarExpression(self, noExpression):
        """
        Recebe um nó "expression" por parâmetro. Chama o método visitarSumExpression() passando o nó "esq" como parâmetro.
        Caso não exista um operador relacional, então o método deve retornar o resultado de visitarSumExpression(), isto é, o mesmo
        objeto que visitarSumExpression() retornar será repassado por este método.

        Caso a "expression" possua um operador (nó "oper"), chama visitarSumExpression() passando o nó "dir" como parâmetro. Neste caso, este método
        deve retornar um NoTabela() cujo type obrigatoriamente deve ser "log".
        """

        esq_sum_expression = self.visitarSumExpression(noExpression.get("esq"))

        if not noExpression.get("oper"):
            return esq_sum_expression

        dir_sum_expression = self.visitarSumExpression(noExpression.get("dir"))

        return NoTabela(dir_sum_expression.valor, "log")

    def visitarSumExpression(self, no):
        """
        Recebe um nó por parâmetro que pode ser um "sumExpression", "multiplicativeTerm", "powerTerm" ou "factor".
        Como todos esses nós possuem os apontadores "esq" e "dir", eles podem ser tratados como nós de uma árvore binária. Ou seja, você pode
        processar todos eles dentro deste método, ou se preferir pode criar métodos adicionais.

        O método já possui um esqueleto do percurso em pós-ordem com comentários adicionais (abaixo).
        O valor de retorno deve ser sempre um NoTabela(), contendo o valor retornado (o nome de um ID, um número inteiro ou um valor booleano,
        por exemplo), e o type de dado deste valor ("log" ou "num").
        """

        if no != None:

            val1 = self.visitarSumExpression(no.get("esq"))
            val2 = self.visitarSumExpression(no.get("dir"))

            if ( no.op == "sum_expression" or no.op == "multiplicative_term" or no.op == "power_term"): 

                if val1.tipo != val2.tipo:

                    val1Value = no.get("esq").get("factor").valor
                    val2Value = no.get("dir").get("factor").valor

                    raise SemanticException(
                        f'types incompatíveis: "{val1Value}" e "{val2Value}"'
                    )

                if val2.tipo == "num" and val2.tipo == "0":

                    direita = no.get("dir")
                    factor = direita.get("factor")
                    raise SemanticException(f"Divisão por zero na linha {factor.linha}")

                if val2.tipo == "num" and int(val2.valor) < 0:
                    raise SemanticException(
                        f'Expoente negativo na linha {no.get("dir").get("factor").linha}'
                    )

                if val1 != None:
                    return val2

            elif no.op == "factor" and not no.get("expression"):
                """
                Obtenha o NoFolha dentro do factor.

                Se for um "id", faça as seguintes verificações:
                    Se o identificador não está na tabela de símbolos, lance uma SemanticException com a mensagem:
                        - O identificador "NOME_DO_IDENTIFICADOR" na linha NUMERO_DA_LINHA não foi declarado
                    Se ele existe na tabela, mas seu valor é None (nulo), ele não foi inicializado. Neste caso lance uma SemanticException com a mensagem:
                        - O identificador "NOME_DO_IDENTIFICADOR" na linha NUMERO_DA_LINHA não foi inicializado
                    Caso contrário, retorne o objeto NoTabela associado ao identificador.

                Se for um "log" (valor booleano), retorne um NoTabela com este valor (true ou false) e o type "log".

                Se for um "num" (valor inteiro), obtenha o seu sinal. Se for negativo, retorne este valor (inteiro) com o sinal de "-" na frente. Além disso,
                associe o type "num" ao NoTabela retornado.
                """

                fator = no.get("factor")

                if fator.op == "id":

                    id_nome = fator.valor
                    id_linha = fator.linha

                    if self.tabela[id_nome].valor is None:
                        raise SemanticException(
                            f'O identificador "{id_nome}" na linha {id_linha} não foi declarado'
                        )

                    if id_nome not in self.tabela.keys():
                        raise SemanticException(
                            f'O identificador "{id_nome}" na linha {id_linha} não foi declarado'
                        )

                    if self.tabela[id_nome].valor is None:
                        raise SemanticException(
                            f'O identificador "{id_nome}" na linha {id_linha} não foi inicializado'
                        )

                    return self.tabela[id_nome]

                elif fator.op == "log":
                    return NoTabela(fator.valor, "log")

                elif fator.op == "num":
                    valor = fator.valor
                    if no.get("sinal"):
                        valor = no.get("sinal").valor + valor
                    return NoTabela(valor, "num")
            
            elif no.op == "factor" and no.get("expression"):
                return self.visitarExpression(no.get("expression"))


def analisar_semanticamente(arvoreSintatica: NoInterno) -> str:
    a: AnalisadorSemantico = AnalisadorSemantico(arvoreSintatica)
    a.analisar()
    return str(a.tabela)

def nice_print(thingy: str, other: any):
    print(int(80 / len(thingy)) * f"{thingy}")
    print(f"{other}")
    print(int(80 / len(thingy)) * f"{thingy}")