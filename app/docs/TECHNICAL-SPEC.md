
# Especificación Técnica — Ocheto Coffee Platform

**Versión:** 1.1 · **Fecha:** 2026-08-14 · **Perfil:** Technical · **Estado:** Lista para implementación

---

## 1. Resumen y objetivo

Convertir el sitio estático de Ocheto Coffee en una plataforma dinámica con tres roles (cliente, administrador, visitante), migrando los datos hardcodeados a Supabase y añadiendo autenticación, gestión de favoritos, panel de administración CRUD, y redirección de compras de tienda a WhatsApp. El diseño visual, la estructura de navegación y la información actual se conservan intactos.

**Resultado esperado:** Sitio público idéntico en apariencia pero con contenido servido desde Supabase; panel admin protegido para gestionar productos, menús de sucursal y destacados; sistema de auth para clientes con perfil de favoritos; botón "Comprar" en tienda que redirige a WhatsApp con el producto consultado.

---

## 2. Actores

| Actor | Descripción | Acceso |
|---|---|---|
| Visitante | Usuario no autenticado | Páginas públicas (Home, Menú, Tienda, Nosotros, Contacto, Menú de Sucursal) |
| Cliente | Usuario registrado con cuenta verificada | Todo lo público + perfil personal, favoritos |
| Administrador | Usuario con rol `admin` en Supabase Auth (ochetocoffe@gmail.com, ochetocoffee@gmail.com legacy) | Todo lo anterior + panel admin con CRUD completo |

---

## 3. Alcance

### Incluido
- Migración de productos de tienda (`PRODUCTS`) y menús de sucursales (`BRANCH_MENUS`) a Supabase
- Autenticación de clientes: registro, login, restablecimiento de contraseña (email real vía SMTP)
- Sistema de favoritos: toggle desde menú/tienda, visualización en perfil de cliente
- Panel de administración protegido por credenciales (email + password)
- CRUD de productos de tienda desde admin (crear, editar, desactivar, eliminar definitivamente)
- CRUD de ítems de menú de sucursal desde admin
- Gestión de destacados de homepage (3 productos seleccionables y reordenables)
- Botón "Comprar" en tienda que redirige a WhatsApp con mensaje prellenado del producto
- Conservación del diseño, componentes, animaciones y estructura de rutas existentes

### Fuera de alcance
- Carrito de compras persistente (el carrito actual se mantiene como estado efímero de sesión, pero el botón de tienda ya no lo usa)
- Pasarela de pagos en línea
- Notificaciones push
- Multi-idioma
- API pública para terceros
- Migración de testimonios, equipo, galería y contenido estático no comercial

---

## 4. Restricciones conocidas

- **Stack obligatorio:** React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, React Router 7
- **Backend obligatorio:** Supabase (Auth + Database + Storage)
- **Diseño intocable:** No modificar CSS, layouts, animaciones, tipografías ni estructura visual de las páginas públicas
- **Idioma de interfaz:** Español (contenido), inglés (código y IDs)
- **Moneda:** Bolivianos (Bs)
- **WhatsApp:** Número configurado en `src/shared/constants.ts` (`59170123456`)

---

## 5. Supuestos y decisiones

- S-01 — El carrito de compras se mantiene como estado efímero de sesión solo para productos del menú (cafetería). Los productos de tienda usan botón "Comprar" → WhatsApp.
  - Motivo: No existe flujo de pago en línea; el cierre de venta es por WhatsApp.
  - Impacto: `CartContext` se conserva para el menú; `ShopGrid` reemplaza `handleAddToCart` por `handleBuyWhatsApp`.
  - Reversión: Si en el futuro se añade checkout en línea, se reactiva el botón "Agregar" en tienda.

- S-02 — Las imágenes de productos se almacenan en Supabase Storage (bucket `product-images`) y las imágenes de portada/hero permanecen en `public/assets`.
  - Motivo: Separación entre assets de diseño (estáticos) y contenido generado por admin (dinámico).
  - Impacto: El CRUD de productos incluye upload de imagen a Storage.
  - Reversión: Si se prefiere CDN externo, cambiar la columna `image_url` por URL absoluta.

- S-03 — Administrador principal con email `ochetocoffe@gmail.com` y contraseña `Ochetocoffe2017-2026` (legacy `ochetocoffee@gmail.com` / `Ocheto#2026!Cf` con cambio forzado se mantiene). La contraseña se entrega fuera de banda.
  - Motivo: Escala inicial del negocio no justifica gestión multi-admin; se mantiene compatibilidad legacy.
  - Impacto: RLS policies distinguen rol `admin` vs `authenticated`; trigger `handle_new_user` reconoce ambos emails como admin.
  - Reversión: Añadir tabla `admin_invitations` si se necesitan múltiples administradores.

