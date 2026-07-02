# 🛡️ Auditoría de Seguridad Defensiva — Tuterritorio (tuterritorio.gov.co)

**Fecha:** 2026-07-02
**Alcance:** repositorio `TUTERRITORIO-LANDING PAGE` (Next.js 15.5.19 desplegado en Vercel)
más lineamientos para la capa self-hosted (Docker, n8n, Cloudflare Tunnel), que **no está
versionada en este repositorio**.
**Marco normativo:** Resolución MinTIC 1519 de 2020 (Anexo 3 — Condiciones Mínimas Técnicas
y de Seguridad Digital), Ley 1581 de 2012 (Habeas Data), Ley 1712 de 2014 (Transparencia).

**Contexto previo:** existe una auditoría anterior documentada en `SECURITY.md` con
correcciones ya aplicadas (fail-closed del secreto de sesión, expiración de token,
`timingSafeEqual`, rate limiting, cabeceras de seguridad, endpoint de diagnóstico
protegido). Esta auditoría **verificó ese estado** y reporta lo que sigue pendiente.

> Estado de los hallazgos: los marcados **[APLICADO 2026-07-02]** se corrigieron en la
> rama `staging` como parte de esta misma auditoría.

---

## Área 1 — Cabeceras de seguridad HTTP

Estado general: **bueno**. En `next.config.mjs` están presentes CSP, HSTS (2 años,
`includeSubDomains; preload`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, y
`poweredByHeader: false` (no se filtra `X-Powered-By`; Vercel no expone versión en `Server`).

### H-01 · 🟡 Media — CSP permite `'unsafe-inline'` en `script-src`
- **Ubicación:** `next.config.mjs` (definición de `csp`)
- **Descripción:** `script-src 'self' 'unsafe-inline' …` anula gran parte del valor
  anti-XSS de la CSP: si un atacante logra inyectar HTML, sus `<script>` inline ejecutan.
  El Anexo 3 (num. 14) exige CSP como cabecera de protección efectiva.
- **Remediación:** migrar a **CSP con nonce** usando `middleware.ts` de Next (nonce por
  petición propagado con la cabecera `x-nonce`). Verificar que Google Translate, el mapa
  embebido y Vercel Analytics sigan cargando. Valorar `strict-dynamic` como paso intermedio.

### H-02 · 🟢 Baja — `img-src https:` + optimizador de imágenes abierto a cualquier host
- **Ubicación:** `next.config.mjs` (`img-src` y `remotePatterns: [{ hostname: "**" }]`)
- **Descripción:** cualquier URL https puede cargarse como imagen y pasar por
  `/_next/image`: (a) abuso de ancho de banda/costo usando el dominio como proxy de
  imágenes; (b) contenido de terceros servido "desde" el origen.
- **Remediación:** restringir `remotePatterns` a los hosts reales (p. ej.
  `*.public.blob.vercel-storage.com` y los medios usados en noticias) y reducir
  `img-src` a `'self' data: blob:` + esos hosts.

### H-03 · ⚪ Informativa — `X-XSS-Protection` no configurada **[APLICADO 2026-07-02]**
- **Ubicación:** `next.config.mjs`
- **Descripción:** el Anexo 3 num. 14 lista textualmente `X-XSS-Protection`. La cabecera
  está deprecada (el auditor XSS de los navegadores fue retirado por crear
  vulnerabilidades), pero conviene fijarla explícitamente en su valor seguro por
  cumplimiento documental.
- **Remediación aplicada:** se añadió `X-XSS-Protection: 0` con comentario explicativo.
  `Public-Key-Pins` (también listada en la norma) está retirada de los navegadores:
  queda documentada como excepción en `SECURITY.md`, no se implementa.

---

## Área 2 — Gestión de secretos y configuración

### H-04 · ✅ Sin secretos en código ni en historial (verificado)
- Se barrió el código y **el historial completo de git**: el único archivo `.env*` que ha
  existido en commits es `.env.example` (plantilla sin valores reales, commit inicial
  `fc95465`). `.gitignore` excluye `.env*` y `*.pem`. No hay API keys, tokens ni
  contraseñas hardcodeadas; todo se lee de variables de entorno.

### H-05 · ⚪ Informativa — La capa self-hosted (Docker/n8n/Tunnel) no es auditable desde este repo
- **Descripción:** no hay `docker-compose.yml`, configuración de `cloudflared` ni de n8n
  versionados aquí. El sitio público corre en Vercel.
- **Checklist para ese stack:**
  1. Versionar la configuración de infraestructura en un repo **privado** separado, con
     secretos vía `docker secrets` o `.env` fuera de git — nunca en el YAML.
  2. En `docker-compose`: no publicar puertos al host para servicios internos; usar redes
     internas de Docker y exponer **solo** vía `cloudflared`. Contenedores sin
     `privileged: true`, con `read_only: true` donde aplique y usuario no-root.
  3. **Cloudflare Access** (Zero Trust) delante de n8n, Mayan y cualquier panel:
     autenticación en el borde, allow-list de correos `@tuterritorio.gov.co`.
  4. El origen **sin puertos abiertos a internet** (el túnel es saliente); `nmap` externo
     periódico para verificarlo.
  5. n8n: `N8N_BLOCK_ENV_ACCESS_IN_NODE=true`, sin registro público de usuarios,
     actualizado con frecuencia (ha tenido CVEs).

---

## Área 3 — Validación y saneamiento de entradas

Estado general: **bueno**. `contacto` y `pqrsd` validan obligatorios y formato de correo
en servidor, escapan HTML (`esc()`), usan honeypot, rate limit y errores genéricos
(Anexo 3 num. 5, 15 y 21 ✓). No hay SQL (sin base de datos), no hay
`dangerouslySetInnerHTML` con datos de usuario (solo JSON-LD estático) y no se ejecutan
comandos del sistema.

### H-06 · 🟡 Media — `/api/upload-local` sin allowlist de tipo/extensión **[APLICADO 2026-07-02]**
- **Ubicación:** `app/api/upload-local/route.ts`
- **Descripción:** la ruta de subida "local" (la activa en un despliegue self-hosted con
  Node) validaba sesión de admin y tamaño, pero **aceptaba cualquier extensión**
  (`html`, `svg`, `js`…). Un `.html` subido quedaría servido desde `public/uploads` en el
  **mismo origen** → XSS almacenado/defacement si la cookie de admin se compromete.
  Incumplía el Anexo 3 num. 5 y 17. La ruta gemela `/api/upload` (Vercel Blob) sí tenía
  allowlist.
- **Remediación aplicada:** allowlist de extensiones (`jpg, jpeg, png, webp, gif, avif,
  pdf`) y de tipos MIME, respondiendo 415 en caso contrario — igualada a `/api/upload`.
  Pendiente al migrar a Node: servir `/uploads` con `Content-Disposition` y sin ejecución.

### H-07 · 🟢 Baja — Sin límite de longitud por campo **[APLICADO 2026-07-02]**
- **Ubicación:** `app/api/pqrsd/route.ts`, `app/api/contacto/route.ts`
- **Descripción:** se validaba presencia y formato pero no tamaño máximo: una descripción
  de varios MB genera correos enormes (abuso del cupo de Resend). Anexo 3 num. 5.ii.
- **Remediación aplicada:** límites por campo en servidor (nombre 120, asunto 200,
  descripción/mensaje 5 000, documento/cédula 20, etc.) con respuesta 422.
  Opcional pendiente: espejo en el cliente con `maxLength` (UX).

### H-08 · 🟢 Baja — `esc()` no escapaba comillas **[APLICADO 2026-07-02]**
- **Ubicación:** `app/api/pqrsd/route.ts`, `app/api/contacto/route.ts`
- **Descripción:** `esc()` cubría `& < >` pero no `"` ni `'`, y los valores se interpolan
  en **atributos** del correo HTML (`href="mailto:${correo}"`). Higiene de escape
  (Anexo 3 num. 18); impacto real bajo.
- **Remediación aplicada:** `esc()` ahora escapa también `"` → `&quot;` y `'` → `&#39;`.
  Los *subject* de los correos (que no son HTML) usan el valor sin escapar.

### H-09 · ⚪ Informativa — CSRF: mitigado por diseño; falta defensa en profundidad
- **Ubicación:** cookie de sesión (`app/api/auth/login/route.ts`), `PUT /api/content/[key]`
- **Descripción:** las mutaciones autenticadas dependen de la cookie
  `httpOnly + Secure + SameSite=Lax`, que no viaja en `fetch` cross-site → CSRF clásico
  bloqueado. Los formularios públicos no requieren token CSRF por no tener sesión
  (Anexo 3 num. 5.v: "cuando aplique").
- **Remediación (hardening):** subir la cookie a `SameSite=Strict` y/o verificar
  `Origin`/`Sec-Fetch-Site` en las rutas mutadoras.

---

## Área 4 — Autenticación y control de acceso

Estado general: **sólido para su tamaño**: fail-closed sin secreto fuerte, token HMAC-SHA256
con expiración (8 h), comparación en tiempo constante, cookie con flags correctos, panel en
ruta secreta que devuelve 404 (`/acceso/<ADMIN_PATH>`) con `noindex` (Anexo 3 num. 10 ✓),
`/acceso` sin token → 404, rutas de escritura todas autenticadas.

### H-10 · 🟡 Media — Rate limiting en memoria por instancia
- **Ubicación:** `lib/rateLimit.ts`
- **Descripción:** en Vercel cada instancia serverless tiene su propio `Map`; con
  concurrencia o rotación de instancias el límite de 8 intentos/10 min se multiplica.
  Anexo 3 num. 9 exige restricción efectiva de fuerza bruta.
- **Remediación:** `@upstash/ratelimit` + Vercel KV (ventana deslizante compartida).
  Complemento de borde: regla de rate limiting de Cloudflare sobre `/api/auth/login` y,
  mejor aún, **Cloudflare Access** delante de `/acceso/*`.

### H-11 · 🟢 Baja — `clientIp()` confía en `x-forwarded-for` sin lista de proxies confiables
- **Ubicación:** `lib/rateLimit.ts`
- **Descripción:** en Vercel la cabecera la fija la plataforma (confiable). En un
  despliegue self-hosted detrás de Cloudflare Tunnel, un cliente podría enviar su propio
  `x-forwarded-for` y rotar identidades para evadir el rate limit.
- **Remediación:** al migrar, leer `CF-Connecting-IP` (solo si la petición llega por la
  red de Cloudflare) y rechazar XFF arbitrario.

### H-12 · 🟢 Baja — Logout no revoca el token; sin revocación de sesiones
- **Ubicación:** `app/api/auth/logout/route.ts`, `lib/auth.ts`
- **Descripción:** el logout borra la cookie, pero un token robado sigue válido hasta su
  `exp` (≤ 8 h).
- **Remediación proporcional:** claim `ver` (versión de sesión) en el payload, leído de
  variable de entorno o KV; rotarlo invalida todo. Alternativa inmediata sin código:
  rotar `TT_AUTH_SECRET` ante sospecha (invalida todas las sesiones).

### H-13 · ⚪ Informativa — Un solo usuario admin, sin 2FA ni CAPTCHA
- **Descripción:** Anexo 3 num. 2 y 7 (roles, contraseñas fuertes con renovación,
  CAPTCHA accesible). Con un único editor el modelo actual es razonable; la rotación
  trimestral ya está en `SECURITY.md` §6.
- **Remediación:** si crece el equipo editor, usuarios individuales (trazabilidad,
  num. 13). Cloudflare Access agregaría 2FA sin tocar código.

---

## Área 5 — Exposición de la infraestructura

- ✅ `/api/storage-status` requiere sesión admin (corregido en auditoría previa; verificado).
- ✅ `robots.ts` no revela la ruta real del panel (no añadir `/acceso` a robots.txt:
  lo revelaría; el `noindex` por página es el enfoque correcto).
- ✅ Mensajes de error genéricos al cliente; detalle solo en logs del servidor.

### H-14 · ⚪ Informativa — Verificaciones para Cloudflare Tunnel (capa fuera del repo)
1. El registro DNS del origen debe ser **solo** el CNAME del túnel — nunca un registro A
   con la IP real (verificar histórico en SecurityTrails/Censys).
2. `cloudflared` con credenciales del túnel en permisos 600.
3. Servicios internos (n8n, Mayan, Postgres) **sin** hostname público en la config del
   túnel salvo lo estrictamente necesario, y siempre detrás de Access.
4. SSL/TLS en modo "Full (strict)".
5. Prueba periódica: `curl` directo a la IP del servidor por 80/443 debe fallar.

---

## Área 6 — Dependencias y componentes

### H-15 · 🟡 Media — 2 vulnerabilidades moderadas en `npm audit`
- **Ubicación:** `next@15.5.19` (advisory moderada con parche disponible) y
  `postcss < 8.5.10` (transitiva, GHSA-qx2v-qp2m-jg93, solo build).
- **Remediación:** `npm i next@latest && npm audit` en `staging`, verificar build y
  desplegar. Programar `npm audit` mensual (ya en `SECURITY.md` §6) y activar
  **Dependabot** en GitHub.

### H-16 · ⚪ Informativa — Script de Google Translate sin SRI (excepción documentada)
- **Ubicación:** `components/site/GoogleTranslate.tsx`
- **Descripción:** único recurso de tercero inyectado en runtime. SRI no es viable
  (Google sirve contenido rotativo). Mitigado por la allowlist estricta de la CSP.
  El resto del sitio auto-hospeda fuentes y JS ✓.
- **Remediación:** excepción documentada en `SECURITY.md`. Si se añade un CDN de
  CSS/JS estático, exigir `integrity` + `crossorigin`.

---

## Área 7 — Protección de datos personales (Ley 1581/2012)

Estado general: **bien encaminado**: página `/politica-tratamiento-datos` ✓ (Res. 1519
Anexo 2, 2.3.2), checkbox de autorización obligatorio con **prueba de consentimiento
fechada** ✓, los datos de formularios **no se almacenan** en el sitio (van por correo) ✓,
`data/equipo.json` usa placeholders ✓, no hay NPN/cédulas en el código ✓.

### H-17 · 🟢 Baja — Datos personales en logs de funciones **[APLICADO 2026-07-02]**
- **Ubicación:** `app/api/pqrsd/route.ts`, `app/api/contacto/route.ts`
- **Descripción:** cuando faltaba `RESEND_API_KEY` se registraba `{ nombre, correo,
  asunto }` en `console.warn` → PII innecesaria en logs de Vercel (minimización,
  Ley 1581).
- **Remediación aplicada:** los logs ya no incluyen datos personales.

### H-18 · 🟢 Baja — Transferencia internacional de datos vía Resend sin mención en la política
- **Ubicación:** flujo `pqrsd`/`contacto` → Resend (procesador en EE. UU.)
- **Descripción:** cédula, dirección y contenido de la PQRSD transitan por un encargado
  de tratamiento extranjero (Ley 1581, transferencia/transmisión internacional).
- **Remediación:** (1) firmar/archivar el DPA de Resend; (2) mencionar el encargado y la
  transferencia internacional en `/politica-tratamiento-datos`; (3) opcional a futuro:
  radicar PQRSD en sistema propio y usar el correo solo como notificación.

### H-19 · ⚪ Informativa — Contenido editable en Vercel Blob público con URL estable
- **Ubicación:** `lib/store.ts` (`access: "public"`, `addRandomSuffix: false`)
- **Descripción:** correcto para contenido público. Riesgo latente: si un editor guarda
  datos personales en esos JSON, quedan en URL pública predecible.
- **Remediación:** regla editorial: *nunca* datos personales de ciudadanos en el
  contenido editable; fotos del equipo con consentimiento (cargo/área es información
  pública por Ley 1712).

---

## 📊 Matriz de priorización

| # | Hallazgo | Severidad | Esfuerzo | Norma (Res. 1519 A3) | Estado / Prioridad |
|---|---|---|---|---|---|
| H-15 | Actualizar `next` / `postcss` | 🟡 Media | Bajo | num. 8 | **1 — pendiente** |
| H-06 | Allowlist en `/api/upload-local` | 🟡 Media | Bajo | num. 5, 17 | ✅ Aplicado |
| H-10 | Rate limit distribuido (KV + borde) | 🟡 Media | Medio | num. 9 | **2 — pendiente** |
| H-01 | CSP con nonce (quitar `unsafe-inline`) | 🟡 Media | Medio-alto | num. 14 | **3 — pendiente** |
| H-17 | Quitar PII de logs | 🟢 Baja | Trivial | Ley 1581 | ✅ Aplicado |
| H-07 | Límites de longitud por campo | 🟢 Baja | Bajo | num. 5.ii | ✅ Aplicado |
| H-08 | Escapar comillas en `esc()` | 🟢 Baja | Trivial | num. 18 | ✅ Aplicado |
| H-18 | Política: encargado Resend / transf. intl. | 🟢 Baja | Bajo (legal) | Ley 1581 | **4 — pendiente** |
| H-02 | Restringir `img-src`/`remotePatterns` | 🟢 Baja | Bajo | — | 5 — pendiente |
| H-09 | SameSite=Strict + verificación de Origin | 🟢 Baja | Bajo | num. 5.v | 6 — pendiente |
| H-11 | IP confiable al migrar a self-hosted | 🟢 Baja | Bajo | num. 9 | Al migrar |
| H-12 | Revocación de sesiones (`ver` en token) | 🟢 Baja | Bajo | num. 2 | 7 — pendiente |
| H-03 | `X-XSS-Protection: 0` documentada | ⚪ Info | Trivial | num. 14 | ✅ Aplicado |
| H-05/H-14 | Hardening stack Docker/n8n/Tunnel | ⚪ Info | Medio | num. 4, 10 | Al montar la infra |
| H-13 | 2FA / usuarios individuales | ⚪ Info | Medio | num. 2, 7 | Si crece el equipo |
| H-16/H-19 | Excepciones documentadas (SRI, Blob) | ⚪ Info | Trivial | — | ✅ Documentado |

**No se encontraron hallazgos Críticos ni Altos.** Los críticos históricos (secreto por
defecto, token sin expiración, endpoints públicos) fueron corregidos en la auditoría
previa y se verificaron en el código actual.

## ✅ Checklist de acciones

**Aplicadas (2026-07-02, rama `staging`):**
- [x] Allowlist de extensiones/MIME en `upload-local/route.ts` (H-06)
- [x] Logs sin datos personales en `contacto` y `pqrsd` (H-17)
- [x] Escape de `"` y `'` en `esc()` de ambos endpoints (H-08)
- [x] Límites de longitud por campo en `contacto` y `pqrsd` (H-07)
- [x] `X-XSS-Protection: 0` + excepciones documentadas en `SECURITY.md` (H-03, H-16)

**Pendientes inmediatas:**
- [ ] `npm i next@latest` en `staging` → probar → desplegar (H-15)
- [ ] Confirmar en Vercel que `TT_AUTH_SECRET` ≥ 48 bytes aleatorios; rotar
      `TT_ADMIN_PASS` si lleva más de 3 meses
- [ ] Gestión: DPA con Resend + párrafo de transferencia internacional en la política (H-18)
- [ ] Gestión (Res. 1519): adoptar el **MSPI** de MinTIC y documentar el procedimiento de
      **reporte de incidentes al CSIRT-Gobierno en ≤ 24 h** (Anexo 3, 3.2.1-2)

**Trabajo de fondo (próximo sprint):**
- [ ] CSP con nonce vía `middleware.ts` (H-01)
- [ ] Rate limiting distribuido con Vercel KV / Upstash + regla de borde en Cloudflare (H-10)
