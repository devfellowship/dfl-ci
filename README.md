# dfl-ci — Revisor de PR automático

Bot que revisa Pull Requests no GitHub: comenta **nas linhas** dos arquivos alterados (como um revisor de verdade) e só desbloqueia o merge quando você aprovar.

Funciona como **workflow reutilizável** (`workflow_call`): você adiciona um arquivo YAML pequeno no seu repo e o resto roda no repositório DLF-CI.

---

## Instalação (no seu projeto)

### 1. Crie o workflow

Crie o arquivo **`.github/workflows/ci.yml`** no seu repositório:

```yaml
name: CI

on:
  pull_request:

permissions:
  contents: read
  pull-requests: write

jobs:
  review:
    uses: SamuelStefano/DLF-CI/.github/workflows/ci-reusable.yml@main
    secrets: inherit
```

Isso chama o workflow do DLF-CI (`workflow_call`). Nada mais é obrigatório no seu repo — o bot usa os scripts daqui.

### 2. O que seu projeto precisa

- **package.json** com os scripts: `"lint"` e `"typecheck"` (ex.: `eslint .` e `tsc --noEmit`)
- **package-lock.json** commitado (para `npm ci` no CI)
- (Opcional) **eslint.config.js** — se não tiver, o bot ainda roda as checagens de arquitetura; para lint completo, use um config compatível ou copie o [deste repo](eslint.config.js).

### 3. Testar

Faça commit, push e abra um PR. O workflow vai rodar e o bot vai comentar nos arquivos alterados.

---

## O que o bot faz

- **Comenta nas linhas** em **Files changed** (comentários por linha, como um revisor).
- **Resumo na review**: coisas de "arquivo inteiro" (ex.: arquivo grande, atomic design) vão no corpo da review, não em dezenas de linhas.
- **Merge**: o bot envia uma review (COMMENT ou REQUEST_CHANGES). O merge só é liberado quando um revisor humano aprovar.

---

## O que ele verifica

### Código limpo
| Verificação | Ação |
|-------------|------|
| Arquivo &gt; **200 linhas** | Pedir para dividir (padrão DLF) |
| **Comentários** no código | Listar linhas e pedir para remover |
| **Código comentado** | Pedir para remover |
| **TODO / FIXME** | Pedir para resolver antes do merge |
| **console.log** | Pedir para remover; sugerir Toast em erros |
| **Imports** não utilizados | Listar e pedir para remover |

### Organização (Atomic Design)
| Verificação | Ação |
|-------------|------|
| Constante &gt; **10 linhas** | Sugerir arquivo em `/consts` |
| Vários componentes no mesmo arquivo | Sugerir separar |
| Types/interfaces no componente | Sugerir mover para `/interfaces` |
| Componente na pasta errada | Sugerir atoms / molecules / organisms |

### Funções e hooks
| Verificação | Ação |
|-------------|------|
| Função &gt; **30 linhas** | Sugerir dividir |
| Handlers repetidos | Sugerir abstrair |
| Muitos `useState` (4+) | Sugerir custom hook |
| Hook fora de `/hooks` | Pedir para mover |

### Next.js e dados
| Verificação | Ação |
|-------------|------|
| `<a>` em vez de `<Link>` | Pedir para trocar |
| `<img>` em vez de `<Image>` | Pedir para trocar |
| Supabase no componente | Pedir mover para `/lib` |
| `fetch` no componente | Pedir centralizar em `/lib` |

---

## Estrutura de pastas sugerida

```
seu-projeto/
├── components/
│   ├── atoms/       ← Button, Input
│   ├── molecules/   ← SearchBar, FormField
│   ├── organisms/   ← Header, UserProfile
│   └── ui/          ← design system
├── hooks/           ← custom hooks
├── interfaces/      ← types e interfaces
├── consts/          ← constantes
├── lib/
│   ├── supabase/    ← funções de banco
│   └── api/         ← funções de API
└── app/             ← páginas Next.js
```

---

## Personalização

- **Limites (linhas, hooks, etc.)**: os scripts de checagem ficam neste repositório. Se quiser mudar limites, você pode copiar a pasta `.github/workflows/checks/` para o seu repo; o bot usa os arquivos locais quando existem.
- **ESLint**: veja **[CUSTOMIZATION.md](CUSTOMIZATION.md)** para regras e opções.

---

## GitHub Team (futuro)

Com **GitHub Team**, dá para usar **Required Workflows** na organização e fazer esse review rodar em todos os repos sem cada um criar o `ci.yml`. Configuração única.

---

## Problemas comuns

| Problema | O que fazer |
|----------|-------------|
| Bot não comenta no PR | Verificar se `.github/workflows/ci.yml` e `package-lock.json` estão commitados. Ver **Actions** no GitHub e abrir os logs do workflow. |
| CI passa mas tem erros | Avisos/sugestões não falham o job; apenas erros de lint/typecheck falham. |
| Quero usar em outro branch | Troque `@main` por `@sua-branch` no `uses:` do workflow. |

---

<sub>🤖 DLF Code Review Agent — workflow reutilizável (workflow_call)</sub>
