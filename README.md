# DLF-CI

Workflow de CI reutilizável para validar código em pull requests: roda lint e typecheck, comenta erros inline com Reviewdog, e notifica falhas.

## O que faz

1. **Lint com ESLint** — valida o código e gera relatório
2. **Typecheck** — verifica tipos TypeScript
3. **Code review inline** — Reviewdog comenta erros diretamente nas linhas do PR
4. **Notificação de falha** — bot comenta no PR se algo quebrar

**Regras de qualidade (warnings):**
- ⚠️ Arquivos com mais de 150 linhas
- ⚠️ Comentários no código
- ⚠️ Regras TypeScript recomendadas

**Comportamento:**
- ✅ Sucesso → CI passa em silêncio
- ❌ Falha → comentário no PR + review inline

## Como usar em outro repositório

### 1. Adicione o workflow

Crie `.github/workflows/ci.yml` no seu repo:

```yaml
name: CI

on:
  pull_request:

permissions:
  contents: read
  pull-requests: write

jobs:
  ci:
    uses: SEU-USUARIO/DLF-CI/.github/workflows/ci.yml@main
    secrets: inherit
```

Substitua `SEU-USUARIO` pelo usuário/org do GitHub onde este repo está.

### 2. Configure os scripts no package.json

```json
{
  "scripts": {
    "lint:ci": "eslint --config eslint.config.js .",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "eslint": "^9.18.0",
    "typescript": "^5.7.2",
    "@typescript-eslint/parser": "^8.20.0",
    "@typescript-eslint/eslint-plugin": "^8.20.0"
  }
}
```

Ajuste os comandos conforme o setup do seu projeto. O importante é que `lint:ci` e `typecheck` existam.

### 3. Crie eslint.config.js

Configuração mínima para TypeScript com regras de qualidade:

```js
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");

module.exports = [
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin
    },
    rules: {
      "max-lines": ["warn", { max: 150 }],
      "no-inline-comments": ["warn"],
      "line-comment-position": ["warn", { "position": "above" }],
      ...tsPlugin.configs.recommended.rules
    }
  }
];
```

Ajuste as regras conforme necessário. As regras acima garantem:
- Aviso em arquivos com +150 linhas
- Aviso em comentários inline
- TypeScript com regras recomendadas

### 4. Crie tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "jsx": "react-jsx",
    "noEmit": true
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### 5. Instale as dependências

```bash
npm install
```

Pronto. Abra um PR e o CI vai rodar automaticamente.

## Requisitos

- Node.js 20+
- TypeScript (`.ts`, `.tsx`)
- `package.json` com scripts `lint:ci` e `typecheck`
- ESLint + plugins TypeScript instalados
- `package-lock.json` commitado
- `tsconfig.json` configurado

## Estrutura mínima esperada

```
seu-repo/
├── .github/
│   └── workflows/
│       └── ci.yml
├── eslint.config.js
├── tsconfig.json
├── package.json
├── package-lock.json
└── src/
    └── *.ts ou *.tsx (seu código TypeScript)
```

## Exemplo de falha

Se o lint ou typecheck falhar, o bot comenta no PR:

> ❌ CI falhou (lint/typecheck).
>
> Logs completos: [link]
>
> Próximo passo: abrir os logs, corrigir o erro apontado e rodar `npm run lint` e `npm run typecheck` localmente antes do próximo push.

E o Reviewdog adiciona comentários inline nas linhas problemáticas.

## Customização

Se quiser adaptar o workflow (mudar Node version, adicionar testes, etc), fork este repo e edite `.github/workflows/ci.yml`.

---

**Dúvidas?** Veja os arquivos deste repo como referência de setup funcional.
