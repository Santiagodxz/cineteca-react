# Pasos realizados — Línea base Cineteca

Documento que resume, en lenguaje claro, qué se hizo en cada paso de la guía `docs/Cinética BaseLine.md` y el estado actual de cada uno.

---

## Paso 1 · Prerrequisitos

**Qué hicimos:** confirmamos que el entorno tenía Node (LTS activo), `corepack` habilitado, `pnpm` instalado y `git` listo. `corepack` permite que el proyecto fije su propia versión de `pnpm` desde `package.json`, así todos usamos la misma.

**Estado:** ✅ listo.

---

## Paso 2 · La credencial de TMDB

**Qué hicimos:** creamos una cuenta de práctica en TMDB y obtuvimos el **API Read Access Token** (el de lectura). Se valida con un `curl` al endpoint `/configuration`: si responde `200`, la credencial sirve.

> Detalle clave: la credencial va a quedar pública en el bundle porque Vite expone al cliente cualquier variable con prefijo `VITE_`. Eso es aceptable solo porque es de solo lectura, de una cuenta de práctica y rotable en un minuto.

**Estado:** ✅ listo (la credencial real vive en `.env.local`, que no se commitea).

---

## Paso 3 · Crear el proyecto

**Qué hicimos:** generamos el andamio con `pnpm create vite@latest cineteca --template react-ts`, borramos archivos de la plantilla (`App.css`, logos), dejamos `App.tsx` con un `<h1>Cineteca</h1>`, vaciamos `src/index.css`, pusimos `lang="es"` y un `<title>` propio en `index.html`, y fijamos `packageManager`, `engines` y los scripts (`dev`, `build`, `lint`, `test`, etc.). Primer commit: `chore: scaffold vite + react + ts`.

**Estado:** ✅ listo.

---

## Paso 4 · TypeScript en modo severo

