# Arquitectura Técnica y Guía de Desarrollo — Portal Unificado "Tuterritorio"

> Documento maestro de arquitectura. Stack definido:
> **Next.js (App Router) + TypeScript + Tailwind + Framer Motion** (Frontend) ·
> **Strapi autohospedado** (CMS headless aislado) ·
> **Vercel** detrás de **Cloudflare WAF/CDN** (perímetro) ·
> **Búsqueda full-text** de todo el sitio (solo en Inicio).
>
> Fecha: 2026-06-20 · Dominio objetivo: `www.tuterritorio.gov.co`

---

## 0. Contexto y objetivo

Hoy existen **múltiples carpetas/vistas independientes** (algunas posiblemente HTML estático, otras React — se confirmará al revisar los archivos). El objetivo es **unificarlas en una sola aplicación Next.js** con arquitectura desacoplada (headless), donde:

- El **ciudadano** solo toca el frontend (estático/renderizado en el borde).
- El **contenido** lo administran editores desde Strapi, **oculto de internet**.
- El **Header, menú institucional y Footer** se replican idénticos a "INICIO TUTERRITORIO" en todo el sitio.
- La **búsqueda** aparece únicamente en Inicio.
- El **Footer** queda limpio: solo Instagram.

Esta guía cubre los 5 pilares solicitados: Unificación/Frontend, Seguridad, Rendimiento, Accesibilidad y Despliegue.

---

## 1. Estructura de carpetas exacta (App Router)

