# Actividad 1 · Carrito de la compra

Catálogo de Pokémon con carrito de compra para Desarrollo Web en Entorno Cliente. La API local (`api.php`) devuelve 25 productos y su stock; `shopping-cart.js` gestiona las cantidades y el total sin acceder al DOM, y `script.js` muestra el catálogo y el carrito.

## Cómo abrirlo

Con XAMPP, copia la carpeta del proyecto dentro de `htdocs`, inicia Apache y abre `http://localhost/actividad1/` (si la carpeta se llama `actividad1`).

También puedes ejecutar `php -S localhost:8007` desde esta carpeta y abrir `http://localhost:8007`.

No abras `index.html` directamente como `file://`: la página necesita que el servidor ejecute `api.php`. Tailwind, las fuentes y las imágenes se cargan desde Internet.

Al final de la página hay una breve explicación de cómo funciona cada función.
