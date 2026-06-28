---
title: "Scoped & Global CSS"
description: "Master scoped styling and global styles inside Avenx-JS components."
---

Styling is defined in the companion `.component.css` stylesheet. At compile-time, the Avenx compiler scopes component styles to keep them from bleeding into other views.

## 1. Scoped CSS Blocks (`<@css>`)

CSS rules defined inside `<@css>` are hashed and appended with a unique class suffix. The compiler extracts this CSS and merges the generated class directly into the component's HTML tags.

```css
<@css>
    .card {
        padding: 1.5rem;
        border: 1px solid #eee;
    }
    
    /* Nesting references with & represent the component's scoped class */
    &:hover {
        border-color: #6366f1;
    }
</@css>
```

## 2. Global CSS & Custom Variables (`<@global>`)

Declare global styles or design token variables using the `<@global>` block. Use the `@def` directive to define custom color codes or measurements. The compiler replaces these variables statically at build time.

```css
<@global>
    @def primary-color #6366f1;
    @def font-sans 'Inter', sans-serif;
    
    body {
        margin: 0;
        font-family: @font-sans;
    }
</@global>

<@css>
    .btn {
        background-color: @primary-color;
        color: white;
    }
</@css>
```
