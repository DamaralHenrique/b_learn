# B_LEARN

### Tabela de conteúdos

1. [Objetivo](#objetivo)
2. [Requisitos e Dependências](#requisitos-e-dependências)
3. [Execução](#execução)
4. [Exemplos](#exemplos)
5. [Integrantes](#integrantes)
6. [Agradecimentos](#agradecimentos)

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

![image](https://github.com/DamaralHenrique/b_learn/assets/64907004/4df974e6-7ad8-4f35-b6a3-dd41abcab23d)

- Operação de deslocamento do conteúdo de um registrador

![image](https://github.com/DamaralHenrique/b_learn/assets/64907004/aa0f3892-ad76-4be4-99b5-8b90409f4c97)

- Operação lógica entre registradores

![image](https://github.com/DamaralHenrique/b_learn/assets/64907004/d672948e-5bd1-48d9-831e-5b7a4d5c6e15)

- Operação entre registradores "altos" (Bug na tradução ASCII)
- 
![image](https://github.com/DamaralHenrique/b_learn/assets/64907004/8d438ffb-dbc8-4a79-8688-22e6905b478c)

- Operação de "Load", relativa ao contador de programa

![image](https://github.com/DamaralHenrique/b_learn/assets/64907004/25950b48-0926-40a3-8260-3010fedbca93)


- Operação de "Load byte", com deslocamento em registrador.

![image](https://github.com/DamaralHenrique/b_learn/assets/64907004/c944d53b-866e-444a-b448-1c993440cddf)

- Operação de "Load half", com deslocamento imediato

![image](https://github.com/DamaralHenrique/b_learn/assets/64907004/ccea4bce-b447-42e6-9984-cfdf9f95b8d9)

- Operação "Push"

![image](https://github.com/DamaralHenrique/b_learn/assets/64907004/d21f74e5-336d-4cab-95f4-1e6cad0a8a8a)

- Operação de desvio condicional, endereço atingível

![image](https://github.com/DamaralHenrique/b_learn/assets/64907004/eaf5f912-a531-4049-904e-a09fba49b84a)

- Operação de desvio incondicional, endereço não atingível*

![image](https://github.com/DamaralHenrique/b_learn/assets/64907004/9bc7084b-a54a-4908-8045-898a2446f7c2)

> Endereços cujo bit 0 sejam "1" não são atingíveis por uma instrução traduzida para ARM32


## Integrantes

| Nome               | Github |
|--------------------|--------|
| Henrique D'Amaral  | @git   |
| Rafael Nakata      | @git   |
| Vinicius de Castro | @git   |

## Agradecimentos

Agradecimentos especiais ao [Professor Bruno Basseto](https://github.com/bru4bas), autor do tradutor de instruções binárias para instruções ASCII.
