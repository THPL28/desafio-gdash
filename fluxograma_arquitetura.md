# GDASH - Fluxograma Arquitetural

```mermaid
flowchart TD
    A[Frontend (React + Vite + Tailwind + shadcn/ui)] -->|REST API| B[API Gateway / Backend (NestJS)]
    B -->|Autenticação JWT / RBAC| B
    B -->|Consulta / Atualização| F[MongoDB]
    B -->|Consome| E[RabbitMQ]
    E -->|Recebe dados| D[Python Collector]
    E -->|Envia dados| G[Go Worker]
    G -->|Processa e salva| F
    B -->|Consulta APIs externas| H[APIs de Desastres & Meteorologia]
    B -->|Exporta| I[CSV]
    B -->|Cache/Fallback| J[Cache Local]

    subgraph Servicos
        D
        G
        E
        F
        J
    end

    subgraph Externos
        H
    end
```

## Descrição do Fluxo
- O usuário acessa o **Frontend** e realiza operações (login, consulta, exportação).
- O **Backend** (NestJS) autentica, autoriza e responde às requisições, consultando o **MongoDB** para dados locais e cache.
- O **Backend** integra dados de APIs externas de meteorologia e desastres, normaliza e armazena em cache local.
- O **Python Collector** coleta dados periodicamente das APIs externas e envia para o **RabbitMQ**.
- O **Go Worker** consome mensagens do **RabbitMQ** e insere dados normalizados no **MongoDB**.
- O **Backend** pode exportar dados em **CSV** e sempre utiliza cache/fallback para garantir disponibilidade.

> Todos os serviços são orquestrados via Docker Compose, garantindo isolamento, escalabilidade e fácil manutenção.
