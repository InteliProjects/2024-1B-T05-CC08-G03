<table>
<tr>
<td>
<a href= "https://www.fm.usp.br/fofito/portal/"> <img src="artefatos/img/fmusp-logo.svg" alt="https://www3.fm.usp.br/fmusp/portal/" border="0" width="90%"></a>
</td>
<td><a href= "https://www.inteli.edu.br/"><img src="artefatos/img/inteli-logo.png" alt="Inteli - Instituto de Tecnologia e Liderança" border="0" width="35%"></a>
</td>
</tr>
</table>

# Tapete sensorial como recurso lúdico para assistência a crianças com Transtorno do Espectro Autista.

# Guiados Pelo Axé

<img src="src/assets/img/axe.png"> </img>

# Integrantes:

* [Arthur Tsukamoto Oliveira](https://www.linkedin.com/in/arthur-tsukamoto/)
* [Fábio Piemonte Lopes](https://www.linkedin.com/in/fabio-piemonte-823a65211/)
* [Guilherme Novaes Lima](https://www.linkedin.com/in/guilherme-novaes-lima/)
* [Henrique Godoy](https://www.linkedin.com/in/henrique-godoy-879138252/)
* [Marcelo Maia Fernandes Filho](https://www.linkedin.com/in/marcelomaiaf/)

# Descrição

Este projeto apresenta uma plataforma integrada que combina um tapete sensorial com um Ambiente de Desenvolvimento Integrado (IDE) para auxiliar no tratamento de crianças com Transtorno do Espectro Autista (TEA). A plataforma visa estimular os aspectos motores e cognitivos das crianças, oferecendo uma abordagem terapêutica personalizada. A IDE permite que terapeutas ocupacionais desenvolvam jogos específicos para as necessidades de cada paciente, e o sistema de monitoramento contínuo da plataforma avalia constantemente o progresso das crianças durante as sessões terapêuticas.

# Configuração para desenvolvimento

## Pré-requisitos

Para garantir um ambiente de desenvolvimento eficiente e livre de problemas, certifique-se de que os seguintes softwares estejam instalados e configurados corretamente em sua máquina:

- Docker: Necessário para criar contêineres isolados que garantem a consistência do ambiente.
- Node.js e npm: Necessários para executar scripts do lado do cliente e gerenciar pacotes.
- TypeScript: Ferramenta essencial para desenvolvimento com tipagem estática em JavaScript.

## Configuração do Backend

1. Clone o repositório do projeto:
    ```
   git clone https://github.com/Inteli-College/2024-1B-T05-CC08-G03.git
    ```
2. Entre na pasta do backend : 
    ```
    cd src/ide/backend/docker
    ```
3. Inicie o container Docker
    ```
    docker-compose up
    ```

## Configuração do Frontend

4. Entre na pasta do frontend:
    ```
    cd ../../frontend
    ```
5. Baixe as dependências do package.json:
    ```
    npm install
    ```
6. Inicie o servidor de desenvolvimento:
    ```
    npm start
    ```

## Verificações Finais

1. Verificação do backend
    - Acesse a URL fornecida pelo Docker no terminal (geralmente http://localhost:porta), de maneira que você pode personalizar a porta definida mas por padrão neste projeto a utilizada para o backend é 8080.
    - Se a URL não responder, verifique logs do Docker para identificar problemas no contêiner.
2. Verificação do frontend
    - Acesse http://localhost:porta no navegador,de maneira que você pode personalizar a porta definida mas por padrão neste projeto a utilizada para o frontend é 3000.
    - Problemas comuns: Se o frontend não carregar, verifique o console do navegador e os logs do terminal onde o npm start foi executado.

Agora, com o ambiente de desenvolvimento configurado corretamente, você está pronto para começar a trabalhar no projeto! Certifique-se de resolver qualquer problema emergente conforme as etapas acima para manter um fluxo de trabalho produtivo.


Agora seu ambiente de desenvolvimento está configurado e você pode começar a trabalhar no projeto :)

# Tags

- SPRINT 1
    - Entendimento da Experiência do Usuário
    - Entendimento de negócios
    - Definição da arquitetura do sistema

- SPRINT 2
    - IDE - 1ª Versão
    - Artigo - versão inicial
    - Analisador Léxico

- SPRINT 3
    - Analisador Sintático
    - IDE - 2a versão
    - Artigo - versão 2

- SPRINT 4
    - Analisador semântico e Geração de código
    - IDE - 3a versão
    - Artigo - versão 3

- SPRINT 5
    - Analisadores léxico, sintático e semântico (versões finais)
    - Refinamento IDE
    - Artigo - versão final
    - Organização do Github

## Licença
A licença do projeto é <a href="https://creativecommons.org/licenses/by/4.0/?ref=chooser-v1">Attribution 4.0 Internationa</a>

<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"><p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/">
