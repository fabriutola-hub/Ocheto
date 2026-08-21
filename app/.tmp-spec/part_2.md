uth/login`.

### RF-11 — CRUD de productos de tienda (con dos modalidades de eliminación)
- **Actor:** Administrador
- **Prioridad:** Alta
- **Origen:** Explícito
- **Estado:** Propuesto
- **Dependencias:** S-02, S-04
- **Criterios de aceptación:**
  - AC-11.1 — Dado un admin en `/admin/productos`, cuando carga la página, entonces ve una tabla con todos los productos (activos e inactivos) con acciones de editar, inactivar y eliminar.
  - AC-11.2 — Dado un admin creando un producto, cuando completa el formulario con nombre, categoría, precio e imagen, entonces el producto se guarda en `products` con `active = true` y aparece en `/tienda`.
  - AC-11.3 — Dado un admin editando un producto, cuando cambia el precio y guarda, entonces el nuevo precio se refleja inmediatamente en `/tienda` y `/menu`.
  - AC-11.4 — Dado un admin que hace clic en "Inactivar", cuando confirma, entonces `active` cambia a `false`, el producto desaparece de páginas públicas pero permanece en la tabla del admin con estado "Inactivo" y puede reactivarse.
  - AC-11.5 — Dado un admin que hace clic en "Eliminar", cuando confirma con un diálogo de advertencia "Esta acción no se puede deshacer", entonces el producto se borra físicamente de `products` y sus favoritos asociados se eliminan en cascada.
  - AC-11.6 — Dado un admin subiendo una imagen de producto, cuando el upload completa, entonces la URL se guarda en `image_url` y la imagen es visible en el formulario y en la tienda.

### RF-12 — CRUD de menús de sucursal
- **Actor:** Administrador
- **Prioridad:** Media
- **Origen:** Explícito
- **Estado:** Propuesto
- **Criterios de aceptación:**
  - AC-12.1 — Dado un admin en `/admin/sucursales`, cuando carga la página, entonces ve los menús agrupados por sucursal con acciones de editar y eliminar por ítem.
  - AC-12.2 — Dado un admin creando un ítem de menú, cuando completa sucursal, sección, nombre y precio, entonces el ítem aparece en la página de menú de esa sucursal.
  - AC-12.3 — Dado un admin editando un ítem con precio grande, cuando cambia solo `price_regular`, entonces `price_grande` se mantiene intacto.

### RF-13 — Gestión de destacados de homepage
- **Actor:** Administrador
- **Prioridad:** Media
- **Origen:** Explícito
- **Estado:** Propuesto
- **Criterios de aceptación:**
  - AC-13.1 — Dado un admin en `/admin/destacados`, cuando carga la página, entonces ve 3 slots numerados con los productos actualmente destacados y un selector para cambiar cada uno.
  - AC-13.2 — Dado un admin que cambia el producto del slot 1 y guarda, cuando un visitante recarga `/`, entonces el nuevo producto aparece primero en el carrusel.
  - AC-13.3 — Dado un admin que reordena los destacados (cambia posiciones), cuando guarda, entonces el orden del carrusel refleja el nuevo orden.

### RF-14 — Comprar por WhatsApp (tienda)
- **Actor:** Visitante, Cliente
- **Prioridad:** Alta
- **Origen:** Explícito
- **Estado:** Propuesto
- **Dependencias:** S-01
- **Criterios de aceptación:**
  - AC-14.1 — Dado un usuario en `/tienda` viendo un producto de la categoría `beans` o `merch`, cuando hace clic en "Comprar", entonces se abre WhatsApp (web o app) con un mensaje prellenado: *"Hola Ocheto, me interesa: [Nombre del producto] - Bs [precio]"*.
  - AC-14.2 — Dado un producto de la categoría `cafe`, `matcha`, `specialty`, `frio` o `panaderia`, cuando se renderiza en la grilla de tienda, entonces el botón "Comprar" no aparece (estos productos son de consumo en local y usan el carrito del menú).
  - AC-14.3 — Dado un usuario que hace clic en "Comprar", cuando WhatsApp no está disponible (bloqueador de pop-ups), entonces se muestra un toast con el enlace para copiar manualmente.
  - AC-14.4 — Dado un producto sin precio definido, cuando se hace clic en "Comprar", entonces el mensaje de WhatsApp omite el precio: *"Hola Ocheto, me interesa: [Nombre del producto]"*.

---

## 11. Requisitos no funcionales

- RNF-01 — Rendimiento
  - Objetivo: Tiempo de carga inicial (FCP) < 2.5s en 4G, Time to Interactive < 4s
  - Condiciones: Conexión 4G simulada, sin caché de navegador, primeros 18 productos
  - Verificación: Lighthouse CI en build de producción
  - Origen: S-01

- RNF-02 — Disponibilidad de datos
  - Objetivo: 99% de uptime de la API de Supabase (SLA del plan)
  - Condiciones: Horas pico 10:00–22:00 La Paz (UTC-4)
  - Verificación: Dashboard de Supabase + logs de errores del cliente
  - Origen: Explícito

- RNF-03 — Seguridad de autenticación
  - Objetivo: Contraseñas con mínimo 6 caracteres, rate limiting de login de Supabase activo
  - Condiciones: Todos los intentos de login/signup
  - Verificación: Pruebas manuales de password débil y fuerza bruta (5 intentos fallidos bloquean temporalmente)
  - Origen: Explícito

- RNF-04 — Consistencia de diseño
  - Objetivo: 0 cambios visuales en páginas públicas tras la migración (mismo layout, animaciones, tipografía)
  - Condiciones: Comparación lado a lado antes/después en Chrome, Firefox, Safari
  - Verificación: Screenshot comparison manual + revisión de componentes existentes no modificados
  - Origen: Explícito

- RNF-05 — Manejo de errores de red
  - Objetivo: Todas las operaciones de escritura (favoritos, login, CRUD) muestran estado de carga y mensaje de error recuperable si la petición falla
  - Condiciones: Red offline o respuesta 5xx de Supabase
  - Verificación: throttling de red a Offline en DevTools + verificación de UI states
  - Origen: Explícito

- RNF-06 — Formato de mensaje WhatsApp
  - Objetivo: El mensaje prellenado debe estar URL-encoded correctamente y no exceder 400 caracteres
  - Condiciones: Cualquier producto de tienda (beans, merch)
  - Verificación: Inspeccionar la URL generada y decodificar el parámetro `text`
  - Origen: Explícito

---

## 12. Baseline de seguridad

| Control | Riesgo mitigado | Verificación |
|---|---|---|
| RLS policies en todas las tablas | Acceso no autorizado a datos | Revisión manual de policies + tests de integración |
| Contraseñas validadas por Supabase Auth (mín. 6 chars) | Credenciales débiles | Prueba de registro con password corto |
| Verificación de rol `admin` en servidor (RLS) + cliente (ruta protegida) | Escalada de privilegios | Intentar acceder a `/admin` con cuenta customer |
| Secrets en variables de entorno (`.env`) | Exposición de credenciales | Revisión de `.env` en `.gitignore` |
| Input validation con Zod en formularios de admin | Inyección de datos inválidos | Pruebas de formulario con datos malformados |
| Storage bucket con políticas de acceso (solo admin upload) | Upload no autorizado de imágenes | Intentar upload con cuenta customer |
| HTTPS forzado (Supabase + Vercel/Netlify) | Interceptación de tráfico | Verificación de cabeceras HSTS |
| Confirmación de diálogo antes de hard delete | Eliminación accidental irreversible | Prueba de UX: hacer clic en "Eliminar" sin confirmar |

---

## 13. Fases de entrega

### Fase 1 — Cimientos (Semana 1)
- Configuración de proyecto Supabase (Auth, Database, Storage)
- Migración 001: esquema + seed de datos actuales
- Cliente Supabase en frontend (`src/lib/supabase.ts`)
- RLS policies básicas
- Seeding de admin `ochetocoffee@gmail.com` / `Ocheto#2026!Cf`

