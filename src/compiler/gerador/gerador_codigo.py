# -*- coding: utf-8 -*-

# Os imports abaixo não são necessários, mas caso você necessite, são os únicos permitidos:
from utils.classes import NoInterno, NoFolha


class GeradorCodigo:

    def __init__(self, arvoreSintatica):
        # Mantenha pelo menos os 2 atributos a seguir:
        self.saida = ""
        self.arvore = arvoreSintatica
        # Você pode modificar e/ou criar seus atributos a partir daqui:
        self.mod = (
            ""  # é necessário guardar informação referente à declaração "implicit mod"
        )
        self.numTabs = -1  # é necessário guardar o nível de indentação
        # O nível -1 não existe, mas toda vez que entrarmos num block, este atributo será incrementado.
        self.simboloTab = "    "  # sugestão: utilize 4 espaços como indentação. Você pode usar este atributo como uma constante
        self.varNum = 0  # Contador de variáveis temporárias
        self.SONGS = []
        self.preload = "function preload() {\n"
        self.closeSetup = True
        # Crie mais atributos se achar necessário:

    def gerarJS(self):
        self.saida = "// Código gerado a partir do programa FOFI\n"
        self.saida += "const WIDTH = 1500\n"
        self.saida += "const HEIGHT = 750\n"
        self.saida += "const OBJECTS = []\n"
        self.saida += "const SOUNDLIST = []\n"
        self.saida += 'const CANVAS = { bg: "gray", bgType: "color" }\n'
        self.saida += "const MSG = document.getElementById('msg')\n"
        self.saida += "// Inicialização de variáveis\n"
        self.visitarDeclarations(self.arvore.get("declarations"))
        self.saida += "// Início do código\n"
        self.saida += "function setup() {\n"
        self.saida += f"{self.simboloTab}createCanvas(WIDTH, HEIGHT);\n"
        self.saida += f"{self.simboloTab}background(200);\n"
        self.visitarBlock(self.arvore.get("block"))
        if self.closeSetup:
            self.saida += f"OBJECTS.forEach((obj) => obj.func(obj));\n"
            self.saida += "}\n"
        if self.SONGS:
            for song in self.SONGS:
                self.preload += (
                    f"{self.simboloTab}SOUNDLIST.push(loadSound('{song}'));\n"
                )
                self.preload += f'{self.simboloTab}SOUNDLIST[SOUNDLIST.length - 1].nome = "{song}";\n'

        self.preload += f"}}\n"
        self.saida += self.preload

        return self.saida

    def visitarDeclarations(self, noDeclarations):
        if noDeclarations is None:
            return

        varDeclarationList = noDeclarations
        while varDeclarationList:
            self.visitarVarDeclaration(varDeclarationList.get("varDeclaration"))
            varDeclarationList = varDeclarationList.get("prox")

    def visitarVarDeclaration(self, noVarDeclaration):
        tipo = noVarDeclaration.get("type").valor
        identifierList = noVarDeclaration.get("identifierList")
        while identifierList:
            id = identifierList.get("id").valor
            if tipo == "numero":
                self.saida += f"var {self.simboloTab}{id} = 0;\n"
            elif tipo == "binario":
                self.saida += f"var {self.simboloTab}{id} = false;\n"
            elif tipo == "texto":
                self.saida += f"var {self.simboloTab}{id} = '';\n"
            identifierList = identifierList.get("prox")

    def visitarBlock(self, noBlock):
        self.numTabs += 1
        statementList = noBlock.get("statementList")
        while statementList:
            if statementList.get("statement"):
                statement = statementList.get("statement")
                op = statement.op
                if op == "assignStatement" and statement.get("inStatement"):
                    self.visitarInStatement(statement)
                elif op == "assignStatement" and statement.get("expression"):
                    id = statement.get("id").valor
                    expr = self.visitarExpression(statement.get("expression"))
                    self.saida += (
                        f"{self.simboloTab * self.numTabs}{id} = {expr}{self.mod}\n"
                    )
                elif op == "assignStatement" and statement.get("str_statement"):
                    id = statement.get("id").valor
                    expr = statement.get("str_statement").valor
                    self.saida += f'{self.simboloTab * self.numTabs}{id} = "{expr}";\n'
                elif op == "FUNCOUT":
                    self.visitarFuncoutStatement(statement)
                elif op == "ifStatement":
                    self.visitarifStatement(statement)
                elif op == "WhileStatement":
                    # self.visitarExpression(statement.get("expression"))
                    self.varNum -= 1

                    saida = f"{self.simboloTab * self.numTabs}while ({self.visitarExpression(statement.get('expression'))}) {{\n"
                    if saida == "while (true) {\n":
                        self.saida += f"OBJECTS.forEach((obj) => obj.func(obj));\n"
                        self.closeSetup = False
                        self.saida += "}\n"
                        self.saida += (
                            f"{self.simboloTab * self.numTabs}function draw() {{ \n"
                        )
                        self.saida += (
                            f"{self.simboloTab * self.numTabs}background(200);\n"
                        )
                        self.saida += (
                            "drawBg();\n"
                        )
                        self.saida += f"{self.simboloTab * self.numTabs}OBJECTS.forEach((obj) => obj.func(obj));\n"
                    else:
                        self.saida += saida

                    self.visitarBlock(statement.get("block"))
                    self.saida += f"{self.simboloTab * self.numTabs}}}\n"

                elif op == "repeatStatement":
                    self.saida += f"{self.simboloTab * self.numTabs}for (let i = 0; i < {self.visitarSumExpression(statement.get('expression'))}; i++) {{\n"
                    self.visitarBlock(statement.get("block"))
                    self.saida += f"{self.simboloTab * self.numTabs}}}\n"
            statementList = statementList.get("prox")
        self.numTabs -= 1

    def visitarInStatement(self, noStatement):
        id = noStatement.get("id").valor
        noInStatement = noStatement.get("inStatement")

        if noInStatement.get("valor") == "ler_numero":
            param = noInStatement.get("params")[0]
            self.saida += (
                f"{self.simboloTab * self.numTabs}{id} = ler_numero('{param.valor}');\n"
            )
        elif noInStatement.get("valor") == "ler_binario":
            param = noInStatement.get("params")[0]
            self.saida += f"{self.simboloTab * self.numTabs}{id} = ler_binario('{param.valor}');\n"
        elif noInStatement.get("valor") == "ler":
            self.saida += f"{self.simboloTab * self.numTabs}{id} = await ler();\n"
        elif noInStatement.get("valor") == "consultar":
            self.saida += f"{self.simboloTab * self.numTabs}{id} = consultar();\n"
        elif noInStatement.get("valor") == "criar_figura":
            params = noInStatement.get("params")
            text = f"{self.simboloTab * self.numTabs}{id} = criar_figura("
            for i in range(len(params)):
                param = params[i]
                if param.op == "str":
                    text += f'"{param.valor}", '
                elif param.op == "factor":
                    val = self.visitarSumExpression(param)
                    text += f"{val}, "
            text = text[:-2] + ");\n"
            self.preload += text
        elif noInStatement.get("valor") == "criar_imagem":
            params = noInStatement.get("params")
            text = f"{self.simboloTab * self.numTabs}{id} = criar_imagem("
            for i in range(len(params)):
                param = params[i]

                if param.op == "str":
                    text += f'"{param.valor}", '
                elif param.op == "factor":
                    val = self.visitarSumExpression(param)
                    text += f"{val}, "
                else:
                    val = self.visitarSumExpression(param, preload=True)
                    text += f"{val}, "
            text = text[:-2] + ");\n"
            self.preload += text
        elif noInStatement.get("valor") == "colidiu":
            params = noInStatement.get("params")
            val1 = self.visitarSumExpression(params[0])
            val2 = self.visitarSumExpression(params[1])
            self.saida += (
                f"{self.simboloTab * self.numTabs}{id} = colidiu({val1}, {val2});\n"
            )
        elif noInStatement.get("valor") == "aleatorio":
            params = noInStatement.get("params")
            val1 = self.visitarSumExpression(params[0])
            val2 = self.visitarSumExpression(params[1])
            self.saida += (
                f"{self.simboloTab * self.numTabs}{id} = aleatorio({val1}, {val2});\n"
            )

    def visitarFuncoutStatement(self, noFuncoutStatement):
        if noFuncoutStatement.get("valor") == "mostrar":
            if noFuncoutStatement.get("params"):
                params = noFuncoutStatement.get("params")
                if len(params) == 1:
                    param = params[0]
                    if param.op == "sum_expression":
                        val = self.visitarSumExpression(param)
                        self.saida += (
                            f"{self.simboloTab * self.numTabs}mostrar({val});\n"
                        )
                    elif param.op == "str":
                        self.saida += f"{self.simboloTab * self.numTabs}mostrar('{param.valor}');\n"
                    elif param.op == "factor":
                        val = self.visitarSumExpression(param)
                        self.saida += (
                            f"{self.simboloTab * self.numTabs}mostrar({val});\n"
                        )
        elif noFuncoutStatement.get("valor") == "esperar":
            if noFuncoutStatement.get("params"):
                params = noFuncoutStatement.get("params")
                if len(params) == 1:
                    param = params[0]
                    if param.op == "sum_expression":
                        val = self.visitarSumExpression(param)
                        self.saida += (
                            f"{self.simboloTab * self.numTabs}esperar({val});\n"
                        )
        elif noFuncoutStatement.get("valor") == "tocar":
            if noFuncoutStatement.get("params"):
                params = noFuncoutStatement.get("params")
                if len(params) == 1:
                    param = params[0]
                    if param.op == "str":
                        self.SONGS.append(param.valor)
                        self.saida += (
                            f"{self.simboloTab * self.numTabs}tocar('{param.valor}');\n"
                        )
        elif noFuncoutStatement.get("valor") == "limpar":
            self.saida += f"{self.simboloTab * self.numTabs}limpar();\n"
        elif noFuncoutStatement.get("valor") == "inicializar_com_cor":
            if noFuncoutStatement.get("params"):
                params = noFuncoutStatement.get("params")
                if len(params) == 1:
                    param = params[0]
                    if param.op == "str":
                        self.saida += f"{self.simboloTab * self.numTabs}inicializar_com_cor('{param.valor}');\n"
        elif noFuncoutStatement.get("valor") == "inicializar_com_imagem":
            if noFuncoutStatement.get("params"):
                params = noFuncoutStatement.get("params")
                if len(params) == 1:
                    param = params[0]
                    if param.op == "str":
                        self.saida += f"{self.simboloTab * self.numTabs}inicializar_com_imagem('{param.valor}');\n"
        elif noFuncoutStatement.get("valor") == "redefinir_figura":
            params = noFuncoutStatement.get("params")
            text = f"{self.simboloTab * self.numTabs}redefinir_figura("
            for i in range(len(params)):
                param = params[i]
                if param.op == "str":
                    text += f"{param.valor}, "
                elif param.op == "factor":
                    val = self.visitarSumExpression(param)
                    text += f"{val}, "
            text = text[:-2] + ");\n"
            self.saida += text
        elif noFuncoutStatement.get("valor") == "redefinir_imagem":
            params = noFuncoutStatement.get("params")
            text = f"{self.simboloTab * self.numTabs}redefinir_imagem("
            for i in range(len(params)):
                param = params[i]
                if param.op == "str":
                    text += f"{param.valor}, "
                elif param.op == "factor":
                    val = self.visitarSumExpression(param)
                    text += f"{val}, "
            text = text[:-2] + ");\n"
            self.saida += text
        elif noFuncoutStatement.get("valor") == "mover":
            params = noFuncoutStatement.get("params")
            text = f"{self.simboloTab * self.numTabs}mover("
            for i in range(len(params)):
                param = params[i]
                if param.op == "factor":
                    val = self.visitarSumExpression(param)
                    text += f"{val}, "
            text = text[:-2] + ");\n"
            self.saida += text
        elif noFuncoutStatement.get("valor") == "destacar":
            params = noFuncoutStatement.get("params")
            text = f"{self.simboloTab * self.numTabs}destacar("
            for i in range(len(params)):
                param = params[i]
                if param.op == "factor":
                    val = self.visitarSumExpression(param)
                    text += f"{val}, "
            text = text[:-2] + ");\n"
            self.saida += text
        elif noFuncoutStatement.get("valor") == "reverter_destaque":
            params = noFuncoutStatement.get("params")
            text = f"{self.simboloTab * self.numTabs}reverter_destaque();\n"
            self.saida += text

    def visitarifStatement(self, noIfStatement):
        expr = self.visitarExpression(noIfStatement.get("expression"))
        self.saida += f"{self.simboloTab * self.numTabs}if ({expr}) {{\n"
        self.visitarBlock(noIfStatement.get("blockIf"))
        self.saida += f"{self.simboloTab * self.numTabs}}}\n"
        if noIfStatement.get("blockElse"):
            self.saida += f"{self.simboloTab * self.numTabs}else {{\n"
            self.visitarBlock(noIfStatement.get("blockElse"))
            self.saida += f"{self.simboloTab * self.numTabs}}}\n"

    def visitarExpression(self, noExpression):
        if noExpression is None:
            return "0"

        # Processamento do lado esquerdo da expressão
        esq = self.visitarSumExpression(noExpression.get("esq"))

        # Se a expressão não possui operador, apenas retornamos o lado esquerdo
        if noExpression.get("oper") is None:
            return esq

        # Se a expressão possui operador, processamos o lado direito também
        dir = self.visitarSumExpression(noExpression.get("dir")) or "0"
        oper = noExpression.get("oper")
        self.varNum += 1
        tempVar = f"_TEMP{self.varNum}"

        if oper == "=":
            self.saida += (
                f"{self.simboloTab * self.numTabs}let {tempVar} = {esq} === {dir};\n"
            )
        else:
            self.saida += (
                f"{self.simboloTab * self.numTabs}let {tempVar} = {esq} {oper} {dir}\n"
            )
        return tempVar

    def visitarSumExpression(self, no, preload=False):
        if no is None:
            return ""

        if isinstance(no, NoFolha):
            if no.valor is not None:
                if no.valor.lower() == "true":
                    return "True"
                elif no.valor.lower() == "false":
                    return "False"
                else:
                    return str(no.valor)
            return ""

        elif no.op == "factor" and not no.get("expression"):
            valor = no.get("factor").valor if no.get("factor") else None
            if no.get("sinal").valor == "-":
                return f"-{self.visitarExpression(no)}"  # ;
            elif no.get("sinal").valor == "nao":
                return f"!{self.visitarExpression(no)}"  # ;
            else:
                if valor == "v":
                    return "true"
                elif valor == "f":
                    return "false"
                return valor

        elif no.op == "factor" and no.get("expression"):
            return self.visitarExpression(no.get("expression"))

        val1 = self.visitarSumExpression(no.get("esq"), preload=preload)
        val2 = self.visitarSumExpression(no.get("dir"), preload=preload)
        self.varNum += 1
        tempVar = f"_TEMPVAR{self.varNum}"

        saida = ""
        if no.op == "sum_expression":
            if no.get("oper") == "-":
                saida += f"{self.simboloTab * self.numTabs}let {tempVar} = {val1} - {val2};\n"
            elif no.get("oper") == "ou":
                saida += f"{self.simboloTab * self.numTabs}let {tempVar} = {val1} || {val2};\n"
            else:
                saida += f"{self.simboloTab * self.numTabs}let {tempVar} = {val1} + {val2};\n"
        elif no.op == "multiplicative_term":
            if no.get("oper") == "*":
                saida += f"{self.simboloTab * self.numTabs}let {tempVar} = {val1} * {val2};\n"
            elif no.get("oper") == "/":
                saida += f"{self.simboloTab * self.numTabs}let {tempVar} = {val1} / {val2};\n"
            elif no.get("oper") == "%":
                saida += f"{self.simboloTab * self.numTabs}let {tempVar} = {val1} % {val2};\n"
            elif no.get("oper") == "e":
                saida += f"{self.simboloTab * self.numTabs}let {tempVar} = {val1} && {val2};\n"
        elif no.op == "power_term":
            saida += (
                f"{self.simboloTab * self.numTabs}let {tempVar} = {val1} ** {val2};\n"
            )

        if preload:
            self.preload += saida
        else:
            self.saida += saida

        return tempVar


def gerar_codigo(arvore: NoInterno) -> str:
    gerador: GeradorCodigo = None
    try:
        gerador = GeradorCodigo(arvore)
    except Exception:
        raise AssertionError("Erro ao instanciar a classe GeradorCodigo")
    if gerador:
        gerador = GeradorCodigo(arvore)
        return gerador.gerarJS()
