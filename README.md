# B_LEARN

### Tabela de conteúdos

1. [Objetivo](#objetivo)
2. [Requisitos e Dependências](#requisitos-e-dependências)
3. [Execução](#execução)
4. [Exemplos](#exemplos)
5. [Bugs](#bugs-conhecidos)
6. [Integrantes](#integrantes)
7. [Agradecimentos](#agradecimentos)

## Objetivo

O objetivo do projeto B_LEARN é o desenvolvimento de um tradutor de instruções Thumb (16 bits) para ARM32 (32 bits). Para a tradução, são utilzados campos (inputs) nos quais os bits das instruções podem ser configurados, e a tradução ocorre de maneira automática.

Para isso, foram levadas em conta as instruções Thumb que possuam equivalente direto em ARM32, isto é, que gerem apenas uma instrução na ISA ARM32.

Além da visualização do bits, o projeto conta com tradutores de instruções binárias para instruções ASCII, desenvolvidos pelo [Professor Bruno Basseto](https://github.com/bru4bas)

## Requisitos e Dependências

1. WSL/Linux

    Recomenda-se que o projeto seja executada no sobre o Linux, ou sobre o WSL.

2. Node

    Para execução deste projeto, é recomendável que você tenha instalado no seu ambiente a versão estável mais recente do Node (> v18.16.1).

~~~bash
    sudo apt-get install curl
~~~
~~~bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
    command -v nvm
~~~
~~~bash
    nvm install --lts
~~~

## Execução

### Instalando as dependências do projeto

Na pasta raiz do projeto, digite o seguinte comando para instalar as dependências do projeto:

~~~bash
    npm install
~~~

### Executando o projeto

~~~bash
    npm start
~~~

### Testes

~~~bash
    npm test
~~~

## Exemplos

Para o uso do B_LEARB, basta clicar sobre as caixas dos bits, a tradução, caso exista, ocorrerá da maneira automática.

- Operação aritmética com imediato

![image](https://github.com/DamaralHenrique/b_learn/assets/64907004/b60593cd-1879-453c-9ae8-e406e4534a35)

- Operação de deslocamento do conteúdo de um registrador

![image](https://github.com/DamaralHenrique/b_learn/assets/64907004/c341a350-e3ec-4830-9907-81398620ef30)

- Operação lógica entre registradores

![image](https://github.com/DamaralHenrique/b_learn/assets/64907004/3f42e5e1-7152-4727-8611-589d39178b29)

- Operação entre registradores "altos" (Bug na tradução ASCII)

![image](https://github.com/DamaralHenrique/b_learn/assets/64907004/44569150-edb9-406f-975c-c79e71bde709)

- Operação de "Load", relativa ao contador de programa

![image](https://github.com/DamaralHenrique/b_learn/assets/64907004/43711561-9a07-4693-b0fb-3ca78fba99a3)

- Operação de "Store byte", com deslocamento em registrador.

![image](https://github.com/DamaralHenrique/b_learn/assets/64907004/62fbc296-80ca-49d8-9c49-0fe4da71f8e7)

- Operação de "Load half", com deslocamento imediato

![image](https://github.com/DamaralHenrique/b_learn/assets/64907004/42328290-1dda-4dc5-9977-ae1728124950)

- Operação "Push"

![image](https://github.com/DamaralHenrique/b_learn/assets/64907004/7de3dc9f-50b0-4d14-9520-c5a352925b40)

- Operação de desvio condicional, endereço atingível

![image](https://github.com/DamaralHenrique/b_learn/assets/64907004/172ba0bd-06a0-4205-b54b-cc76774c4852)

- Operação de desvio incondicional, endereço não atingível*

![image](https://github.com/DamaralHenrique/b_learn/assets/64907004/f94142a2-7150-48d6-b903-09aff97038fd)

> Endereços cujo bit 0 sejam "1" não são atingíveis por uma instrução traduzida para ARM32


## Bugs conhecidos

## Integrantes

| Nome               | Github |
|--------------------|--------|
| Henrique D'Amaral  | @git   |
| Rafael Nakata      | @git   |
| Vinicius de Castro | @git   |

## Agradecimentos

Agradecimentos especiais ao [Professor Bruno Basseto](https://github.com/bru4bas), autor do tradutor de instruções binárias para instruções ASCII.