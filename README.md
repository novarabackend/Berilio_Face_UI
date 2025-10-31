# Berilio Face UI

Monorepo frontend para Berilio Face con tres aplicaciones:

- `apps/admin-dashboard/`: aplicación Angular (routing, SCSS) para administradores y supervisores.
- `apps/employee-pwa/`: aplicación Angular PWA (con `@angular/pwa`) para registro de asistencia.
- `apps/marketing-site/`: sitio de marketing generado con Vite + React.

## Requisitos iniciales

- Node.js 20+
- npm (incluido con Node) o el gestor que prefieras (pnpm, yarn)

## Siguientes pasos sugeridos

1. Ejecutar los comandos de desarrollo en cada app según corresponda.
2. Configurar tooling compartido (lint, formatting, pruebas end-to-end, CI/CD).
3. Conectar con el backend mediante clientes generados (OpenAPI/Swagger) o tipos compartidos.

### Comandos rápidos

```bash
# Admin dashboard (Angular)
cd apps/admin-dashboard
npm start

# Employee PWA (Angular service worker)
cd apps/employee-pwa
npm start

# Marketing site (Vite + React)
cd apps/marketing-site
npm run dev
```

> Nota: Cada proyecto mantiene su propio `package.json`. Evalúa usar workspaces (pnpm, Nx, turborepo) si necesitas orquestar tareas entre apps.