- S-04 — Los productos eliminados tienen dos modalidades: **Inactivar** (soft delete, `active = false`, el producto persiste en BD y puede reactivarse) y **Eliminar** (hard delete, borrado físico irreversible).
  - Motivo: El usuario requiere ambas opciones explícitamente.
  - Impacto: El admin ve dos acciones distintas en la UI del CRUD. RLS y queries públicos filtran `active = true`. Los favoritos de productos inactivos no se muestran pero el registro persiste; los favoritos de productos eliminados se borran en cascada.
  - Reversión: Ninguna; es un requisito explícito.

---

## 6. Arquitectura provisional

### 6.1 Capas

```
┌─────────────────────────────────────────────┐
│           Frontend (Vite + React)           │
│  Páginas públicas · Auth · Perfil · Admin   │
└──────────────────┬──────────────────────────┘
                   │ @supabase/supabase-js
┌──────────────────▼──────────────────────────┐
│            Supabase Project                  │
│  Auth · Postgres · Storage · Realtime (opt) │
└─────────────────────────────────────────────┘
```

### 6.2 Nuevos directorios propuestos

```
src/
  features/
    auth/          ← hooks, context, protected routes
    favorites/     ← hooks, toggle logic
    admin/         ← admin panel pages & components
  lib/
    supabase.ts    ← cliente singleton
```

### 6.3 Nuevas rutas

| Ruta | Acceso | Propósito |
|---|---|---|
| `/auth/login` | Público | Login cliente |
| `/auth/register` | Público | Registro cliente |
| `/auth/recover` | Público | Restablecer contraseña |
| `/perfil` | Cliente | Perfil + favoritos |
| `/admin` | Admin | Dashboard admin |
| `/admin/productos` | Admin | CRUD productos tienda |
| `/admin/sucursales` | Admin | CRUD menús de sucursal |
| `/admin/destacados` | Admin | Gestión favoritos homepage |

Las rutas públicas existentes (`/`, `/menu`, `/tienda`, `/nosotros`, `/contacto`, `/menu/:slug`) se conservan sin cambios de path.

---

## 7. Modelo de datos (Supabase Postgres)

### 7.1 Tabla `products` (tienda)

| Columna | Tipo | Nullable | Notas |
|---|---|---|---|
| `id` | `uuid` | PK | Default gen_random_uuid() |
| `slug` | `text` | UNIQUE | Para URLs amigables |
| `name` | `text` | | |
| `category` | `text` | | cafe, matcha, specialty, frio, panaderia, beans, merch |
| `description` | `text` | | Corta |
| `long_description` | `text` | true | |
| `price` | `integer` | | En centavos de Bs (ej: 2800 = Bs 28.00) |
| `image_url` | `text` | | Ruta relativa en Storage (`product-images/<uuid>.webp`) |
| `color` | `text` | | Hex para UI |
| `tags` | `text[]` | | Array de strings |
| `origin` | `text` | true | |
| `roast` | `text` | true | light, medium, medium-dark, dark |
| `notes` | `text[]` | true | |
| `caffeine` | `text` | true | normal, high, low, none |
| `temperature` | `text` | true | hot, iced, both |
| `bestseller` | `boolean` | default false | |
| `new` | `boolean` | default false | |
| `vegan` | `boolean` | default false | |
| `active` | `boolean` | default true | Soft delete / toggle visibilidad |
| `created_at` | `timestamptz` | default now() | |
| `updated_at` | `timestamptz` | default now() | |

### 7.2 Tabla `branch_menus`

| Columna | Tipo | Nullable | Notas |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `branch_id` | `text` | | loc1, loc2, loc3 (referencia lógica a locations) |
| `section_title` | `text` | | Ej: "Bebidas Calientes" |
| `section_subtitle` | `text` | true | Ej: "Con Café (Regular / Grande)" |
| `item_name` | `text` | | |
| `item_description` | `text` | true | |
| `price_regular` | `integer` | | Precio en centavos |
| `price_grande` | `integer` | true | Null si no aplica tamaño grande |
| `active` | `boolean` | default true | |
| `created_at` | `timestamptz` | default now() | |
| `updated_at` | `timestamptz` | default now() | |

### 7.3 Tabla `featured_products` (destacados homepage)

