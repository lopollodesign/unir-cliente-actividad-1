# Actividad 1 · Carrito de la compra

Catálogo de Pokémon con carrito de compra para Desarrollo Web en Entorno Cliente. La API local (`api.php`) devuelve 25 productos y su stock; `shopping-cart.js` gestiona las cantidades y el total sin acceder al DOM, y `script.js` muestra el catálogo y el carrito.

## Cómo abrirlo

Con XAMPP, copia la carpeta del proyecto dentro de `htdocs`, inicia Apache y abre `http://localhost/actividad1/` (si la carpeta se llama `actividad1`).

También puedes ejecutar `php -S localhost:8007` desde esta carpeta y abrir `http://localhost:8007`.

No abras `index.html` directamente como `file://`: la página necesita que el servidor ejecute `api.php`. Tailwind, las fuentes y las imágenes se cargan desde Internet.

## Cómo funciona

La página consulta `api.php` con `fetch` y `async/await`. La API devuelve 25 Pokémon, su precio, tipo, imagen y stock; cinco están agotados. Las tarjetas se crean desde JavaScript y se estilizan con Tailwind.

El carrito limita las unidades al stock disponible y actualiza el total al añadir, cambiar la cantidad o quitar un producto. Su contenido solo se conserva mientras la página está abierta.

## Diseño con Tailwind CSS

La página carga [Tailwind CSS](https://tailwindcss.com/) desde su CDN en `index.html`, sin instalación ni proceso de compilación. Los estilos se aplican mediante clases de utilidad: en el HTML para la estructura de la página y en `script.js` para las tarjetas y los elementos del carrito creados dinámicamente.

Se utilizan clases responsivas para mostrar el carrito a la derecha en pantallas grandes y debajo del catálogo en pantallas pequeñas. Los colores de las etiquetas de tipo Pokémon se eligen en `script.js` según el tipo recibido de la API. En `index.html` también se configuran las fuentes DM Sans y Space Grotesk para usarlas con las clases `font-sans` y `font-display`.

## Clase ShoppingCart

Gestiona los productos, las cantidades y el total sin acceder al DOM.

| Método | Qué hace |
| --- | --- |
| `constructor()` | Guarda los productos y la moneda recibidos de la API |
| `updateQuantity()` | Añade, cambia o elimina unidades, respetando el stock |
| `getProductInfo()` | Devuelve los datos y las unidades de un producto |
| `getCart()` | Devuelve los productos seleccionados, la moneda y el total |

## Funciones generales (`script.js`)

| Función | Qué hace |
| --- | --- |
| `formatPrice()` | Muestra el precio con dos decimales y el símbolo de la moneda |
| `createCartItem()` | Crea un producto del carrito y su selector de unidades |
| `updateAddButtons()` | Desactiva Añadir cuando se alcanza el stock |
| `renderCart()` | Redibuja el carrito, sus contadores y el total |
| `addProductToCart()` | Suma una unidad al carrito |
| `addProductToCatalog()` | Crea una tarjeta para cada producto del catálogo |
| `loadProducts()` | Consulta la API, prepara el carrito y carga el catálogo |