### Fase 2 — Autenticación (Semana 2)
- Páginas `/auth/login`, `/auth/register`, `/auth/recover`
- Contexto de autenticación y rutas protegidas
- Tabla `profiles` con trigger de creación automática
- SMTP configurado en Supabase para recovery

### Fase 3 — Migración de datos (Semana 2–3)
- Reemplazo de `PRODUCTS` hardcodeados por queries a Supabase
- Reemplazo de `BRANCH_MENUS` hardcodeados por queries a Supabase
- FeaturedProducts lee de `featured_products`
- Caché local con React Query o SWR para reducir llamadas

### Fase 4 — Favoritos (Semana 3)
- Toggle de favoritos en ProductCard (menú y tienda)
- Página de perfil con lista de favoritos
- Redirección a login para no autenticados

### Fase 5 — Panel de administración (Semana 4)
- Dashboard `/admin` con resumen
- CRUD de productos con upload de imágenes, inactivar y eliminar
- CRUD de menús de sucursal
- Gestión de destacados

### Fase 6 — WhatsApp + Pulido (Semana 4–5)
- Reemplazo de botón "Agregar" por "Comprar" en ShopGrid/ProductCardGrid para categorías `beans` y `merch`
- Generación de URL WhatsApp con mensaje prellenado
- Manejo de estados de carga y error
- Pruebas de RLS y seguridad
- Pruebas cross-browser
- Optimización de performance

---

## 14. Riesgos y mitigaciones

| Riesgo | Impacto | Probabilidad | Mitigación |
|---|---|---|---|
| SMTP no configurado en Supabase | El recovery de contraseña no envía email | Media si no hay dominio verificado | Configurar SMTP antes de Fase 2; si no es posible, mostrar mensaje "Contacta a soporte para restablecer" como fallback |
| Imágenes de productos exceden cuota de Storage | Uploads fallan en producción | Baja | Comprimir imágenes en cliente antes de upload; monitorear cuota |
| Cambios de diseño no intencionales en migración | Rompe principio de "diseño intacto" | Media | Congelar CSS antes de migrar; revisión visual obligatoria por componente |
| Rate limiting de Supabase en plan free | Login lento o bloqueos en pico de tráfico | Baja | Monitorear métricas; planificar upgrade si >100 usuarios concurrentes |
| Hard delete accidental de producto con favoritos | Pérdida de datos de clientes | Media | Diálogo de confirmación con advertencia explícita; logging de eliminaciones en tabla de auditoría |

---

## 15. Estado de preparación

**Lista para implementación.**

