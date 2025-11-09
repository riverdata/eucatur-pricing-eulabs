# EUCATUR PRICING APP

## ✨ Executando na Máquina Virtual/Servidor

> [!IMPORTANT]
> Utilize o Docker e o Ngnix para disponibilizar o aplicativo externamente, este processo é executado apenas uma unica vez para uma maquina virtual nova. Caso já possua o aplicativo configurado pule para a etapa
>
> - "Subir atualizações do aplicativo".
> - Altere a variavel VITE_API_URL nos docker-compose


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
<summary> ## ✨ Configuração da AWS </summary>

Verifique se as portas 81/80/443 estão liberadas no servidor cloud

</details>

<details>
<summary>## ✨ Procedimento para atualizar e subir o aplicativo em Desenvolvimento</summary>

1. **Acessar a pasta do aplicativo**  
   Entre no diretório onde está localizado o código-fonte do aplicativo:

```bash
cd eucatur-pricing-app
```
2. **Parar os containers em execução**
Finalize os serviços atualmente ativos no ambiente de Desenvolvimento:

```bash
sudo docker-compose down
```
3. **Remover a imagem antiga**
Apague a imagem Docker existente para garantir que uma nova versão seja criada do zero:

```bash
sudo docker rmi eucatur-pricing-app
```
4. **Construir a nova imagem e Subir a nova versão**
Gere a nova imagem Docker com base no código atualizado:

```bash
sudo docker-compose up -d --build
```

</details>

<details>
<summary>## ✨ Exemplo de requisição para obtenção de preços para o Impetus </summary>

```bash
curl --location 'https://stg-api-eucatur.riverdata.com.br/api/pricing_history/impetus' \
--header 'Content-Type: application/json' \
--data '{
    "pricing_code": "PRC-20250810-4165",
    "sale_at": "2025-08-20T10:00:00Z",
    "travel_id": "2270958",
    "line_code": "00001",
    "sectional_code_origin":"0234",
    "sectional_code_destination": "9257"
}'
```

Resultado esperado:

```bash
{
    "success": true,
    "message": "Precificação encontrada.",
    "data": {
        "fixedPrice": [
            {
                "seatType": "Normal",
                "price": 38.52
            },
            {
                "seatType": "Econômico",
                "price": 0
            },
            {
                "seatType": "Espaço Panorâmico",
                "price": 53.98
            },
            {
                "seatType": "Espaço Confort",
                "price": 48.54
            }
        ],
        "adjustedPrice": [
            {
                "seat": "1",
                "seatType": "Espaço Panorâmico",
                "price": 115.7
            },
            {
                "seat": "21",
                "seatType": "Normal",
                "price": 115.7
            }
        ],
        "agencies": [
            {
                "agency_id": "5486",
                "agency_description": "VILA CAMPINAS",
                "agency_code": "0325",
                "agency_status": "NORMAL",
                "agency_type": "1 - SECÇÃO",
                "agency_type_code": "1"
            }
        ]
    }
}
```

</details>

## 📌 Status da Precificação

### 🔵 Aguardando Aprovação

- **Descrição:** Esse é o status atribuído automaticamente quando uma precificação é finalizada.
- **Identificação na lista:** Representada por uma **bolinha azul**.
- **Próxima etapa:** Para que a precificação possa ser utilizada pelo sistema **Impetus**, é necessário acessá-la através do menu de ações (três pontos) e clicar em **"Aprovar"**.

---

### 🟡 Aguardando Ativação

- **Descrição:** Após ser aprovada, a precificação entra neste status.
- **Identificação na lista:** Representada por uma **bolinha amarela**.
- **O que acontece depois:**
  - Pode ser **ativada manualmente** pelo usuário.
  - Ou será **ativada automaticamente** pelo sistema na data de início definida.
  - Ainda é possível **reabrir para revisão** antes da ativação.

---

### 🟢 Ativas

- **Descrição:** Precificações que já estão em vigor e podem ser utilizadas pelo sistema.
- **Identificação na lista:** Representada por uma **bolinha verde**.
- **Comportamento:**
  - Podem ser **desativadas manualmente**.
  - Ou serão **expiradas automaticamente** quando atingir a data de validade.

---

### ⚪ Inativas

- **Descrição:** Precificações que foram desativadas manualmente.
- **Identificação na lista:** Representada por uma **bolinha cinza**.
- **Observação:** Podem ser **reativadas manualmente** a qualquer momento, caso necessário.

---

### 🔴 Expiradas

- **Descrição:** Precificações que **atingiram a data de expiração** e foram desativadas automaticamente pelo sistema.