| Columna | Tipo | Nullable | Notas |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `product_id` | `uuid` | FK → products(id) | |
| `position` | `integer` | UNIQUE | 1, 2, 3 |
| `active` | `boolean` | default true | |
| `created_at` | `timestamptz` | default now() | |
| `updated_at` | `timestamptz` | default now() | |

### 7.4 Tabla `favorites`

| Columna | Tipo | Nullable | Notas |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `user_id` | `uuid` | FK → auth.users(id) | UNIQUE por (user_id, product_id) |
| `product_id` | `uuid` | FK → products(id) ON DELETE CASCADE | |
| `created_at` | `timestamptz` | default now() | |

### 7.5 Tabla `profiles` (extensión de auth.users)

| Columna | Tipo | Nullable | Notas |
|---|---|---|---|
| `id` | `uuid` | PK, FK → auth.users(id) | |
| `email` | `text` | | |
| `role` | `text` | default 'customer' | customer | admin |
| `full_name` | `text` | true | |
| `created_at` | `timestamptz` | default now() | |
| `updated_at` | `timestamptz` | default now() | |

### 7.6 Migración inicial

Se genera un archivo `supabase/migrations/001_init.sql` que:
1. Crea todas las tablas anteriores
2. Inserta los 16 productos actuales de `PRODUCTS` como seed (8 café/matcha/specialty/frio + 2 beans + 2 merch)
3. Inserta los ítems de menú de las 2 sucursales como seed (120 ítems)
4. Inserta los 3 destacados iniciales (cafe-helado, matcha-latte, berry-blast)
5. Crea trigger de `updated_at` para cada tabla
6. Configura RLS policies (ver sección 9)
7. Inserta los perfiles admin para `ochetocoffe@gmail.com` y `ochetocoffee@gmail.com` legacy

---

## 8. Contratos de API (Supabase)

### 8.1 Queries públicas (anon)

| Operación | Tabla | Filtro RLS |
|---|---|---|
| SELECT | `products` | `active = true` |
| SELECT | `branch_menus` | `active = true` |
| SELECT | `featured_products` | `active = true`, ordenado por `position ASC` LIMIT 3 |

### 8.2 Operaciones de cliente (authenticated)

| Operación | Tabla | Condición RLS |
|---|---|---|
| INSERT | `favorites` | `user_id = auth.uid()` |
| DELETE | `favorites` | `user_id = auth.uid()` |
| SELECT | `favorites` | `user_id = auth.uid()` |
| SELECT | `profiles` | `id = auth.uid()` |
| UPDATE | `profiles` | `id = auth.uid()` |

### 8.3 Operaciones de admin (role = 'admin')

| Operación | Tablas | Condición RLS |
|---|---|---|
| SELECT, INSERT, UPDATE, DELETE | `products`, `branch_menus`, `featured_products` | `auth.jwt()->>'role' = 'admin'` vía tabla `profiles` |

---

## 9. Autenticación y autorización

### 9.1 Flujo de cliente

1. **Registro:** Formulario en `/auth/register` → `supabase.auth.signUp()` con email/password. Los datos básicos se escriben en `profiles` mediante un database trigger en `auth.users`.
2. **Login:** Formulario en `/auth/login` → `supabase.auth.signInWithPassword()`. Redirección a `/perfil` tras éxito.
3. **Recuperación:** Formulario en `/auth/recover` → `supabase.auth.resetPasswordForEmail()`. Requiere SMTP configurado en Supabase (email real).
4. **Sesión persistente:** Supabase maneja refresh tokens automáticamente vía cliente JS.

### 9.2 Flujo de administrador

1. Login en `/admin` usando email + password.
2. Verificación de rol: consulta a `profiles` donde `id = auth.uid()` y `role = 'admin'`.
3. Si no es admin → redirigir a `/` con toast de error.
4. El seeding inicial crea admin `ochetocoffe@gmail.com` / `Ochetocoffe2017-2026` (sin cambio forzado) y mantiene legacy `ochetocoffee@gmail.com` / `Ocheto#2026!Cf` con `must_change_password=true`.

### 9.3 Row Level Security

```sql
-- Clients can only manage their own favorites
CREATE POLICY "Users manage own favorites"
ON favorites FOR ALL
USING (user_id = auth.uid());

-- Public reads active products only
CREATE POLICY "Public read active products"
ON products FOR SELECT
USING (active = true);

-- Admins full access to products
CREATE POLICY "Admins full access products"
ON products FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
));

-- Similar policies for branch_menus, featured_products
```

---

## 10. Requisitos funcionales

