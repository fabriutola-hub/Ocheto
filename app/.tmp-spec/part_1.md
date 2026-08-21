 policies (ver sección 9)
7. Inserta el perfil admin para `ochetocoffee@gmail.com`

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
4. El seeding inicial crea un admin con email `ochetocoffee@gmail.com` y contraseña `Ocheto#2026!Cf`.

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
  - AC-10.3 — Dado un visitante no autenticado que navega a `/admin`, cuando accede a la ruta, entonces es redirigido a `/a