# Cineteca

App web para descubrir películas. Proyecto de curso de React.

## Requisitos

- Node.js 20 o superior
- pnpm (`npm install -g pnpm`)

## Instalación

```bash
pnpm install
```

## Comandos

```bash
pnpm dev      # servidor de desarrollo (http://localhost:5173)
pnpm build    # compilar para producción (queda en /dist)
pnpm preview  # previsualizar el build de producción
```

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Axios (para llamadas a la API)

## Estructura

```
src/
├── App.tsx       ← componente principal
├── main.tsx      ← punto de entrada
├── index.css     ← estilos (Tailwind)
└── components/   ← tus componentes
```