### RF-01 — Catálogo de productos servido desde Supabase
- **Actor:** Visitante, Cliente
- **Prioridad:** Alta
- **Origen:** Explícito
- **Estado:** Propuesto
- **Dependencias:** Migración 001, S-01
- **Criterios de aceptación:**
  - AC-01.1 — Dado que un usuario navega a `/tienda`, cuando la página carga, entonces los productos mostrados provienen de la tabla `products` con `active = true`, ordenados por categoría y nombre.
  - AC-01.2 — Dado un producto con `bestseller = true`, cuando se renderiza en la grilla, entonces muestra la etiqueta "Bestseller" visible.
  - AC-01.3 — Dado un producto con `active = false`, cuando un usuario no autenticado navega a `/tienda`, entonces el producto no aparece en la grilla.

### RF-02 — Menús de sucursal servidos desde Supabase
- **Actor:** Visitante, Cliente
- **Prioridad:** Alta
- **Origen:** Explícito
- **Estado:** Propuesto
- **Dependencias:** Migración 001
- **Criterios de aceptación:**
  - AC-02.1 — Dado que un usuario navega a `/menu/federico-suazo`, cuando la página carga, entonces los ítems mostrados provienen de `branch_menus` con `branch_id = 'loc3'` y `active = true`.
  - AC-02.2 — Dado un ítem con `price_grande` null, cuando se renderiza, entonces muestra un solo precio (formato regular).
  - AC-02.3 — Dado un ítem con `price_grande` no null, cuando se renderiza, entonces muestra ambos precios etiquetados "Regular" y "Grande".

### RF-03 — Destacados de homepage gestionados desde base de datos
- **Actor:** Visitante (lectura), Admin (escritura)
- **Prioridad:** Alta
- **Origen:** Explícito
- **Estado:** Propuesto
- **Dependencias:** Migración 001, RF-10
- **Criterios de aceptación:**
  - AC-03.1 — Dado que un visitante navega a `/`, cuando la sección FeaturedProducts carga, entonces muestra exactamente 3 productos obtenidos de `featured_products` ordenados por `position ASC`.
  - AC-03.2 — Dado que un admin cambia el producto en posición 2 desde el panel, cuando un visitante recarga la homepage, entonces ve el nuevo producto en esa posición.
  - AC-03.3 — Dado que no hay 3 destacados activos, cuando carga la homepage, entonces muestra solo los destacados activos disponibles sin romper el layout.

### RF-04 — Registro de cliente
- **Actor:** Visitante
- **Prioridad:** Alta
- **Origen:** Explícito
- **Estado:** Propuesto
- **Criterios de aceptación:**
  - AC-04.1 — Dado un visitante en `/auth/register`, cuando completa email, password y nombre, entonces se crea una entrada en `auth.users` y `profiles` con rol `customer`.
  - AC-04.2 — Dado un email ya registrado, cuando se intenta registrar de nuevo, entonces se muestra mensaje de error "Este correo ya está registrado".
  - AC-04.3 — Dado un password con menos de 6 caracteres, cuando se envía el formulario, entonces se muestra error de validación antes de llamar a Supabase.

### RF-05 — Login de cliente
- **Actor:** Visitante
- **Prioridad:** Alta
- **Origen:** Explícito
- **Estado:** Propuesto
- **Criterios de aceptación:**
  - AC-05.1 — Dado un cliente registrado en `/auth/login`, cuando ingresa credenciales válidas, entonces es redirigido a `/perfil` y la sesión persiste al recargar.
  - AC-05.2 — Dadas credenciales inválidas, cuando se envía el formulario, entonces se muestra "Correo o contraseña incorrectos" sin revelar cuál de los dos es incorrecto.
  - AC-05.3 — Dado un cliente logueado que navega a `/auth/login`, cuando accede a la ruta, entonces es redirigido inmediatamente a `/perfil`.

### RF-06 — Restablecimiento de contraseña
- **Actor:** Cliente
- **Prioridad:** Media
- **Origen:** Explícito
- **Estado:** Propuesto
- **Criterios de aceptación:**
  - AC-06.1 — Dado un cliente en `/auth/recover`, cuando ingresa su email registrado y SMTP está configurado, entonces recibe un email con link de restablecimiento.
  - AC-06.2 — Dado un email no registrado, cuando se envía el formulario, entonces se muestra el mismo mensaje que para email registrado (por seguridad, no revelar existencia de cuentas).

### RF-07 — Perfil de cliente
- **Actor:** Cliente
- **Prioridad:** Alta
- **Origen:** Explícito
- **Estado:** Propuesto
- **Criterios de aceptación:**
  - AC-07.1 — Dado un cliente autenticado en `/perfil`, cuando carga la página, entonces ve su nombre, email y fecha de registro.
  - AC-07.2 — Dado un cliente en `/perfil`, cuando hace clic en "Cerrar sesión", entonces la sesión se invalida y es redirigido a `/`.
  - AC-07.3 — Dado un cliente no autenticado que navega a `/perfil`, cuando accede a la ruta, entonces es redirigido a `/auth/login`.

