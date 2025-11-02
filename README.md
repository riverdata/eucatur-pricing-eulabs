# EUCATUR PRICING API

## ✨ Executando na Máquina Virtual

> [!IMPORTANT]
> Utilize o Docker e o Ngnix para disponibilizar o aplicativo externamente, este processo é executado apenas uma unica vez para uma maquina virtual nova. Caso já possua o aplicativo configurado pule para a etapa
>
> - "Subir atualizações do aplicativo".
> - Altere o arquivo .env com o caminho local dos arquivos

Primeiramente crie uma instância na AWS (ou similar) com SO ubuntu(opcional)

<details>

<summary> ## ✨ Configuração do docker </summary>

Para instalar o Docker no Ubuntu 20.04, siga os passos abaixo:
Atualize o índice de pacotes:

```bash
sudo apt update
```

Instale os pacotes necessários para permitir que o APT use pacotes através do HTTPS:

```bash
sudo apt install apt-transport-https ca-certificates curl software-properties-common
```

Adicione a chave GPG oficial do Docker:

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

Adicione o repositório Docker APT:
Adicione a chave GPG oficial do Docker:

```bash
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

Atualize o índice de pacotes novamente:

```bash
sudo apt update
```

Certifique-se de que você está instalando a partir do repositório Docker, não do repositório padrão do Ubuntu:

```bash
apt-cache policy docker-ce
```

Instale o Docker:

```bash
sudo apt install docker-ce
```

Verifique se o Docker está em execução:

```bash
sudo systemctl status docker
```

A saída deve mostrar que o serviço do Docker está ativo (running).

O comando docker network create web é utilizado para criar uma nova rede chamada web no Docker. Esta rede pode ser utilizada para conectar diferentes contêineres de Docker, permitindo que eles se comuniquem entre si.

Aqui está como você pode usar este comando:

```bash
sudo docker network create web
```

Instale docker-compose:

```bash
sudo apt install docker-compose
```

</details>

<details>
<summary> ## ✨ Configuração do NGNIX </summary>

Copie o arquivo "docker-compose.yml" para o servidor e execute:

```bash
sudo docker-compose -f docker-compose.yml up -d
```

### Para o primeiro acesso ao NGNIX:

Link: http://(IP DA MAQUINA VIRTUAL):81/login

Email: admin@riverdata.com.br

Password: Rivia@09102024

</details>

<details>
<summary>## ✨ Procedimento para iniciar o projeto</summary>

Crie arquivos de variaveis de ambiente
.env para produção
.env.development para desenvolvimento

Atualmente o ngnix está mapeando as rotas externas para:
http://api.eucatur.riverdata.com.br
http://app.eucatur.riverdata.com.br

No front do ngnix é possivel alterar para a rota correspondente


**Em Desenvolvimento**  

```bash
   sudo docker-compose up -d --build
```

**Em Produção**

```bash
   sudo docker-compose -f docker-compose.yml up -d --build
```

</details>