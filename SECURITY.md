# Seguridad y rendimiento — Tuterritorio

Auditoría de seguridad por capas, cambios aplicados, plan pendiente, análisis de
rendimiento y recomendaciones de mantenimiento. Resumen ágil.

---

## 1. Infraestructura y puertos

La app es **Next.js sobre Vercel (serverless)**. No hay servidores ni **puertos**
propios que administrar:

| Tema | Estado |
|---|---|
| Puertos / firewall | N/A — Vercel no expone puertos; solo **HTTPS (443)** en el edge. No hay SSH/DB/puertos abiertos que endurecer. |
| TLS / certificados | Gestionado por Vercel (Let's Encrypt) automático. **HSTS** activado en cabeceras. |
| DDoS / WAF de borde | Provisto por la red de Vercel. |
| DNS | En **Cloudflare** (registros `A`/`CNAME` en *DNS only*). Correo Google (MX) intacto. |
| Superficie de ataque real | Las **rutas API** (`/api/*`), las **variables de entorno** y el acceso al **panel admin**. Ahí se concentró el endurecimiento. |

> Conclusión: el "análisis de puertos" clásico no aplica; la seguridad se juega en
> **autenticación, validación de entradas, secretos y cabeceras HTTP**.

---

## 2. Hallazgos y severidad

| # | Severidad | Hallazgo | Estado |
|---|---|---|---|
| 1 | 🔴 Crítico | `TT_AUTH_SECRET` tenía un **valor por defecto público** en el código → tokens de admin **falsificables** si la variable no estaba en Vercel. | ✅ Corregido |
| 2 | 🟠 Alto | Token de sesión **sin expiración propia** (un token robado servía indefinidamente). | ✅ Corregido (claim `exp`) |
| 3 | 🟠 Alto | Comparación de contraseña **no constante** (timing attack). | ✅ Corregido (`timingSafeEqual`) |
| 4 | 🟠 Alto | **Sin rate limiting** → fuerza bruta en login y spam/abuso de correo en formularios. | ✅ Mitigado (límite por IP) |
| 5 | 🟡 Medio | **Sin cabeceras de seguridad** (CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy). | ✅ Corregido |
| 6 | 🟡 Medio | Endpoint `/api/storage-status` **público** (filtraba estado de infraestructura). | ✅ Corregido (solo admin) |
| 7 | 🟡 Medio | Errores de envío de correo **exponían detalles internos** al visitante. | ✅ Corregido (mensaje genérico; detalle solo en logs) |
| 8 | 🟢 Bajo | Optimizador de imágenes acepta **cualquier host https** (`remotePatterns: **`) → posible abuso de ancho de banda. | ⚠️ Aceptado (el admin pega URLs de noticias). Documentado. |
| 9 | 🟢 Bajo | `npm audit`: 2 vulnerabilidades **moderadas** en `postcss` (transitiva de Next, solo build). | ⚠️ Pendiente (actualizar Next a último parche 15.x) |

### Cosas que ya estaban BIEN
- `.env.local` **nunca** se subió al repo; `.gitignore` correcto; sin secretos en git.
- Cookie de sesión `httpOnly` + `secure` + `sameSite=lax` (mitiga XSS-robo y CSRF).
- Escritura de contenido y subida de archivos **requieren sesión admin**.
- Validación de `key` con regex (sin path traversal); sanitización HTML en correos (`esc`).
- Sin `dangerouslySetInnerHTML` (sin inyección de HTML crudo).
- Subidas: allowlist de tipos, límite 20 MB, nombre de archivo saneado.
- Honeypot anti-bot en los formularios.

---

## 3. Cambios aplicados (documentados)

| Archivo | Cambio |
|---|---|
| `lib/auth.ts` | Fail-closed sin secreto fuerte (≥16); comparación en tiempo constante; token con expiración. |
| `lib/rateLimit.ts` | **Nuevo.** Limitador por IP (ventana fija, en memoria). |
| `app/api/auth/login` | Rate limit (8 intentos / 10 min / IP). |
| `app/api/contacto`, `app/api/pqrsd` | Rate limit (5 / 10 min / IP); errores genéricos al cliente. |
| `app/api/storage-status` | Requiere sesión admin (antes público). |
| `next.config.mjs` | Cabeceras de seguridad + CSP afinada a Maps y Vercel Analytics. |

---

## 4. Plan para lo pendiente (orden por sensibilidad)

1. **Verificar en Vercel** que `TT_AUTH_SECRET` (Production) sea largo y aleatorio
   (≥16, idealmente 48+ bytes). Si faltara, **el login queda cerrado** por diseño.
   Generar: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.
2. **Rotar la contraseña de admin** (`TT_ADMIN_PASS`) por una fuerte y única, y
   considerar rotación periódica.
3. **Rate limiting robusto**: el actual es "mejor esfuerzo" (memoria por instancia
   serverless). Para límite global usar **Vercel KV / Upstash Ratelimit**.
4. **Actualizar dependencias**: `npm i next@latest` (cierra el aviso de `postcss`).
   Revisar `npm audit` tras cada actualización.
5. **CSP**: hoy usa `'unsafe-inline'` en scripts. Endurecer a **CSP con nonce**
   (más seguro) cuando haya tiempo; verificar que Maps/Analytics sigan cargando.
6. (Opcional) Restringir `remotePatterns` del optimizador de imágenes a hosts
   conocidos si se deja de pegar URLs externas en noticias.

---

## 5. Análisis de rendimiento

Build de producción (Next 15):

- **Páginas estáticas** (prerenderizadas) — óptimo para velocidad y costo.
- **First Load JS: ~102–117 kB** por página (por debajo del umbral recomendado ~130 kB). App liviana.
- **Imágenes** con `next/image` → AVIF/WebP automáticos.
- **Fuente Inter** auto-hospedada (sin llamadas a Google Fonts en runtime).
- **Analytics + Speed Insights** activos para medir Core Web Vitals reales.

Mejoras sugeridas (bajo impacto, buenas prácticas):
- Comprimir/optimizar imágenes grandes en `public/assets` (banners, mapas) antes de subirlas.
- Vigilar Speed Insights (LCP/CLS/INP) tras cambios visuales.

---

## 6. Recomendaciones de mantenimiento

- **Mensual:** `npm audit` + `npm outdated`; aplicar parches de seguridad.
- **Trimestral:** rotar `TT_ADMIN_PASS` y revisar accesos/variables en Vercel.
- **Secretos:** solo en variables de entorno de Vercel; nunca en el código ni en git.
- **Dominio/DNS:** no tocar los `MX` (correo Google) al editar DNS en Cloudflare.
- **Backups:** el contenido editable vive en **Vercel Blob**; exportar `*.json`
  periódicamente como respaldo.
- **Despliegues sensibles:** probar primero en la rama `staging` (preview) antes de `main`.
- **Monitoreo:** revisar logs de funciones en Vercel ante errores de correo o login.
