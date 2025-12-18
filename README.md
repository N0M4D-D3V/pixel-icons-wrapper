# Pixel Icons (CSS wrapper)

Un día me cansé de copiar y pegar SVGs de pixelarticons.com en cada proyecto. Quería que esos píxeles se comportaran como una tipografía: un archivo CSS, unas clases reutilizables y listo. De ahí salió esta mini librería: un envoltorio CSS que empaqueta los SVG de pixelarticons.com y los expone como iconos listos para usar.

## ¿Qué hay aquí?
- Todos los iconos SVG de [pixelarticons.com](https://pixelarticons.com) transformados en máscaras CSS.
- Clase base `.i` y una clase específica por icono (`.i-home`, `.i-user`, etc.).
- Solo se distribuye el CSS generado (`dist/pixel-icons.css`); los SVG originales viven en `icons/`.

## Instalación ligera
- Copia `dist/pixel-icons.css` a tus assets estáticos y enlázalo con `<link rel="stylesheet" href="/dist/pixel-icons.css" />`.
- Con bundlers puedes importarlo directamente: `import "./dist/pixel-icons.css";`.

## Uso rápido
El color y el tamaño se heredan, así que ajusta con `color` y `font-size` como si fuera texto.

```html
<link rel="stylesheet" href="/dist/pixel-icons.css" />

<span class="i i-home" aria-hidden="true"></span>
<span class="i i-user" style="font-size:32px; color:#00e5ff;" aria-hidden="true"></span>
```

## Personalización rápida
- **Color:** cambia `color` del elemento padre o del icono (`color: tomato;`).
- **Tamaño:** ajusta `font-size` (`font-size: 24px;` o `1.5rem`).
- **Alineación:** la clase base ya incluye un leve `vertical-align` para que se asiente bien con texto; ajusta si usas line-heights exóticos.

## Cómo se genera el CSS
El CSS se construye a partir de los SVG de `icons/` con un script de Node (ESM puro).

```zsh
node scripts/build-css.mjs
```

Este comando:
- Normaliza cada SVG, lo pasa a `data:image/svg+xml` y lo inyecta como `mask-image`.
- Genera `dist/pixel-icons.css` con la clase base `.i` y todas las variantes `.i-<nombre>`.
- Te avisa si algún SVG no tiene `viewBox` (recomendado para escalado correcto).

## Añadir o editar iconos
1) Coloca tu SVG en `icons/`. El nombre del archivo define la clase (`home.svg` -> `.i-home`).  
2) Ejecuta `node scripts/build-css.mjs`.  
3) Usa la nueva clase en tu HTML/CSS.

## Créditos
Los iconos originales pertenecen a [pixelarticons.com](https://pixelarticons.com). Este repositorio solo ofrece un wrapper CSS para utilizarlos más cómodamente.
