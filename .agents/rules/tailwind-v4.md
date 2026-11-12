# Tailwind CSS v4 & Enterprise Design Standards

## Library Versions
- **Tailwind CSS**: v4.3.2
- **Integration**: `tailwindcss-primeui` v0.6.1

## 1. Important Modifier Syntax (`!` Postfix Suffix)
In Tailwind CSS v4, the `!` modifier is strictly a **suffix** at the very end of the utility name.

```html
<!-- ✅ CORRECT: Suffix ! at the end -->
<div class="py-1!">
<div class="hover:py-1!">
<div class="dark:bg-gray-900!">
<div class="lg:hover:text-blue-500!">

<!-- ❌ FORBIDDEN: Prefix ! or infix ! (v3 syntax) -->
<div class="!py-1">
<div class="hover:!py-1">
<div class="!hover:py-1">
```

## 2. Canonical Class Order
Maintain consistent utility order:
Layout -> Box Model (margin, padding, border) -> Visuals (background, shadow) -> Typography -> States (hover, focus, dark).

## 3. High Density Principles (ERP / Administrative System)
UyuniAdmin is an **Enterprise Admin Dashboard**, NOT a marketing website.

| Element | Specification |
|---------|---------------|
| Base Font Size | `14px` (`text-sm`) |
| Element Spacing | `4px - 8px` (`gap-1`, `gap-2`, `space-y-2`) |
| Table Row Height | `32px - 40px` |
| Table Rows per Page | `15 - 20` rows |
| Card / Container Padding | `12px - 16px` (`p-3`, `p-4`) |
| Button Size | Compact (`32px - 38px`, `p-button-sm`) |

Avoid excessive whitespace, giant hero banners, or low-density marketing components.

## 4. Canonical Spacing & Sizing Scale (`suggestCanonicalClasses`)

**⚠️ CRITICAL**: In Tailwind CSS v4, dynamic spacing and sizing utilities resolve any numeric multiple of `--spacing` (which defaults to `4px` / `0.25rem`). Writing arbitrary pixel brackets like `w-[260px]`, `mt-[11px]`, `max-w-[170px]`, `max-w-[340px]`, `min-w-[800px]` triggers Tailwind Language Server `suggestCanonicalClasses` warnings.

Always calculate the canonical class using the formula:
$$\text{Canonical value} = \frac{\text{Pixel value}}{4}$$

| Arbitrary Bracket (❌ FORBIDDEN) | Canonical v4 (✅ REQUIRED) | Cálculo ($n / 4$) |
|---------------------------------|---------------------------|-------------------|
| `rounded-[2px]` | `rounded-xs` | Token semántico nativo v4 ($2\text{px}$) |
| `rounded-l-[2px]` | `rounded-l-xs` | Token nativo borde izquierdo ($2\text{px}$) |
| `size-[19px]!` | `size-4.75!` | $19 / 4 = 4.75$ con modificador `!` sufijo |
| `pl-[39px]` | `pl-9.75` | $39 / 4 = 9.75$ |
| `max-w-[190px]` | `max-w-47.5` | $190 / 4 = 47.5$ |
| `h-[36px]` | `h-9` | $36 / 4 = 9$ |
| `h-[34px]` | `h-8.5` | $34 / 4 = 8.5$ |
| `w-[3.5px]` | `w-0.75` o `w-1` | Fracciones válidas ($3\text{px}$ / $4\text{px}$) |
| `mt-[11px]` | `mt-2.75` | $11 / 4 = 2.75$ |
| `w-[260px]` | `w-65` | $260 / 4 = 65$ |
| `sm:w-[540px]` | `sm:w-135` | $540 / 4 = 135$ |
| `md:w-[650px]` | `md:w-162.5` | $650 / 4 = 162.5$ |
| `lg:w-[750px]` | `lg:w-187.5` | $750 / 4 = 187.5$ |
| `max-w-[170px]` | `max-w-42.5` | $170 / 4 = 42.5$ |
| `max-w-[250px]` | `max-w-62.5` | $250 / 4 = 62.5$ |
| `max-w-[300px]` | `max-w-75` | $300 / 4 = 75$ |
| `max-w-[340px]` | `max-w-85` | $340 / 4 = 85$ |
| `max-w-[420px]` | `max-w-105` | $420 / 4 = 105$ |
| `max-w-[450px]` | `max-w-112.5` | $450 / 4 = 112.5$ |
| `max-w-[500px]` | `max-w-125` | $500 / 4 = 125$ |
| `max-w-[630px]` | `max-w-157.5` | $630 / 4 = 157.5$ |
| `min-w-[800px]` | `min-w-200` | $800 / 4 = 200$ |
| `h-[180px]` | `h-45` | $180 / 4 = 45$ |
| `max-h-[350px]` | `max-h-87.5` | $350 / 4 = 87.5$ |

### Why this happens:
Tailwind v4 replaces the rigid v3 numerical map with a continuous mathematical scale based on `--spacing: 0.25rem`. As a result, fractional numbers (`w-2.75`, `max-w-42.5`, `max-w-162.5`) are valid first-class citizens. Avoid bracket syntax for spacing unless using arbitrary CSS units (e.g. `calc()`, `dvh`).


