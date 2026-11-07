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

