/**
 * OCHETO — Brand DNA Card (frontend-design skill)
 * =====================================================
 * Subject: Cafetería & pastelería artesanal en La Paz, Bolivia.
 *   Tres tiendas, ingredientes de calidad, dedicación en cada preparación.
 *   Historia: nació con alfajores de cacao, hoy es un espacio donde las personas
 *   se sienten bienvenidas. Los ositos son parte de la identidad (calidez, cercanía, alegría).
 * Audience: Paceños 22–40 — freelancers, estudiantes, familias que valoran
 *   los pequeños detalles y la calidez de una experiencia cercana.
 * Single job (home): Que el visitante sienta los pequeños detalles y quiera visitarnos.
 *
 * SIGNATURE ELEMENT (one only):
 *   "Pequeños detalles" — edges de papel rasgado entre secciones + vapor de las tazas
 *   + momentos Caveat manuscritos con 🐻. No cinco decoraciones — esta sola.
 *
 * Domain metaphors:
 *   Material: taza de cerámica + grano de cacao + papel pergamino + osito de felpa
 *   Verb: elaborar / servir / compartir / cuidar
 *   Heritage: cafetería de barrio con alma de pastelería familiar + rincón de comunidad
 *
 * TOKENS
 * ------
 * Surfaces: cream-50 #F5F0E8 | cream-100 #F0E9DB | paper white #FAF7F0
 * Ink: coffee-950 #1A100C | coffee-900 #241610
 * Brand green: green-950 #0F1A0F | green-900 #152415 | green-700 #1B5E20 | green-600 #2E7D32
 * Accent gold: #E8B923 | caramel #D4A574 | berry #B83A3A | matcha #7CB342
 * Radius: buttons pill (9999), cards 1rem–1.25rem, badges full
 * Type: Fraunces (display/serif italic headlines), Inter (body UI), Caveat (hand accent only)
 * Motion: ease [0.16,1,0.3,1], 0.5–0.8s section enter, subtle float 4–6s on product imagery only
 * Shadow: soft green-tinted elevation, not pure black
 *
 * ANTI-PATTERNS TO AVOID
 * - Purple gradients, Inter-only, three equal feature cards, fake urgency timers
 * - Over-animate everything; motion must answer what happened / what's next
 * - Generic "Empowering coffee lovers" copy — use ingredientes de calidad, pequeños detalles,
 *   alfajores, equipo, 3 tiendas, Equipo Ocheto (no nombres propios de fundadores)
 *
 * TECH CONSTRAINTS
 * - React 19 + Vite + Tailwind 3.4 + framer-motion already installed
 * - Use existing classes: container-ocheto, section-padding, btn-primary, btn-outline-light,
 *   font-fraunces, font-caveat, grain-texture, dots-bg, hover-lift, ocheto-* colors
 * - Keep Spanish copy; improve microcopy where generic
 * - Assets: /assets/logo-ocheto.png, vaso-*.png, drink-complete-v2.png, grain.png, wallaper_*.jpg
 * - Data from @/data — do not invent fake products
 * - prefers-reduced-motion already global; don't fight it
 * - Mobile-first; works at 360px
 * - Do NOT break imports/exports or page composition in pages/*.tsx unless needed
 * - Prefer editing existing section files in place (full rewrite OK if better)
 */

export const OCHETO_DNA = {
  signature: 'detalles-torn-edge-steam',
  palette: {
    cream: '#F5F0E8',
    ink: '#1A100C',
    green: '#1B5E20',
    gold: '#E8B923',
    caramel: '#D4A574',
  },
} as const;
