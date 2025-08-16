# Produto Management Frontend

Sistema de gerenciamento de produtos desenvolvido em Angular.

## Como rodar o projeto

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm

### Passos
1. **Clone o projeto**
   ```bash
   git clone [URL_DO_REPOSITORIO]
   cd ProdutoManagementFront/produto-management
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure a API**
   - Abra `src/app/services/produto.service.ts`
   - Altere a URL base para sua API: `private apiUrl = 'http://localhost:PORTA_DA_API'`

4. **Execute o projeto**
   ```bash
   npm start
   ```

5. **Acesse no navegador**
   - http://localhost:4200

## Estrutura do projeto
- `src/app/components/produto/` - Componente principal de produtos
- `src/app/services/` - Serviços para comunicação com a API
- `src/app/models/` - Modelos de dados

## Tecnologias
- Angular 20
- Angular Material
- RxJS
