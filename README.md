# Discorama Insights Hub

Painel analítico baseado em Vite + React + TypeScript para visualização e exploração de métricas financeiras e de clientes.

## Visão geral

Este repositório contém a interface frontend do **Discorama Insights Hub**, uma aplicação para geração de dashboards e relatórios a partir de conjuntos de dados CSV (armazenados em `public/data`). O projeto usa componentes reutilizáveis, gráficos e integração com utilitários para leitura e transformação dos dados.

## Tecnologias

- Vite
- React 18
- TypeScript
- Tailwind CSS
- shadcn-ui / Radix UI
- Recharts (visualizações)
- Vitest (testes)

## Estrutura principal do projeto

- [src](src) — código-fonte da aplicação (entradas, páginas e componentes)
  - [src/components](src/components) — componentes UI e de dashboard
  - [src/lib](src/lib) — serviços e utilitários (ex.: `dataService.ts`)
  - [src/pages](src/pages) — rotas/páginas da aplicação
- [public/data](public/data) — arquivos CSV usados como fonte de dados (ex.: `agencias.csv`, `transacoes.csv`)
- vite.config.ts — configuração do Vite
- package.json — scripts e dependências

## Scripts úteis

Instale dependências:

```bash
npm install
```

Executar em desenvolvimento:

```bash
npm run dev
```

Gerar build de produção:

```bash
npm run build
```

Build em modo development (útil para debug do build):

```bash
npm run build:dev
```

Servir a build localmente:

```bash
npm run preview
```

Lint (ESLint):

```bash
npm run lint
```

Testes (Vitest):

```bash
npm run test        # execução única
npm run test:watch  # modo watch
```

## Dados

Os dados utilizados pela aplicação estão em `public/data` no formato CSV. Para adicionar ou atualizar dados:

- Coloque o arquivo CSV em `public/data`.
- Atualize os parsers/serviços em `src/lib/dataService.ts` se necessário.

## Desenvolvimento e contribuições

- Abra uma issue descrevendo o problema ou a feature desejada.
- Crie uma branch com um nome descritivo (`feat/login`, `fix/chart-legend`).
- Faça PRs pequenos e focados; inclua screenshots quando pertinente.

Recomendações de fluxo local:

```bash
git checkout -b feat/minha-nova-feature
npm install
npm run dev
# ao concluir
git add .
git commit -m "feat: descrição curta"
git push origin feat/minha-nova-feature
# abra um Pull Request
```

## Testes e qualidade

- Use `npm run lint` para verificar problemas de lint.
- Execute `npm run test` para rodar os testes unitários existentes.

## Observações

- Este projeto foi iniciado a partir de um template e adaptações foram feitas para concentrar funcionalidades de visualização de dados.
- Verifique os arquivos de configuração (`tsconfig.json`, `vite.config.ts`, `tailwind.config.ts`) quando precisar ajustar builds ou comportamento do CSS.

## Contato

Se precisar de ajuda com o projeto, abra uma issue ou entre em contato com os mantenedores do repositório.

---

Arquivo atualizado automaticamente para refletir a estrutura e os scripts do projeto.