**Qué hicimos:** instalamos TypeScript 6.0.3 (no 7, porque `typescript-eslint` aún no lo admite), activamos banderas estrictas en `tsconfig.app.json` (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`, etc.) y conectamos Vite al alias `@/` con `vite-tsconfig-paths`.

**Estado:** ✅ listo. `pnpm check-types` pasa.

---

## Paso 5 · Dependencias

**Qué hicimos:** instalamos cuatro bloques de dependencias:

- **Runtime:** React Router 8, TanStack Query, axios, zod, react-hook-form, TanStack Virtual, lucide-react, react-error-boundary, clsx, tailwind-merge, class-variance-authority.
- **Estilos:** Tailwind 4 con su plugin de Vite.
- **Pruebas:** Vitest, Testing Library, MSW, axe-core, vite-tsconfig-paths.
- **Calidad:** ESLint 10, typescript-eslint, Prettier, plugins de React Hooks y accesibilidad, plugin de Query, Husky y lint-staged.

También creamos `scripts/check-versions.sh`, que compara lo instalado contra el registry y avisa si hay deprecados. Commit: `chore: add project dependencies`.

**Estado:** ✅ listo.

---

## Paso 6 · Tailwind y los tokens del tema

**Qué hicimos:** montamos Tailwind 4 vía plugin de Vite (CSS-first, sin archivo de config) y definimos en `src/index.css` los **tokens semánticos** del proyecto con `@theme`: superficies, tinta, marca, peligro, estados del catálogo (`status-released`, `status-unreleased`, `status-unknown`), tamaño de tipografía para la valoración, área táctil mínima y aspect ratio del poster. También respetamos `prefers-reduced-motion` y creamos la utilidad `cn` (`src/presentation/lib/cn.ts`) que combina `clsx` con `tailwind-merge`.

**Estado:** ✅ listo.

---

## Paso 7 · ESLint y Prettier

**Qué hicimos:** escribimos `eslint.config.js` en JavaScript plano con las reglas estrictas de TypeScript, los plugins de React Hooks y accesibilidad, el plugin de TanStack Query y Prettier al final (para apagar lo que Prettier decida). La parte importante son las **reglas de arquitectura** que prohíben, vía `no-restricted-imports`:

- A `src/domain/`: importar React, axios, TanStack, react-hook-form o cualquier capa de fuera.
- A `src/application/`: importar la presentación o la infraestructura.
- A todo el proyecto salvo `src/infrastructure/http/`: importar axios.

Hicimos la **demostración de 60 segundos**: meter `useState` en `domain/` debe hacer fallar al linter. Commit: `feat: step 7 - ESLint architecture rules, Prettier config, domain dependency guard`.

**Estado:** ✅ listo. `pnpm lint` pasa y el dominio está protegido.

---

## Paso 8 · Vitest, Testing Library y MSW

**Qué hicimos:** configuramos `vitest.config.ts` con entorno `jsdom`, archivo de setup y reporte de cobertura con v8. En `vitest.setup.ts` montamos MSW con `onUnhandledRequest: 'error'` (cualquier request sin simular rompe el test), registramos `@testing-library/jest-dom`, hacemos `cleanup` automático y stubbeamos `matchMedia` y `ResizeObserver` (jsdom no los trae y el tema/virtualizador los piden). En `src/test/msw/server.ts` dejamos `setupServer()` vacío: cada simulación se añade con la feature que la necesite. Commit: `feat: step 8 - Vitest, Testing Library, MSW and smoke test`.

**Estado:** ✅ listo. `pnpm test` pasa con la prueba de humo.

---

## Paso 9 · La estructura de carpetas

**Qué hicimos:** creamos las carpetas de la arquitectura limpia (`domain`, `application/ports`, `infrastructure/{http,api,storage}`, `presentation/{routes,components/{ui,feature},hooks,providers,copy,lib}`, `config`, `test/msw`). Quedan vacías esperando el primer archivo del dominio.

**Regla de bolsillo:** si un archivo de `domain/` necesitara instalar algo para funcionar, está en la carpeta equivocada.

**Estado:** ✅ listo (carpeta vacías creadas; sin archivos de dominio todavía, eso pertenece a la guía del proyecto, no a la línea base).

---

## Paso 10 · La configuración, validada

**Qué hicimos:** escribimos `src/config/env.ts` con un schema de Zod que valida al arrancar las variables de TMDB. Si falta algo, la app muere **al iniciar** con un mensaje en español, no tres pantallas después con un error confuso. Creamos `.env.example` (commiteable, con valores de ejemplo) y dejamos que `.env.local` siga siendo el archivo real (no commiteable). Añadimos `coverage`, `.env.local` y `.env*.local` al `.gitignore`.

**Estado:** ✅ listo.

---

## Paso 11 · El esqueleto de la aplicación

**Qué hicimos:** armamos los cuatro archivos base sin funcionalidad dentro:

- `src/main.tsx`: importa el CSS, monta React en modo estricto y envuelve la app en los proveedores.
- `src/presentation/providers/app-providers.tsx`: monta TanStack Query y `react-error-boundary`.
- `src/presentation/routes/router.tsx`: enrutador con una ruta raíz, layout común y ruta 404.
- `src/presentation/routes/root-layout.tsx`: cabecera, pie con atribución a TMDB y el `<Outlet/>`.

Tres decisiones tomadas desde el día uno: **modo estricto de React**, **límite de errores de render** y **atribución a TMDB en el pie** (es un requisito legal de la API, no decoración).

**Estado:** ✅ listo. `pnpm dev` sirve el esqueleto con cabecera y pie.

---

## Paso 12 · El gate de calidad

**Qué hicimos:** creamos `scripts/verify.sh` que corre, en orden: `pnpm format:check`, `pnpm lint`, `pnpm check-types`, `pnpm test`, `pnpm build` y el chequeo de versiones. Tiene dos modos: `--quick` (lo que va en `pre-commit`, ~10 s) y `--full` (lo que va en `pre-push` y en CI, ~90 s). Configuramos Husky con dos hooks (`pre-commit` corre lint-staged y el gate rápido; `pre-push` corre el gate completo), añadimos la sección `lint-staged` a `package.json` para arreglar y formatear solo los archivos del commit, y escribimos `.github/workflows/ci.yml` para que el CI corra el mismo `verify.sh --full` con la credencial de TMDB como secreto.

> Idea central: **el gate nunca se debilita**. Si se pone lento, se arregla la causa. Quitar un paso es perderlo.

**Estado:** ⏳ pendiente. Falta crear `scripts/verify.sh`, configurar los hooks de Husky y el workflow de CI.

---

## Paso 13 · Cerrar la línea base

**Qué hicimos:** este es el paso final. Consiste en correr `bash scripts/verify.sh --full`, hacer commit de cierre con el mensaje `chore: project baseline — tooling, theme, tests and quality gate`, pushear y escribir un `README.md` corto que explique qué es el proyecto, cómo obtener la credencial y cómo correr cada comando. Después de este paso empieza el proyecto de verdad: el primer archivo nuevo pertenece al **dominio**.

**Estado:** ⏳ pendiente.

---

## Resumen rápido

| # | Paso | Estado |
|---|---|---|
| 1 | Prerrequisitos | ✅ |
| 2 | Credencial TMDB | ✅ |
| 3 | Crear proyecto | ✅ |
| 4 | TypeScript estricto | ✅ |
| 5 | Dependencias | ✅ |
| 6 | Tailwind y tokens | ✅ |
| 7 | ESLint y Prettier | ✅ |
| 8 | Vitest, RTL, MSW | ✅ |
| 9 | Estructura de carpetas | ✅ |
| 10 | Config validada | ✅ |
| 11 | Esqueleto de la app | ✅ |
| 12 | Gate de calidad | ⏳ |
| 13 | Cerrar línea base | ⏳ |

**Próximo paso concreto:** escribir `scripts/verify.sh`, los hooks de Husky y el workflow de CI para cerrar el paso 12 y, con eso, poder hacer el commit final del paso 13.

---

# Proyecto Cineteca (versión simplificada)

> **Nota:** La guía profesional (`docs/Cinética BaseLine.md` y `docs/Cineteca.md`) propone una arquitectura muy completa (Clean Architecture, Zod, TanStack Query, cobertura 100% en dominio, etc.). Para aprender React desde cero, simplifiqué el proyecto. Esta sección documenta lo que vamos construyendo, paso a paso, en orden cronológico.

---

## Fase 1 · Cliente TMDB

**Qué hicimos:** creamos el archivo `src/api/tmdb.ts` que sabe hablar con la API de TMDB, y modificamos `App.tsx` para llamar a `getTrending()` y mostrar la lista cruda de títulos en pantalla.

### Conceptos que aprendimos

- **API REST:** una URL a la que le hacemos una petición y nos devuelve datos (generalmente en JSON). TMDB expone varias: una para "tendencias de la semana", otra para "búsqueda", otra para "detalle de película", etc.
- **axios:** una librería que facilita hacer peticiones HTTP desde JavaScript. Es como `fetch` pero con menos código repetitivo.
- **axios.create():** crea un "cliente" preconfigurado con la URL base y los parámetros por defecto (en nuestro caso, la API key y el idioma). Así no tenemos que escribir la URL completa ni la key en cada llamada.
- **query params (`?api_key=...&language=...`):** información extra que se manda en la URL. TMDB usa la API key v3 de esta forma.
- **TypeScript `interface`:** definimos la forma de un objeto "película" para que TypeScript nos avise si escribimos mal un campo. `id` es número, `title` es texto, etc.
- **`Promise<Movie[]>`:** le decimos a TypeScript que `getTrending()` va a devolver una promesa que, cuando se resuelva, tendrá un array de películas.
- **`useState`:** hook de React que guarda un valor y, cuando cambia, vuelve a renderizar el componente. Lo usamos para guardar la lista de películas y para el flag `loading`.
- **`useEffect`:** hook que ejecuta código cuando el componente se monta (aparece en pantalla). Lo usamos para llamar a TMDB una sola vez al iniciar.
- **`.then().finally()`:** cuando la promesa termina (con éxito o error), `.then()` recibe los datos y `.finally()` se ejecuta siempre (lo usamos para apagar el loading).

### Archivos

**`src/api/tmdb.ts`** (nuevo):
```typescript
import axios from 'axios'

const API_KEY = '4f6baa3485e32af2c54e8dff814ff2cf'
const BASE_URL = 'https://api.themoviedb.org/3'

export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
}

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'es-ES',
  },
})

