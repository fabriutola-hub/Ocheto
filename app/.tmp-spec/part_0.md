
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
| Administrador | Usuario con rol `admin` en Supabase Auth (ochetocoffee@gmail.com) | Todo lo anterior + panel admin con CRUD completo |

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

- S-03 — Un solo administrador inicial con email `ochetocoffee@gmail.com` y contraseña generada `Ocheto#2026!Cf`. La contraseña se entrega fuera de banda y se fuerza el cambio en el primer login.
  - Motivo: Escala inicial del negocio no justifica gestión multi-admin.
  - Impacto: RLS policies distinguen rol `admin` vs `authenticated`.
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
2. Inserta los 18 productos actuales de `PRODUCTS` como seed
3. Inserta los ítems de menú de las 2 sucursales como seed
4. Inserta los 3 destacados iniciales (p1, p2, p3)
5. Crea trigger de `updated_at` para cada tabla
6. Configura RLS