```
tuterritorio/
├── app/
│   ├── (site)/                      ← Grupo de rutas con layout institucional global
│   │   ├── layout.tsx               ← Header + Footer globales (envuelve TODO el sitio público)
│   │   ├── page.tsx                 ← INICIO (única ruta con barra de búsqueda)
│   │   ├── loading.tsx              ← Skeleton de carga
│   │   ├── error.tsx                ← Error boundary amigable
│   │   ├── not-found.tsx            ← 404 institucional
│   │   │
│   │   ├── [seccion]/               ← Cada "carpeta/vista" antigua = una ruta
│   │   │   └── page.tsx
│   │   │   └── [slug]/page.tsx      ← Detalle dinámico (noticias, trámites, etc.)
│   │   │
│   │   ├── noticias/page.tsx        ← Ejemplos de secciones unificadas
│   │   ├── tramites/page.tsx
│   │   ├── dependencias/page.tsx
│   │   └── contacto/page.tsx
│   │
│   ├── api/
│   │   ├── search/route.ts          ← Endpoint de búsqueda (proxy seguro al índice)
│   │   └── revalidate/route.ts      ← Webhook ISR (lo llama Strapi al publicar)
│   │
│   ├── sitemap.ts                   ← Sitemap dinámico
│   ├── robots.ts                    ← robots.txt
│   ├── manifest.ts                  ← PWA / íconos
│   └── globals.css                  ← Tailwind base + tokens de diseño
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx               ← Encabezado institucional (logos + topbar)
│   │   ├── NavMenu.tsx              ← Menú de navegación (desktop + móvil)
│   │   ├── Footer.tsx               ← Footer limpio (solo Instagram)
│   │   └── SkipLink.tsx             ← Accesibilidad: "Saltar al contenido"
│   ├── search/
│   │   ├── SearchBar.tsx            ← Solo renderizado en Inicio
│   │   └── SearchResults.tsx
│   ├── ui/                          ← Botones, Card, Container, etc. (reutilizables)
│   └── motion/                      ← Wrappers de Framer Motion (animaciones existentes)
│
├── lib/
│   ├── cms.ts                       ← Cliente fetch a Strapi (server-only)
│   ├── navigation.ts               ← Fuente única del menú (desde CMS o config)
│   ├── search.ts                    ← Lógica de indexación/consulta
│   └── env.ts                       ← Validación de variables de entorno (Zod)
│
├── content/                         ← (opcional) MDX/JSON para contenido que no vive en CMS
├── public/
│   ├── fonts/                       ← Fuentes locales (self-hosted, sin Google Fonts CDN)
│   ├── logos/                       ← Logos institucionales (SVG/optimizados)
│   └── img/
│
├── middleware.ts                    ← Rate limiting + headers de seguridad + redirecciones
├── next.config.mjs                  ← Config (imágenes, headers, Turbopack)
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

**Clave de la unificación:** el grupo de rutas `(site)` con un único `layout.tsx` hace que **Header y Footer existan una sola vez** y se apliquen automáticamente a todas las páginas. Cada carpeta antigua se convierte en una ruta dentro de `app/(site)/`.

---

## 2. Pilar 1 — Unificación y Frontend

### 2.1 Cómo integrar las carpetas existentes
Estrategia general (la afinaré al ver tus archivos):

1. **Auditoría:** inventariar cada carpeta → ¿es HTML estático o React? ¿qué assets, scripts y animaciones usa?
2. **Normalización del layout:** extraer Header/Nav/Footer de "INICIO TUTERRITORIO" como componentes únicos en `components/layout/`.
3. **Portado por sección:**
   - HTML estático → convertir markup a JSX (atributos: `class`→`className`, `for`→`htmlFor`), mover CSS a `globals.css`/módulos o Tailwind, mover JS de animación a componentes cliente.
   - React existente → consolidar componentes en `components/` y registrar rutas en `app/(site)/`.
4. **Rutas:** una carpeta = una carpeta en `app/(site)/<seccion>/page.tsx`.
5. **Eliminar duplicados:** cada sección ya **no** lleva su propio header/footer — los hereda del layout global.

### 2.2 Header y navegación institucional (idénticos a Inicio)
- `Header.tsx` reproduce exactamente el encabezado de Inicio (logos, topbar de marca de gobierno).
- `NavMenu.tsx` es **funcional y dinámico**: el menú se alimenta de **una sola fuente** (`lib/navigation.ts`, idealmente desde Strapi). Cada ítem usa `<Link href>` de Next para navegación SPA instantánea.
- Estado activo automático con `usePathname()` para resaltar la sección actual.
- Menú móvil accesible (hamburguesa con `aria-expanded`, foco atrapado, cierre con `Esc`).

### 2.3 Barra de búsqueda exclusiva de Inicio
- `SearchBar.tsx` se importa **únicamente en `app/(site)/page.tsx`**, NO en el layout. Así nunca aparece en otras secciones.
- Conecta a `app/api/search/route.ts`, que consulta el índice full-text del sitio.

### 2.4 Footer limpio (solo Instagram)
- `Footer.tsx` replica el de Inicio pero **se eliminan enlaces redundantes** y deja **solo el ícono/enlace de Instagram** (con `aria-label="Instagram de Tuterritorio"` y `rel="noopener noreferrer"`).

### 2.5 Diseño ultra-responsivo + animaciones
- **Responsive:** Tailwind mobile-first con breakpoints `sm/md/lg/xl/2xl`; unidades fluidas (`clamp()`) para tipografía y espaciados; contenedor central con `max-w` para TVs de gran formato; pruebas en gama baja (lazy-load, sin layout shift).
- **Animaciones:** se respetan al 100% las existentes. Las basadas en CSS se conservan; las de JS se encapsulan en `components/motion/` con **Framer Motion** (`whileInView`, `AnimatePresence` para transiciones entre rutas). Respetar `prefers-reduced-motion` para A11y.

---

## 3. Pilar 2 — Seguridad extrema y resiliencia

### 3.1 Modelo de aislamiento (lo más importante)
```
  Ciudadano ──HTTPS──► Cloudflare (WAF + CDN + Rate limit)
                              │
                              ▼
                        Vercel (Next.js) ── solo SSG/ISR/Edge, sin secretos expuestos
                              │  (fetch server-only, token privado)
                              ▼
              ┌─────────── Red privada / VPC ───────────┐
              │   Strapi (CMS)  ◄──►  PostgreSQL (DB)    │   ← SIN IP pública
              │   Panel /admin accesible solo por VPN    │
              └──────────────────────────────────────────┘