export async function getTrending(): Promise<Movie[]> {
  const response = await api.get('/trending/movie/week')
  return response.data.results
}
```

**`src/App.tsx`** (sustituye al contador anterior):
```tsx
import { useEffect, useState } from 'react'
import { getTrending, type Movie } from './api/tmdb'

function App() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTrending()
      .then(setMovies)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="p-8">Cargando películas...</p>

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Cineteca</h1>
      <ul className="space-y-2">
        {movies.map(m => (
          <li key={m.id} className="border-b pb-2">
            {m.title} <span className="text-gray-500">({m.release_date})</span>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
```

**Estado:** ✅ listo. Al abrir `pnpm dev` se ven los títulos de las películas trending de la semana en español.

### Decisiones que tomamos (y por qué)

- **Usar la API Key v3 como query param** en vez del token v4 (Bearer). Tu token tiene 32 caracteres hexadecimales, formato típico de la v3. Es más simple para aprender.
- **`language: 'es-ES'`** para que TMDB nos devuelva títulos y sinopsis en español.
- **`/trending/movie/week`** es el endpoint que la guía del proyecto sugiere para la pantalla de inicio.
- **Por ahora solo 7 campos** del JSON de TMDB (ignoramos pósters, géneros, etc.). Iremos agregando conforme los necesitemos.
- **Pantalla fea a propósito:** una `<ul>` con texto, sin estilos de tarjeta todavía. Primero confirmamos que los datos llegan; luego los hacemos bonitos.

---

### Próximo paso (Fase 2)

**Crear el componente `MovieCard.tsx`** — una tarjeta reutilizable que muestra el póster, el título y el año. Todavía sin navegación ni interactividad, solo presentación.