### RF-08 — Favoritos: agregar y remover
- **Actor:** Cliente
- **Prioridad:** Alta
- **Origen:** Explícito
- **Estado:** Propuesto
- **Criterios de aceptación:**
  - AC-08.1 — Dado un cliente autenticado viendo un producto en `/tienda` o `/menu`, cuando hace clic en el ícono de corazón, entonces se crea un registro en `favorites` y el ícono cambia a estado "lleno".
  - AC-08.2 — Dado un cliente autenticado con un producto en favoritos, cuando hace clic nuevamente en el ícono de corazón, entonces se elimina el registro de `favorites` y el ícono vuelve a estado "vacío".
  - AC-08.3 — Dado un visitante no autenticado, cuando hace clic en el ícono de corazón, entonces es redirigido a `/auth/login` con parámetro `returnTo` apuntando a la página actual.
  - AC-08.4 — Dado un producto inactivo, cuando un cliente tiene ese producto en favoritos, entonces el producto no aparece en su lista de favoritos pero el registro de favorito se mantiene (para preservarlo si el producto se reactiva).
  - AC-08.5 — Dado un producto eliminado (hard delete), cuando un cliente tiene ese producto en favoritos, entonces el registro de favorito se elimina en cascada.

### RF-09 — Favoritos: visualización en perfil
- **Actor:** Cliente
- **Prioridad:** Alta
- **Origen:** Explícito
- **Estado:** Propuesto
- **Criterios de aceptación:**
  - AC-09.1 — Dado un cliente con N favoritos en `/perfil`, cuando navega a la pestaña "Favoritos", entonces ve una grilla con hasta N productos activos que ha marcado.
  - AC-09.2 — Dado un cliente sin favoritos, cuando navega a la pestaña "Favoritos", entonces ve un mensaje "Aún no tienes productos favoritos" con un botón "Explorar tienda".
  - AC-09.3 — Dado un producto en favoritos, cuando el cliente hace clic en "Remover" desde la lista, entonces el producto se elimina de favoritos y de la grilla inmediatamente.

### RF-10 — Panel de administración: acceso protegido
- **Actor:** Administrador
- **Prioridad:** Alta
- **Origen:** Explícito
- **Estado:** Propuesto
- **Criterios de aceptación:**
  - AC-10.1 — Dado un usuario con rol `admin` en `/admin`, cuando carga la página, entonces ve el dashboard con resumen de productos, favoritos totales y accesos a CRUDs.
  - AC-10.2 — Dado un cliente (rol `customer`) que navega a `/admin`, cuando accede a la ruta, entonces es redirigido a `/` con mensaje de acceso denegado.
  - AC-10.3 — Dado un visitante no autenticado que navega a `/admin`, cuando accede a la ruta, entonces es redirigido a `/auth/login`.

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
  - Condiciones: Conexión 4G simulada, sin caché de navegador, primeros 16 productos
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
- Seeding de admin `ochetocoffe@gmail.com` / `Ochetocoffe2017-2026` + legacy `ochetocoffee@gmail.com`

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

- Todas las decisiones (D-01, D-02) han sido resueltas por el usuario.
- Supuestos S-01 a S-04 documentados y aceptados.
- RFC-14 (WhatsApp) añadido como requisito explícito con criterios de aceptación completos.
- No hay bloqueos pendientes.

---

## 16. Registro de cambios

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0 | 2026-08-14 | Especificación inicial creada desde análisis brownfield del proyecto Ocheto Coffee |
| 1.1 | 2026-08-14 | Resueltas D-01 (SMTP real), D-02 (soft + hard delete), añadido RF-14 (WhatsApp buy), actualizado S-03 (credenciales admin), eliminada referencia a carrito persistente en tienda |
| 1.2 | 2026-08-21 | Correcciones de implementación: .env en .gitignore, RLS optimizado (select auth.uid()), validación Zod en branch_menus, image_url relativo, BranchMenu doble precio Regular/Grande informativo, doc sincronizado a 16 productos |
| 1.3 | 2026-08-21 | Nueva credencial admin `ochetocoffe@gmail.com` / `Ochetocoffe2017-2026` (must_change_password=false), email visible en contacto actualizado a `ochetocoffe@gmail.com`, trigger admin para ambos emails |