```
- El **frontend no se conecta directo a la base de datos**. Solo consume la API de Strapi mediante un **token de solo lectura**, desde el servidor (nunca desde el navegador).
- **Strapi y PostgreSQL no tienen IP pública.** Viven en una VPC/red privada. El panel `/admin` se expone únicamente por **VPN / IP allow-list / túnel Cloudflare Tunnel**.
- El ciudadano **nunca** ve el CMS ni la DB.

### 3.2 OWASP en Next.js
- **SQL Injection:** no hay SQL directo desde el front. Strapi usa ORM parametrizado; la DB solo recibe consultas del CMS.
- **XSS:** React escapa por defecto. Prohibir `dangerouslySetInnerHTML`; si hay HTML del CMS, sanitizar con `DOMPurify`/`sanitize-html`. **CSP estricta** vía headers.
- **CSRF:** las acciones mutables van por Server Actions/endpoints con verificación de origen + tokens; cookies `SameSite=Strict`, `Secure`, `HttpOnly`.
- **Headers de seguridad** (en `next.config.mjs` o `middleware.ts`): `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`.
- **Validación de entrada:** `zod` en todo endpoint/Server Action.
- **Secretos:** solo en variables de entorno server-side; nunca en `NEXT_PUBLIC_*`.

### 3.3 Anti-DDoS / Rate limiting
- **Cloudflare** delante de todo: WAF (reglas OWASP), "Under Attack Mode", Bot Fight, caché de borde de páginas estáticas.
- **Rate limiting** en dos capas: reglas de Cloudflare + `middleware.ts` (p. ej. `@upstash/ratelimit`) para `/api/*`.
- Páginas estáticas servidas desde CDN absorben picos de tráfico sin tocar el origen.

---

## 4. Pilar 3 — Rendimiento, compilación y velocidad

### 4.1 Estrategia de renderizado
- **SSG por defecto** para páginas institucionales (carga en milisegundos desde CDN).
- **ISR** para contenido que cambia (noticias, trámites): `export const revalidate = 3600` y **revalidación on-demand** vía `app/api/revalidate/route.ts` que Strapi llama por **webhook** al publicar → contenido siempre fresco sin rebuild completo.
- **Server Components** por defecto; `"use client"` solo donde haya interactividad (búsqueda, menú móvil, animaciones).

### 4.2 Build & Bundling
- **Turbopack** en desarrollo (`next dev --turbopack`) para HMR rápido; build de producción minificado y con tree-shaking automático.
- Code-splitting por ruta automático; `next/dynamic` para componentes pesados; análisis con `@next/bundle-analyzer`.

### 4.3 Optimización de recursos
- **Imágenes:** `next/image` (AVIF/WebP, `sizes`, lazy-load, `priority` solo en LCP).
- **Fuentes locales:** `next/font/local` con las fuentes en `public/fonts/` (sin llamadas a Google Fonts; `display: swap`; subsetting).
- **Scripts:** `next/script` con `strategy="lazyOnload"`/`afterInteractive`.
- **Objetivo:** Core Web Vitals en verde (LCP < 2.5s, CLS < 0.1, INP < 200ms).

---

## 5. Pilar 4 — Accesibilidad (WCAG 2.1 / 2.2 AA)

- **HTML semántico:** `<header> <nav> <main id="main"> <footer>`, jerarquía de encabezados correcta.
- **Navegación por teclado:** todo operable con Tab/Enter/Esc; foco visible; `SkipLink` "Saltar al contenido"; foco atrapado en menú móvil.
- **Lectores de pantalla:** `aria-label`, `aria-current="page"` en la sección activa, `alt` descriptivo, `aria-live` para resultados de búsqueda.
- **Contraste AA** (≥ 4.5:1) y respeto a `prefers-reduced-motion`.
- **Verificación:** `eslint-plugin-jsx-a11y`, auditoría Lighthouse + axe DevTools, prueba real con lector de pantalla (NVDA).

---

## 6. Pilar 5 — Despliegue y dominio propio

### 6.1 Frontend en Vercel
1. Repo en GitHub/GitLab → importar en **Vercel**.
2. Variables de entorno (`STRAPI_URL`, `STRAPI_TOKEN`, `REVALIDATE_SECRET`) en el dashboard (server-side).
3. Cada push a `main` = build automático + preview en PRs.
4. ISR + caché de borde activos.

### 6.2 Backend (Strapi) — aparte y aislado
- En servidor propio del gobierno / VM en nube **sin IP pública**, con PostgreSQL en la misma red privada.
- Acceso a `/admin` solo por VPN o **Cloudflare Tunnel** con Access (allow-list).
- Backups automáticos de la DB.

### 6.3 DNS, perímetro y SSL (paso a paso)
1. Dominio `tuterritorio.gov.co` con nameservers apuntando a **Cloudflare** (Cloudflare como capa perimetral de todo el tráfico).
2. En Cloudflare DNS:
   - `CNAME  www  →  cname.vercel-dns.com`  (proxy **activado** — nube naranja).
   - Apex `tuterritorio.gov.co`: registro **A** según indique Vercel (o redirección a `www`).
3. En Vercel → Project → Domains: agregar `www.tuterritorio.gov.co` (Vercel verifica y emite **SSL automático** con renovación).
4. SSL/TLS en Cloudflare: modo **Full (strict)**, "Always Use HTTPS", HSTS.
5. WAF + Rate limiting + caché configurados en Cloudflare.
6. Resultado: HTTPS automático y renovable, tráfico filtrado por WAF, origen oculto.

---

## 7. Comandos base

```bash
# Crear el proyecto
npx create-next-app@latest tuterritorio --typescript --tailwind --eslint --app --src-dir=false

cd tuterritorio

# Dependencias clave
npm i framer-motion zod
npm i @upstash/ratelimit @upstash/redis        # rate limiting de /api
npm i isomorphic-dompurify                       # sanitizar HTML del CMS
npm i -D @next/bundle-analyzer eslint-plugin-jsx-a11y

# Desarrollo (Turbopack)
npm run dev -- --turbopack

# Build de producción
npm run build && npm start
```

---

## 8. Próximos pasos (cuando me pases las carpetas)

1. **Auditoría** de cada carpeta (tecnología, assets, animaciones, dependencias).
2. Confirmar el **inventario de rutas** (mapa carpeta → ruta de App Router).
3. Extraer Header/Nav/Footer de "INICIO" como componentes globales.
4. Portar sección por sección, preservando animaciones.
5. Conectar Strapi (modelado de contenido + navegación + búsqueda).
6. Endurecer seguridad (CSP, headers, rate limit) y configurar Cloudflare + Vercel + DNS.
7. Auditorías finales: Lighthouse (Perf/A11y/SEO) y revisión de seguridad.

> **Para empezar:** comparte las carpetas/vistas (especialmente la de "INICIO TUTERRITORIO"). Con ellas definimos la estrategia exacta de migración y el mapa de rutas real.

---

## 9. ANÁLISIS DE "INICIO TUTERRITORIO" (plantilla canónica) — recibido 2026-06-20

**Origen:** `Downloads/INICIO TUTERRITORIO/design_handoff_tuterritorio/` — es un **design handoff hifi en HTML/CSS/JS plano** con estilos inline + design tokens. NO es código de producción: hay que **recrearlo** en Next.js/React (es exactamente lo que dice su README). Contiene 2 páginas: `LandingPage Tuterritorio - Inicio.html` y `PQRSD.html`.

### 9.1 Entidad real
Tuterritorio = operador del **catastro multipropósito de Valledupar, Cesar**. Sigue línea visual **gov.co**. Dominio de correos institucionales ya es `@tuterritorio.gov.co`. NIT 901996731-8.

### 9.2 Header (3 franjas) — plantilla global
1. **Barra gov.co** (azul `#00339A`): logo `govco-white.png` + "Iniciar Sesión" / "Registrarse".
2. **Fila de marca** (blanco): `logo-tuterritorio-v.png` (64px) + separador + `logo-catastro-vpar.png`, y a la derecha el **buscador** (`.gc-search`).
3. **Nav sticky** (`.mainnav`, `#fafbfc`, sticky top): **Inicio · Nosotros · Servicios · Recursos · Transparencia · Contactos**.
   - "Nosotros" con dropdown en hover: *Acerca de la Oficina*, *Nuestro Equipo*.
   - Subrayado animado `scaleX` (hover azul, activo **ámbar** + bold), scroll-spy `.on`.

> ⚠️ **Decisión de migración del menú:** hoy los ítems apuntan a anclas de la misma página (`#top`, `#visor`, `#tramites`, `#contacto`) — son placeholders. Para hacerlo "funcional y dinámico hacia las demás páginas", estos deben convertirse en **rutas reales** (`/`, `/nosotros`, `/servicios`, `/recursos`, `/transparencia`, `/contactos`). **Necesito las carpetas correspondientes para mapear cada ítem a su sección.**

### 9.3 Buscador (`.gc-search`)
- Hoy vive en la **fila de marca del header** (no en el hero), oculto en `≤860px`. Tiene segmento "General ▾", input "Realiza búsqueda…", botón de voz y botón lupa. **No es funcional** (solo maquetado).
- **Requisito a aplicar:** la búsqueda debe verse **solo en INICIO**. → Se extrae del header global a un componente `SearchBar` que solo se monta en `app/(site)/page.tsx`, y se cablea a `/api/search` (full-text de todo el sitio).

### 9.4 Footer
- Fondo verde `#2E5E38` + **tarjeta blanca flotante** (945px, `margin-top:-66px`) con logo, escudos (Valledupar, Colombia, bandera), "Sede Principal", datos de contacto, **redes (Instagram, X, Facebook)** y **3 enlaces de política** (Privacidad, Editoriales, Mapa de sitio). Barra inferior gov.co (`co-colombia.png` + `govco-white.png`).
- **Requisito a aplicar (footer limpio):** conservar **solo Instagram**; **eliminar** X, Facebook y los 3 enlaces de políticas redundantes. El resto idéntico.

### 9.5 Animaciones a preservar (todas vanilla JS/CSS hoy)
- `reveal` (fade + translateY) vía `IntersectionObserver` → portar con Framer Motion `whileInView` o conservar IO en un hook cliente.
- **Scroll-spy** del nav (`.on`).
- **Contadores animados** (`.vp-count[data-to]`, `requestAnimationFrame`).
- **Comunas interactivas**: hotspots `.cm-dot` + tooltip `.cm-tip` reposicionable (datos en objeto `CM`, 6 comunas) → componente cliente `VisorGeografico`.
- Blobs flotantes del hero (`tt-floatA/B`), pulsos `cm-ping`, `vp-pop`.
- ✅ Ya respeta `prefers-reduced-motion` — mantener.

### 9.6 Tokens de diseño (ya definidos en `:root`)
Reproducir como **tema de Tailwind + variables CSS globales**. Colores oficiales: verde `#4E8654`, azul `#3B85A5`, ámbar `#F0B63B`, navy `#0C222F`. Tipografía **Inter** 400–800.
> ⚠️ **Ajuste vs. handoff:** el README pide cargar Inter desde **Google Fonts**. Para un portal `.gov.co` (rendimiento + privacidad + sin dependencia de CDN externo) **se auto-hospeda Inter con `next/font/local`** en `public/fonts/`. (Mejora sobre el handoff, no contradice el diseño.)

### 9.7 Segunda página incluida: PQRSD
- Reutiliza header + footer. Hero "Radica tu PQRSD" + formulario (tipo de solicitud, datos del ciudadano, asunto, descripción, autorización Ley 1581/2012).
- Hoy envía por **FormSubmit** a `sistemas@atghub.co`. → En producción: **Route Handler propio** (`app/api/pqrsd/route.ts`) con validación `zod`, anti-spam y envío de correo. Es un formulario → vector de ataque: aplicar rate-limit + CSRF + sanitización.

### 9.8 Assets disponibles
32 imágenes en `assets/` (logos Tuterritorio, escudos, gov.co, mapas POT y comunas, fotos Valledupar, news/campaign). → Optimizar con `next/image`; mover a `public/`.

### 9.9 Mapeo concreto de componentes (de este handoff a Next.js)
| Handoff | Componente Next.js | Ámbito |
|---|---|---|
| Barra gov.co + marca + nav | `components/layout/Header.tsx` + `NavMenu.tsx` | Global (layout) |
| `.gc-search` | `components/search/SearchBar.tsx` | **Solo Inicio** |
| Hero | `app/(site)/page.tsx` (sección) | Inicio |
| Enlaces de interés (filas 01/02/03) | `components/home/EnlacesInteres.tsx` | Inicio |
| Visor geográfico + tooltip comunas | `components/home/VisorGeografico.tsx` (`"use client"`) | Inicio |
| Footer verde + tarjeta + barra gov.co | `components/layout/Footer.tsx` (solo Instagram) | Global (layout) |
| PQRSD | `app/(site)/pqrsd/page.tsx` + `app/api/pqrsd/route.ts` | Ruta propia |

### 9.10 Pendiente para continuar
Para volver el menú **funcional hacia las demás páginas** necesito las carpetas de: **Servicios**, **Recursos**, **Transparencia** y **Contactos**. Con cada una confirmo: tecnología, assets, animaciones y la ruta destino del ítem de menú.

---

## 10. ESTADO DE IMPLEMENTACIÓN (en código)

Proyecto Next.js 15 (App Router) + TS corriendo en `localhost:3000`. Páginas construidas:

| Ruta | Origen | Estado |
|---|---|---|
| `/` | INICIO handoff | ✅ Hero, Enlaces, Visor comunas interactivo, buscador (solo aquí) |
| `/pqrsd` | INICIO handoff | ✅ Form + endpoint propio `/api/pqrsd` (valida + honeypot) |
| `/nosotros` | NOSOTROS handoff | ✅ Banner, Quiénes somos (parallax), 6 Funciones, Misión/Visión, 5 Objetivos, 4 Etapas, Instalaciones (video placeholder) |
| `/nosotros/equipo` | NOSOTROS handoff | ✅ Hero red de personas (bob+dash), Liderazgo (2), Equipo técnico (4 áreas, avatares placeholder) |
| `/servicios` | SERVICIO handoff | ✅ Banner + grilla de 17 trámites/productos con panel de documentos al hover/focus |
| `/recursos/normativas` | RECURSOS handoff | ✅ Hero + filtros por categoría + 13 normas con enlace a documento |
| `/recursos/glosario` | RECURSOS handoff | ✅ Hero + buscador (sin acentos) + filtro A–Z + 25 términos expandibles |
| `/noticias` | NOTICIAS handoff | ✅ Cabecera + chips de filtro por categoría + noticia destacada + grilla "Más noticias" |
| `/contactos` | CONTACTENOS handoff | ✅ Hero animado + formulario (endpoint `/api/contacto`) + sede + mapa Google embebido |

**Header/Footer globales** (en `app/layout.tsx`): buscador solo en `/`, footer limpio (solo Instagram). **Menú**: se conserva el de INICIO; el desplegable Nosotros enlaza a `/nosotros` y `/nosotros/equipo`; resto de ítems a anclas de Inicio (`/#tramites`, `/#visor`, `/#contacto`). Animaciones de scroll, barra de progreso y parallax en `components/motion/RevealManager.tsx`.

### Decisiones/pendientes registrados
- **Menú canónico:** el handoff de NOSOTROS propone desplegables extra en *Servicios* y *Transparencia*. Se mantuvo el menú de INICIO (plantilla del usuario). **Decidir** al integrar esas secciones.
- **Fuente Inter** auto-hospedada vía `next/font/google` (sin llamadas en runtime).
- **Placeholders a reemplazar** (idealmente desde el CMS): fotos y nombres del equipo, video de instalaciones, foto líderes.
- El handoff NOSOTROS estaba pensado para **React 19 + Vite + Tailwind v4**; se recreó en este proyecto Next.js (equivalente y válido).
