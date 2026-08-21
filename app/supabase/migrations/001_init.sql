-- ============================================================
-- 001_init.sql — Ocheto Coffee Platform
-- Esquema, RLS, Storage, Seeds y admin inicial
-- Precios en centavos de Bs (ej: 2800 = Bs 28.00)
-- ============================================================

-- ---------- Tablas ----------

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null check (category in ('cafe','matcha','specialty','frio','panaderia','beans','merch')),
  description text not null default '',
  long_description text,
  price integer not null default 0 check (price >= 0),
  image_url text not null default '',
  color text not null default '#8B6914',
  tags text[] not null default '{}',
  origin text,
  roast text check (roast in ('light','medium','medium-dark','dark')),
  notes text[],
  caffeine text check (caffeine in ('normal','high','low','none')),
  temperature text check (temperature in ('hot','iced','both')),
  bestseller boolean not null default false,
  "new" boolean not null default false,
  vegan boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.branch_menus (
  id uuid primary key default gen_random_uuid(),
  branch_id text not null check (branch_id in ('loc1','loc2','loc3')),
  section_title text not null,
  section_subtitle text,
  item_name text not null,
  item_description text,
  price_regular integer not null check (price_regular >= 0),
  price_grande integer check (price_grande is null or price_grande >= 0),
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.featured_products (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  position integer not null unique check (position between 1 and 3),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'customer' check (role in ('customer','admin')),
  full_name text,
  must_change_password boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Índices ----------

create index if not exists products_active_idx on public.products (active);
create index if not exists favorites_user_idx on public.favorites (user_id);
create index if not exists branch_menus_branch_idx on public.branch_menus (branch_id, sort_order);
create index if not exists featured_position_idx on public.featured_products (position);

-- ---------- Funciones y triggers ----------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists branch_menus_set_updated_at on public.branch_menus;
create trigger branch_menus_set_updated_at
  before update on public.branch_menus
  for each row execute function public.set_updated_at();

drop trigger if exists featured_products_set_updated_at on public.featured_products;
create trigger featured_products_set_updated_at
  before update on public.featured_products
  for each row execute function public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Perfil automático al crear usuario en auth.users.
-- El email del admin inicial recibe rol admin + cambio de contraseña forzado.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email = 'ochetocoffee@gmail.com' then
    insert into public.profiles (id, email, role, full_name, must_change_password)
    values (
      new.id,
      new.email,
      'admin',
      coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
      true
    )
    on conflict (id) do update set
      email = excluded.email,
      updated_at = now();
  else
    insert into public.profiles (id, email, full_name)
    values (
      new.id,
      coalesce(new.email, ''),
      coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
    )
    on conflict (id) do update set
      email = excluded.email,
      updated_at = now();
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update of email on auth.users
  for each row execute function public.handle_new_user();

-- El trigger interno es SECURITY DEFINER pero solo debe ejecutarlo el propio trigger
revoke execute on function public.handle_new_user() from anon, authenticated, public;

-- Evita que un cliente se ascienda a admin vía UPDATE directo.
create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if new.role is distinct from old.role then
    if not exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    ) then
      raise exception 'Solo administradores pueden cambiar roles';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_prevent_role_escalation on public.profiles;
create trigger profiles_prevent_role_escalation
  before update on public.profiles
  for each row execute function public.prevent_role_escalation();

-- ---------- Row Level Security ----------

alter table public.products enable row level security;
alter table public.branch_menus enable row level security;
alter table public.featured_products enable row level security;
alter table public.favorites enable row level security;
alter table public.profiles enable row level security;

drop policy if exists "Public read active products" on public.products;
create policy "Public read active products"
  on public.products for select
  to anon, authenticated
  using (active = true);

drop policy if exists "Admins full access products" on public.products;
create policy "Admins full access products"
  on public.products for all
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

drop policy if exists "Public read active branch menus" on public.branch_menus;
create policy "Public read active branch menus"
  on public.branch_menus for select
  to anon, authenticated
  using (active = true);

drop policy if exists "Admins full access branch menus" on public.branch_menus;
create policy "Admins full access branch menus"
  on public.branch_menus for all
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

drop policy if exists "Public read active featured" on public.featured_products;
create policy "Public read active featured"
  on public.featured_products for select
  to anon, authenticated
  using (active = true);

drop policy if exists "Admins full access featured" on public.featured_products;
create policy "Admins full access featured"
  on public.featured_products for all
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

drop policy if exists "Users manage own favorites" on public.favorites;
create policy "Users manage own favorites"
  on public.favorites for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "Admins read favorites" on public.favorites;
create policy "Admins read favorites"
  on public.favorites for select
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- ---------- Privilegios ----------

grant usage on schema public to anon, authenticated;
grant select on public.products to anon, authenticated;
grant select on public.branch_menus to anon, authenticated;
grant select on public.featured_products to anon, authenticated;
grant select, update on public.profiles to authenticated;
grant all on public.favorites to authenticated;
grant all on public.products to authenticated;
grant all on public.branch_menus to authenticated;
grant all on public.featured_products to authenticated;

-- ---------- Storage: bucket de imágenes de productos ----------

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read product images" on storage.objects;
create policy "Public read product images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

drop policy if exists "Admins upload product images" on storage.objects;
create policy "Admins upload product images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'product-images'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "Admins update product images" on storage.objects;
create policy "Admins update product images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'product-images'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  )
  with check (
    bucket_id = 'product-images'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "Admins delete product images" on storage.objects;
create policy "Admins delete product images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'product-images'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ---------- Seed: productos de tienda ----------

insert into public.products
  (slug, name, category, description, long_description, price, image_url, color, tags, origin, roast, notes, caffeine, temperature, bestseller, "new", vegan, active)
values
  ('cafe-helado', 'Café Helado', 'cafe', 'Espresso doble con hielo y leche cremosa paceña', 'Doble shot de espresso extraído a 92°C, enfriado al instante sobre hielo cristalino, finalizado con leche entera fresca de granjas locales. El clásico ocheto perfecto para los días de sol en El Prado.', 2800, '/assets/vaso-cafe.webp', '#8B6914', array['helado','clásico','favorito'], 'Caranavi, Bolivia', 'medium', array['Caramelo','Chocolate','Nuez'], 'high', 'iced', true, false, false, true),
  ('matcha-latte', 'Matcha Latte', 'matcha', 'Té matcha ceremonial japonés con leche de avena', 'Matcha grado ceremonial importado directamente de Uji, Japón. Batido con un chasen tradicional y coronado con leche de avena cremosa. Un boost de antioxidantes con umami profundo.', 3200, '/assets/vaso-verde.webp', '#2E7D32', array['matcha','vegano','antioxidante'], 'Uji, Japón', null, null, 'normal', 'both', true, false, true, true),
  ('berry-blast', 'Berry Blast', 'frio', 'Frutos rojos andinos con hielo y un toque de menta', 'Una explosión de frutilla, arándano y tumbo de los Yungas paceños, mezclados con hielo frappé y un toque de menta fresca. Sin azúcar añadida, endulzado con stevia natural.', 3000, '/assets/vaso-rojo.webp', '#B83A3A', array['frutal','refrescante','sin azúcar'], 'Yungas, La Paz', null, null, 'none', 'iced', false, true, true, true),
  ('espresso-doble', 'Espresso Doble', 'cafe', 'Shot doble de nuestros granos signature', 'Para los que aman la intensidad pura. Dos shots de nuestro blend de la casa, extraído a 9 bares durante 28 segundos. Notas a chocolate negro y cereza madura.', 2200, '/assets/cup-with-shadow.webp', '#3A2415', array['intenso','puro','sin leche'], 'Caranavi, Bolivia', 'medium-dark', array['Chocolate','Cereza'], 'high', 'hot', false, false, false, true),
  ('cappuccino-andino', 'Cappuccino Andino', 'cafe', 'Espresso con leche vaporizada y arte latte del altiplano', 'Nuestro homenaje a las alturas. Espresso corto, leche texturizada con microespuma perfecta, decorado con un arte latte inspirado en las montañas que nos rodean.', 2600, '/assets/drink-complete-v2.webp', '#8B5E3C', array['caliente','arte latte','clásico'], null, 'medium', null, 'normal', 'hot', true, false, false, true),
  ('cold-brew-andino', 'Cold Brew Andino', 'cafe', '18 horas de extracción en frío, sabor suave y dulce', 'Café molido grueso en agua fría durante 18 horas. El resultado es un líquido concentrado, suave, con notas a chocolate y caramelo. Servido sobre hielo con un splash de crema.', 3000, '/assets/vaso-cafe.webp', '#3A2415', array['cold brew','suave','intenso'], null, 'medium-dark', null, 'high', 'iced', false, true, false, true),
  ('matcha-frio', 'Matcha Helado', 'matcha', 'Iced matcha con leche de coco y un shot de espresso', 'Matcha ceremonial batido sobre hielo con leche de coco cremosa y un shot de espresso para los que no se deciden entre café y matcha.', 3600, '/assets/vaso-verde.webp', '#2E7D32', array['matcha','café','energía'], null, null, null, 'high', 'iced', false, true, true, true),
  ('latte-caramelo', 'Latte de Caramelo', 'specialty', 'Espresso con leche vaporizada y caramelo de quinoa', 'Nuestro caramelo se hace en casa con quinoa tostada, mantequilla y un toque de sal de Uyuni. Una versión andina del clásico.', 3200, '/assets/drink-complete-v2.webp', '#D4A574', array['caramelo','dulce','signature'], null, null, null, 'normal', 'both', true, false, false, true),
  ('mocha-andino', 'Mocha Andino', 'specialty', 'Espresso, chocolate del Beni y leche vaporizada', 'Chocolate artesanal del Beni (Bolivia) derretido a baño maría, mezclado con espresso y coronado con leche texturizada. Cremoso, profundo, reconfortante.', 3400, '/assets/drink-complete-v2.webp', '#5C3A1E', array['chocolate','cálido','signature'], null, null, null, 'normal', 'both', false, false, false, true),
  ('chai-latte', 'Chai Latte', 'matcha', 'Mezcla de especias andinas con leche vaporizada', 'Canela, cardamomo, jengibre, clavo de olor y un toque de pimienta de los valles cochabambinos. Mezclado con té negro Assam y leche cremosa.', 2800, '/assets/cup-with-shadow.webp', '#C8893F', array['especias','cálido','vegano'], null, null, null, 'low', 'both', false, false, true, true),
  ('affogato', 'Affogato', 'specialty', 'Helado de vainilla bañado en espresso', 'Una bola de helado artesanal de vainilla de los Yungas, ahogada en un shot doble de espresso caliente. El contraste térmico es poesía.', 3600, '/assets/drink-complete-v2.webp', '#8B5E3C', array['postre','café','italiano'], null, null, null, 'normal', 'both', false, true, false, true),
  ('frappe-ocheto', 'Frappé Ocheto', 'frio', 'Café frappé con crema de coco y un toque de canela', 'Café espresso batido con hielo hasta textura frappé, coronado con crema de coco batida y un toque de canela de Cochabamba.', 3400, '/assets/vaso-cafe.webp', '#8B6914', array['frappé','refrescante','cremoso'], null, null, null, 'normal', 'iced', false, false, false, true),
  ('granos-caranavi-250g', 'Granos Caranavi 250g', 'beans', 'Café de especialidad de los Yungas paceños', 'Café de altura (1,800m) de la finca Caranavi en los Yungas. Notas a chocolate, caramelo y nuez. Tostado medio. Disponible en grano entero o molido.', 8500, '/assets/grain.webp', '#5C3A1E', array['café','grano','boliviano'], 'Caranavi, La Paz', 'medium', array['Chocolate','Caramelo','Nuez'], 'high', null, true, false, false, true),
  ('granos-apollo-250g', 'Granos Apolo 250g', 'beans', 'Edición limitada de los Andes profundos', 'Lote único de la finca Apolo en Sud Yungas. Notas florales y frutales, tueste ligero. Edición limitada.', 12000, '/assets/grain.webp', '#8B5E3C', array['edición limitada','premium','tueste ligero'], 'Apolo, La Paz', 'light', array['Floral','Cítricos','Bergamota'], 'high', null, false, true, false, true),
  ('tumbler-ocheto', 'Tumbler Ocheto', 'merch', 'Vaso térmico reutilizable con logo grabado', 'Tumbler de acero inoxidable 18/10, doble pared, mantiene tu café caliente por 8 horas o frío por 12. Capacidad 450ml. Logo Ocheto grabado con láser.', 9500, '/assets/cup-with-shadow.webp', '#2E7D32', array['merch','reutilizable','sostenible'], null, null, null, 'none', 'both', false, false, false, true),
  ('camiseta-ocheto', 'Camiseta Ocheto "Vibes"', 'merch', 'Algodón orgánico con el logo Ocheto', 'Camiseta de algodón 100% orgánico, teñida con pigmentos naturales. Corte unisex, suave al tacto. El verde Ocheto y nuestro logo serigrafiado.', 11000, '/assets/cup-with-shadow.webp', '#1B5E20', array['merch','ropa','sostenible'], null, null, null, 'none', null, false, true, false, true)
on conflict (slug) do nothing;

-- ---------- Seed: destacados iniciales (p1, p2, p3) ----------

insert into public.featured_products (product_id, position, active)
select id, 1, true from public.products where slug = 'cafe-helado'
union all select id, 2, true from public.products where slug = 'matcha-latte'
union all select id, 3, true from public.products where slug = 'berry-blast'
on conflict (position) do update
  set product_id = excluded.product_id, active = true, updated_at = now();

-- ---------- Seed: menús de sucursal ----------
-- loc1 = menú compartido Oruro & Illampu · loc3 = Federico Suazo

insert into public.branch_menus
  (branch_id, section_title, section_subtitle, item_name, item_description, price_regular, price_grande, sort_order)
values
  -- ===== Federico Suazo (loc3) =====
  ('loc3', 'Bebidas Calientes', 'Con Café (Regular)', 'Espresso Simple', '1 oz. - 30ml.', 1200, null, 1),
  ('loc3', 'Bebidas Calientes', 'Con Café (Regular)', 'Espresso Doble', '2 oz. - 60ml.', 1400, null, 2),
  ('loc3', 'Bebidas Calientes', 'Con Café (Regular)', 'Americano', null, 1500, null, 3),
  ('loc3', 'Bebidas Calientes', 'Con Café (Regular)', 'Capuccino', null, 1900, null, 4),
  ('loc3', 'Bebidas Calientes', 'Con Café (Regular)', 'Capuccino Vienés', 'Con Crema Batida', 2400, null, 5),
  ('loc3', 'Bebidas Calientes', 'Con Café (Regular)', 'Latte Mocca', 'con Chocolate', 2400, null, 6),
  ('loc3', 'Bebidas Calientes', 'Con Café (Regular)', 'Latte Ocheto', 'con Dulce de Leche', 2400, null, 7),
  ('loc3', 'Bebidas Calientes', 'Con Café (Regular)', 'Latte Vainilla', null, 2400, null, 8),
  ('loc3', 'Bebidas Calientes', 'Con Café (Regular)', 'Latte Vainilla y Canela', null, 2400, null, 9),
  ('loc3', 'Bebidas Calientes', 'Con Café (Regular)', 'Latte Coco', null, 2400, null, 10),
  ('loc3', 'Bebidas Calientes', 'Con Café (Regular)', 'Latte Caramelo', null, 2400, null, 11),
  ('loc3', 'Bebidas Calientes', 'Con Café (Regular)', 'Flat White', 'Bebida con más Café', 2300, null, 12),
  ('loc3', 'Bebidas Calientes', 'Con Café (Regular)', 'Latte Baileys', 'con Licor de Crema de Whisky', 3400, null, 13),
  ('loc3', 'Bebidas Calientes', 'Con Café (Regular)', 'Capuccino Irlandés', 'Estilo Irlandés con Whisky', 3100, null, 14),
  ('loc3', 'Bebidas Calientes', 'Sin Café (Con Leche ó Agua - Regular)', 'Chocolate Caliente', null, 1900, null, 15),
  ('loc3', 'Bebidas Calientes', 'Sin Café (Con Leche ó Agua - Regular)', 'Chocolate con Crema', null, 2300, null, 16),
  ('loc3', 'Bebidas Calientes', 'Sin Café (Con Leche ó Agua - Regular)', 'Latte Chai sin Café', null, 1900, null, 17),
  ('loc3', 'Bebidas Calientes', 'Sin Café (Con Leche ó Agua - Regular)', 'Té o Mate', null, 1300, null, 18),
  ('loc3', 'Matcha', 'Té Verde • Leche - Regular', 'Latte Matcha', null, 2400, null, 19),
  ('loc3', 'Matcha', 'Té Verde • Leche - Regular', 'Latte frío Matcha', null, 2300, null, 20),
  ('loc3', 'Matcha', 'Té Verde • Leche - Regular', 'Frappé Matcha', null, 2500, null, 21),
  ('loc3', 'Adicional / Nuevo en Tienda', null, 'Crema Extra', 'Para cualquier bebida o postre', 600, null, 22),
  ('loc3', 'Adicional / Nuevo en Tienda', null, 'Muffin Chocolate', 'Nuevo en Tienda', 1300, null, 23),
  ('loc3', 'Bebidas Frías', 'Frapuccinos — Con Café • Crema Batida • Hielo Picado', 'Frappuccino', null, 2200, null, 24),
  ('loc3', 'Bebidas Frías', 'Frapuccinos — Con Café • Crema Batida • Hielo Picado', 'Frappuccino Mocca', 'con Chocolate', 2400, null, 25),
  ('loc3', 'Bebidas Frías', 'Frapuccinos — Con Café • Crema Batida • Hielo Picado', 'Frappuccino Ocheto', 'con Dulce de Leche', 2400, null, 26),
  ('loc3', 'Bebidas Frías', 'Frapuccinos — Con Café • Crema Batida • Hielo Picado', 'Frappuccino Oreo', null, 2500, null, 27),
  ('loc3', 'Bebidas Frías', 'Frapuccinos — Con Café • Crema Batida • Hielo Picado', 'Frappuccino Baileys', 'Licor de Crema de Whisky', 3600, null, 28),
  ('loc3', 'Bebidas Frías', 'Frappés sin Café — Sin Café • Hielo Picado', 'Frappé o Jugo en Agua', 'Fruta de Temporada', 1900, null, 29),
  ('loc3', 'Bebidas Frías', 'Frappés sin Café — Sin Café • Hielo Picado', 'Frappé con Leche', 'Fruta de Temporada + Crema Batida', 2200, null, 30),
  ('loc3', 'Bebidas Frías', 'Frappés sin Café — Sin Café • Hielo Picado', 'Smoothie Frutos Rojos', 'Combinación de Frutos Rojos, Yogur, Leche + Crema Batida', 2400, null, 31),
  ('loc3', 'Bebidas Frías', 'Frappés sin Café — Sin Café • Hielo Picado', 'Frappé Chai', 'Bebida a Base de Té Chai Sin Café', 2400, null, 32),
  ('loc3', 'Bebidas Frías', 'Ice Lattes — Con café • Cubos de Hielo', 'Americano frío', null, 1900, null, 33),
  ('loc3', 'Bebidas Frías', 'Ice Lattes — Con café • Cubos de Hielo', 'Latte frío', null, 2000, null, 34),
  ('loc3', 'Bebidas Frías', 'Ice Lattes — Con café • Cubos de Hielo', 'Caramel Macchiato Vainilla', null, 2300, null, 35),
  ('loc3', 'Bebidas Frías', 'Ice Lattes — Con café • Cubos de Hielo', 'Latte frío Mocca', 'con Chocolate', 2300, null, 36),
  ('loc3', 'Bebidas Frías', 'Ice Lattes — Con café • Cubos de Hielo', 'Latte frío Ocheto', 'con Dulce de Leche', 2300, null, 37),
  ('loc3', 'Bebidas Frías', 'Ice Lattes — Con café • Cubos de Hielo', 'Latte frío Vainilla', null, 2300, null, 38),
  ('loc3', 'Bebidas Frías', 'Ice Lattes — Con café • Cubos de Hielo', 'Latte frío Coco', null, 2300, null, 39),
  ('loc3', 'Bebidas Frías', 'Ice Lattes — Con café • Cubos de Hielo', 'Latte frío Caramelo', null, 2300, null, 40),
  ('loc3', 'Bebidas Frías', 'Ice Lattes — Con café • Cubos de Hielo', 'Latte frío Chai', 'Base de Té Chai Sin Café', 2300, null, 41),
  ('loc3', 'Bebidas Frías', 'Malteadas — Con Base de Helado • Café', 'Affogato', 'Helado de Vainilla cubierto con Café Espresso caliente', 2100, null, 42),
  ('loc3', 'Bebidas Frías', 'Malteadas — Con Base de Helado • Café', 'Malteada de Café', null, 2500, null, 43),
  ('loc3', 'Bebidas Frías', 'Malteadas — Con Base de Helado • Café', 'Malteada de Oreo', 'Con Café / Sin Café', 2700, null, 44),
  ('loc3', 'Repostería', 'Dulce', 'Galleta Ocheto', 'Masa de vainilla con chips de chocolate', 1300, null, 45),
  ('loc3', 'Repostería', 'Dulce', 'Galleta Red Velvet', 'Con Chispas de Chocolate Blanco y Rellena de Dulce de Leche', 1300, null, 46),
  ('loc3', 'Repostería', 'Dulce', 'Galleta de Avena', 'Con Chispas de Chocolate sin Harinas', 1300, null, 47),
  ('loc3', 'Repostería', 'Dulce', 'Rollo de Canela', null, 1600, null, 48),
  ('loc3', 'Repostería', 'Dulce', 'Pie de Manzana', null, 1600, null, 49),
  ('loc3', 'Repostería', 'Dulce', 'Brownie de Chocolate', null, 1600, null, 50),
  ('loc3', 'Repostería', 'Dulce', 'Pie de Manzana con Helado', null, 2300, null, 51),
  ('loc3', 'Repostería', 'Dulce', 'Brownie de Chocolate con Helado', null, 2300, null, 52),
  ('loc3', 'Repostería', 'Dulce', 'Croissant de Chocolate', null, 1600, null, 53),
  ('loc3', 'Repostería', 'Dulce', 'Torta Ocheto', 'Relleno y cobertura de Ganache de Chocolate', 2500, null, 54),
  ('loc3', 'Repostería', 'Dulce', 'Osomisú', 'Tiramisú al estilo Ocheto', 2500, null, 55),
  ('loc3', 'Repostería', 'Dulce', 'Osolemon Pie', 'Marquesa cremosa de limón', 2500, null, 56),
  ('loc3', 'Repostería', 'Salado', 'Croissant de Queso', null, 1600, null, 57),
  ('loc3', 'Repostería', 'Salado', 'Croissant de Jamón y Queso', null, 1600, null, 58),
  ('loc3', 'Repostería', 'Salado', 'Empanada 3 quesos', 'Con un toque de albahaca', 1000, null, 59),
  ('loc3', 'Repostería', 'Salado', 'Empanada de Jamón y Queso', null, 1000, null, 60),
  ('loc3', 'Repostería', 'Salado', 'Cuñapé', null, 1000, null, 61),

  -- ===== Oruro & Illampu (loc1, menú compartido) =====
  ('loc1', 'Bebidas Calientes', 'Con Café (Regular / Grande)', 'Espresso Simple', '1 oz. - 30ml.', 1000, null, 1),
  ('loc1', 'Bebidas Calientes', 'Con Café (Regular / Grande)', 'Espresso Doble', '2 oz. - 60ml.', 1200, null, 2),
  ('loc1', 'Bebidas Calientes', 'Con Café (Regular / Grande)', 'Americano', null, 1400, 1900, 3),
  ('loc1', 'Bebidas Calientes', 'Con Café (Regular / Grande)', 'Capuccino', null, 1600, 2100, 4),
  ('loc1', 'Bebidas Calientes', 'Con Café (Regular / Grande)', 'Capuccino Vienés', 'Con Crema Batida', 2000, 2500, 5),
  ('loc1', 'Bebidas Calientes', 'Con Café (Regular / Grande)', 'Latte Mocca', 'con Chocolate', 2000, 2500, 6),
  ('loc1', 'Bebidas Calientes', 'Con Café (Regular / Grande)', 'Latte Ocheto', 'con Dulce de Leche', 2000, 2500, 7),
  ('loc1', 'Bebidas Calientes', 'Con Café (Regular / Grande)', 'Latte Vainilla', null, 2000, 2500, 8),
  ('loc1', 'Bebidas Calientes', 'Con Café (Regular / Grande)', 'Latte Vainilla y Canela', null, 2000, 2500, 9),
  ('loc1', 'Bebidas Calientes', 'Con Café (Regular / Grande)', 'Latte Coco', null, 2000, 2500, 10),
  ('loc1', 'Bebidas Calientes', 'Con Café (Regular / Grande)', 'Latte Caramelo', null, 2000, 2500, 11),
  ('loc1', 'Bebidas Calientes', 'Con Café (Regular / Grande)', 'Flat White', 'Bebida con más café', 2000, 2500, 12),
  ('loc1', 'Bebidas Calientes', 'Con Café (Regular / Grande)', 'Latte Baileys', 'con Licor de Crema de Whisky', 2900, 3400, 13),
  ('loc1', 'Bebidas Calientes', 'Con Café (Regular / Grande)', 'Capuccino Irlandés', 'Estilo Irlandés con Whisky', 2600, 3100, 14),
  ('loc1', 'Bebidas Calientes', 'Sin Café (Con Leche ó Agua)', 'Chocolate Caliente', null, 1600, 2100, 15),
  ('loc1', 'Bebidas Calientes', 'Sin Café (Con Leche ó Agua)', 'Chocolate con Crema', null, 1900, 2400, 16),
  ('loc1', 'Bebidas Calientes', 'Sin Café (Con Leche ó Agua)', 'Latte Chai sin Café', null, 1900, 2400, 17),
  ('loc1', 'Bebidas Calientes', 'Sin Café (Con Leche ó Agua)', 'Té o Mate', null, 1100, null, 18),
  ('loc1', 'Matcha', 'Té Verde • Leche', 'Latte Matcha', null, 2000, 2500, 19),
  ('loc1', 'Matcha', 'Té Verde • Leche', 'Latte frío Matcha', null, 1900, null, 20),
  ('loc1', 'Matcha', 'Té Verde • Leche', 'Frappé Matcha', null, 2100, null, 21),
  ('loc1', 'Adicional / Nuevo en Tienda', null, 'Crema Extra', 'Para cualquier bebida', 500, null, 22),
  ('loc1', 'Adicional / Nuevo en Tienda', null, 'Muffin Chocolate', 'Nuevo en Tienda', 1100, null, 23),
  ('loc1', 'Bebidas Frías', 'Frapuccinos — Con Café • Crema Batida • Hielo Picado', 'Frappuccino', null, 1800, null, 24),
  ('loc1', 'Bebidas Frías', 'Frapuccinos — Con Café • Crema Batida • Hielo Picado', 'Frappuccino Mocca', 'con Chocolate', 2000, null, 25),
  ('loc1', 'Bebidas Frías', 'Frapuccinos — Con Café • Crema Batida • Hielo Picado', 'Frappuccino Ocheto', 'con Dulce de Leche', 2000, null, 26),
  ('loc1', 'Bebidas Frías', 'Frapuccinos — Con Café • Crema Batida • Hielo Picado', 'Frappuccino Oreo', null, 2100, null, 27),
  ('loc1', 'Bebidas Frías', 'Frapuccinos — Con Café • Crema Batida • Hielo Picado', 'Frappuccino Baileys', 'con Licor de Crema de Whisky', 3200, null, 28),
  ('loc1', 'Bebidas Frías', 'Frappés sin Café — Sin Café • Hielo Picado', 'Frappé o Jugo en Agua', 'Fruta de Temporada', 1600, null, 29),
  ('loc1', 'Bebidas Frías', 'Frappés sin Café — Sin Café • Hielo Picado', 'Frappé con Leche', 'Fruta de Temporada + Crema Batida', 1800, null, 30),
  ('loc1', 'Bebidas Frías', 'Frappés sin Café — Sin Café • Hielo Picado', 'Smoothie Frutos Rojos', 'Combinación de Frutos Rojos, Yogur, Leche + Crema Batida', 2000, null, 31),
  ('loc1', 'Bebidas Frías', 'Frappés sin Café — Sin Café • Hielo Picado', 'Frappé Chai', 'Bebida a Base de Té Chai Sin Café', 2000, null, 32),
  ('loc1', 'Bebidas Frías', 'Ice Lattes — Con café • Cubos de Hielo', 'Americano frío', null, 1600, null, 33),
  ('loc1', 'Bebidas Frías', 'Ice Lattes — Con café • Cubos de Hielo', 'Latte frío', null, 1700, null, 34),
  ('loc1', 'Bebidas Frías', 'Ice Lattes — Con café • Cubos de Hielo', 'Caramel Macchiato Vainilla', null, 1900, null, 35),
  ('loc1', 'Bebidas Frías', 'Ice Lattes — Con café • Cubos de Hielo', 'Latte frío Mocca', 'con Chocolate', 1900, null, 36),
  ('loc1', 'Bebidas Frías', 'Ice Lattes — Con café • Cubos de Hielo', 'Latte frío Ocheto', 'con Dulce de Leche', 1900, null, 37),
  ('loc1', 'Bebidas Frías', 'Ice Lattes — Con café • Cubos de Hielo', 'Latte frío Vainilla', null, 1900, null, 38),
  ('loc1', 'Bebidas Frías', 'Ice Lattes — Con café • Cubos de Hielo', 'Latte frío Coco', null, 1900, null, 39),
  ('loc1', 'Bebidas Frías', 'Ice Lattes — Con café • Cubos de Hielo', 'Latte frío Caramelo', null, 1900, null, 40),
  ('loc1', 'Bebidas Frías', 'Ice Lattes — Con café • Cubos de Hielo', 'Latte frío Chai', null, 1900, null, 41),
  ('loc1', 'Bebidas Frías', 'Malteadas — Con Base de Helado', 'Affogato', 'Helado de Vainilla cubierto con Café Espresso caliente', 1700, null, 42),
  ('loc1', 'Bebidas Frías', 'Malteadas — Con Base de Helado', 'Malteada de Café', null, 2100, null, 43),
  ('loc1', 'Bebidas Frías', 'Malteadas — Con Base de Helado', 'Malteada de Oreo', 'Con Café / Sin Café', 2300, null, 44),
  ('loc1', 'Repostería', 'Dulce', 'Galleta Ocheto', 'Masa de vainilla con chips de chocolate', 1100, null, 45),
  ('loc1', 'Repostería', 'Dulce', 'Galleta Red Velvet', 'Con Chispas de Chocolate Blanco y Rellena de Dulce de Leche', 1100, null, 46),
  ('loc1', 'Repostería', 'Dulce', 'Galleta de Avena', 'Con Chispas de Chocolate sin Harinas', 1100, null, 47),
  ('loc1', 'Repostería', 'Dulce', 'Rollo de Canela', null, 1300, null, 48),
  ('loc1', 'Repostería', 'Dulce', 'Pie de Manzana', null, 1300, null, 49),
  ('loc1', 'Repostería', 'Dulce', 'Brownie de Chocolate', null, 1300, null, 50),
  ('loc1', 'Repostería', 'Dulce', 'Pie de Manzana con Helado', null, 1900, null, 51),
  ('loc1', 'Repostería', 'Dulce', 'Brownie de Chocolate con Helado', null, 1900, null, 52),
  ('loc1', 'Repostería', 'Dulce', 'Croissant de Chocolate', null, 1300, null, 53),
  ('loc1', 'Repostería', 'Dulce', 'Osomisú', 'Tiramisú al estilo Ocheto', 2200, null, 54),
  ('loc1', 'Repostería', 'Salado', 'Croissant de Queso', null, 1300, null, 55),
  ('loc1', 'Repostería', 'Salado', 'Croissant de Jamón y Queso', null, 1300, null, 56),
  ('loc1', 'Repostería', 'Salado', 'Empanada 3 quesos', 'Con un toque de albahaca', 800, null, 57),
  ('loc1', 'Repostería', 'Salado', 'Empanada de Jamón y Queso', null, 800, null, 58),
  ('loc1', 'Repostería', 'Salado', 'Cuñapé', null, 800, null, 59);

-- ---------- Admin inicial ----------
-- Email: ochetocoffee@gmail.com · Contraseña: Ocheto#2026!Cf (cambio forzado en primer login)

do $$
declare
  admin_uid uuid := gen_random_uuid();
begin
  if not exists (select 1 from auth.users where email = 'ochetocoffee@gmail.com') then
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, recovery_token,
      email_change, email_change_token_new, email_change_token_current
    ) values (
      '00000000-0000-0000-0000-000000000000', admin_uid, 'authenticated', 'authenticated',
      'ochetocoffee@gmail.com', crypt('Ocheto#2026!Cf', gen_salt('bf')),
      now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Administrador Ocheto"}'::jsonb,
      now(), now(), '', '', '', '', ''
    );

    insert into auth.identities (
      id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), admin_uid,
      jsonb_build_object('sub', admin_uid::text, 'email', 'ochetocoffee@gmail.com', 'email_verified', true),
      'email', admin_uid::text, now(), now(), now()
    );
  end if;
end $$;
