// Generamos las variables de los elementos HTML generales que usaremos
const productsList = document.querySelector('#products');
const statusMessage = document.querySelector('#status');
const cartItemsList = document.querySelector('#cart-items');
const cartEmptyMessage = document.querySelector('#cart-empty');
const cartCount = document.querySelector('#cart-count');
const cartMobileCount = document.querySelector('#cart-mobile-count');
const cartTotal = document.querySelector('#cart-total');
const checkoutButton = document.querySelector('#checkout-button');

let currency = '€';

// La clase ShoppingCart gestiona las unidades y los cálculos sin acceder al HTML
let shoppingCart;
const addButtons = new Map();

// Estilos de color según el tipo de Pokémon
const typeStyles = {
    normal: 'border-stone-400/30 bg-stone-400/15 text-stone-300',
    fire: 'border-red-400/30 bg-red-500/15 text-red-300',
    water: 'border-blue-400/30 bg-blue-500/15 text-blue-300',
    electric: 'border-yellow-400/30 bg-yellow-500/15 text-yellow-300',
    grass: 'border-green-400/30 bg-green-500/15 text-green-300',
    ice: 'border-cyan-300/30 bg-cyan-400/15 text-cyan-200',
    fighting: 'border-orange-400/30 bg-orange-500/15 text-orange-300',
    poison: 'border-purple-400/30 bg-purple-500/15 text-purple-300',
    ground: 'border-amber-500/30 bg-amber-600/15 text-amber-300',
    flying: 'border-sky-300/30 bg-sky-400/15 text-sky-200',
    psychic: 'border-pink-400/30 bg-pink-500/15 text-pink-300',
    bug: 'border-lime-400/30 bg-lime-500/15 text-lime-300',
    rock: 'border-yellow-700/40 bg-yellow-800/20 text-yellow-200',
    ghost: 'border-violet-400/30 bg-violet-500/15 text-violet-300',
    dragon: 'border-indigo-400/30 bg-indigo-500/15 text-indigo-300',
    dark: 'border-slate-400/30 bg-slate-500/20 text-slate-300',
    steel: 'border-slate-300/30 bg-slate-400/15 text-slate-200',
    fairy: 'border-fuchsia-300/30 bg-fuchsia-400/15 text-fuchsia-200',
};

// Función útil para generar el String del precio con la moneda seleccionada
const formatPrice = (price) => `${Number(price).toFixed(2).replace('.', ',')} ${currency}`;

// Función para generar y retornar el ítem del carrito
function createCartItem(product, quantity, sku) {
    const item = document.createElement('li');
    item.className = 'flex items-center gap-3';
    const image = document.createElement('img');
    image.className = 'h-12 w-12 shrink-0 rounded-xl bg-zinc-700 object-contain';
    image.src = product.image;
    image.alt = '';
    const details = document.createElement('div');
    details.className = 'min-w-0 flex-1';
    const name = document.createElement('p');
    name.className = 'mb-1 truncate text-sm font-semibold';
    name.textContent = product.title;
    const price = document.createElement('span');
    price.className = 'text-sm text-zinc-400';
    price.textContent = formatPrice(Number(product.price) * quantity);
    details.append(name, price);

    // Creamos un select de la cantidad del producto en el carrito
    const quantitySelect = document.createElement('select');
    quantitySelect.className = 'rounded-lg border border-zinc-600 bg-zinc-800 p-1 text-sm text-zinc-100';
    quantitySelect.setAttribute('aria-label', `Cantidad de ${product.title}`);
    // Solo dejamos añadir al carrito la cantidad del stock que nos devuelve el "fetch" inicial
    for (let amount = 1; amount <= product.stock; amount++) {
        const option = document.createElement('option');
        option.value = amount.toString();
        option.textContent = amount.toString();
        quantitySelect.append(option);
    }
    quantitySelect.value = quantity;
    // Evento que se lanza cuando alguno de los select cambia del valor
    quantitySelect.addEventListener('change', () => {
        // Guardamos en ShoppingCart la cantidad elegida.
        shoppingCart.updateQuantity(sku, Number(quantitySelect.value));
        renderCart();
    });

    const removeButton = document.createElement('button');
    removeButton.className = 'cursor-pointer border-0 bg-transparent p-1 text-lg text-zinc-400 hover:text-red-300';
    removeButton.type = 'button';
    removeButton.setAttribute('aria-label', `Quitar ${product.title} del carrito`);
    removeButton.textContent = '×';
    removeButton.addEventListener('click', () => {
        // Poner la cantidad a cero elimina el producto de ShoppingCart
        shoppingCart.updateQuantity(sku, 0);
        renderCart();
    });

    item.append(image, details, quantitySelect, removeButton);
    return item;
}

// Actualizamos el estado de los botones de las cards de producto según si aún queda stock
function updateAddButtons() {
    addButtons.forEach(({ button, product }, sku) => {
        // Consultamos cuántas unidades de este producto hay en ShoppingCart
        const quantity = shoppingCart.getProductInfo(sku).quantity;
        // Deshabilitamos y cambiamos estilos del botón si no queda stock del producto
        button.disabled = quantity >= product.stock;
        button.innerHTML = button.disabled
            ? (product.stock === 0 ? 'Agotado' : 'Máximo alcanzado')
            : '<span aria-hidden="true">＋</span> Añadir';
    });
}

// Actualizamos el carrito
function renderCart() {
    // Vaciamos la lista antes de volver a dibujar el carrito con sus cantidades actuales
    cartItemsList.replaceChildren();

    // Obtenemos los productos seleccionados y el total calculado por ShoppingCart.
    const { products, total } = shoppingCart.getCart();
    const itemCount = products.reduce((sum, product) => sum + product.quantity, 0);

    products.forEach((product) => {
        cartItemsList.append(createCartItem(product, product.quantity, product.sku));
    });

    // Actualizamos los contenidos generales del carrito
    cartCount.textContent = itemCount;
    cartMobileCount.textContent = itemCount;
    cartTotal.textContent = formatPrice(total);
    cartEmptyMessage.hidden = itemCount > 0;
    cartItemsList.classList.toggle('hidden', itemCount === 0);
    cartItemsList.classList.toggle('grid', itemCount > 0);
    checkoutButton.disabled = itemCount === 0;

    // Al volver a dibujar el carrito, actualizamos los botones de añadir
    updateAddButtons();
}

const addProductToCart = (product) => {
    // Recuperamos la cantidad actual antes de intentar añadir otra unidad
    const quantity = shoppingCart.getProductInfo(product.SKU).quantity;
    // Si ya hay tantos como permite el stock, no añadimos más
    if (quantity >= product.stock) return;
    // Actualizamos la cantidad en ShoppingCart respetando el stock
    shoppingCart.updateQuantity(product.SKU, quantity + 1);
    renderCart();
}

const addProductToCatalog = (product) => {
    const item = document.createElement('li');
    item.className = product.stock === 0
        ? 'min-h-80 overflow-hidden rounded-2xl border-2 border-zinc-800 bg-zinc-900 p-4'
        : 'min-h-80 overflow-hidden rounded-2xl border-2 border-zinc-700 bg-gradient-to-br from-zinc-800 to-zinc-900 p-4 transition duration-200 hover:-translate-y-1 hover:border-zinc-500';
    const art = document.createElement('div');
    art.className = 'relative mb-3 grid h-40 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900';
    const image = document.createElement('img');
    image.className = `h-36 w-36 object-contain drop-shadow-xl ${product.stock === 0 ? 'grayscale opacity-40' : ''}`;
    const title = document.createElement('h2');
    const sku = document.createElement('p');
    const meta = document.createElement('div');
    const price = document.createElement('strong');
    const description = document.createElement('p');
    const type = document.createElement('p');
    const bottom = document.createElement('div');
    const addButton = document.createElement('button');

    image.src = product.image;
    image.alt = product.title;
    image.loading = 'lazy';
    art.append(image);

    // Si no hay stock lo marcamos con un "Sold out"
    if (product.stock === 0) {
        const soldOut = document.createElement('span');
        soldOut.className = 'absolute rounded-lg border border-red-400 bg-zinc-900 px-3 py-1 text-sm font-bold uppercase text-red-300';
        soldOut.textContent = 'Agotado';
        art.append(soldOut);
    }

    // Rellenamos los ítems del catálogo con la información pertinente y le ponemos estilos a sus elementos
    title.className = 'mb-2 truncate font-display text-base font-semibold';
    title.textContent = product.title;
    meta.className = 'mb-2.5 flex items-center justify-between gap-2';
    sku.className = 'text-sm tracking-wide text-zinc-400';
    sku.textContent = `SKU: ${product.SKU}`;

    // Si la API devuelve un tipo desconocido, usamos un color neutro
    type.className = `rounded-full border-2 px-2 py-1 text-xs uppercase ${typeStyles[product.type] ?? 'border-zinc-400/30 bg-zinc-500/15 text-zinc-300'}`;
    type.textContent = product.type;

    meta.append(sku, type);
    description.className = 'mb-3 line-clamp-2 min-h-10 text-sm leading-normal text-zinc-300';
    description.textContent = product.description;
    const stockMessage = document.createElement('p');
    stockMessage.className = 'mb-3 text-sm text-zinc-400';
    stockMessage.textContent = product.stock === 0 ? 'Sin existencias' : `Disponibles: ${product.stock}`;
    bottom.className = 'flex items-center justify-between gap-1.5';
    price.className = 'whitespace-nowrap font-display text-base font-bold';
    price.textContent = formatPrice(product.price);

    addButton.className = 'inline-flex items-center gap-1 rounded-lg border-0 bg-lime-300 px-3 py-2 text-sm font-bold text-zinc-900 transition enabled:cursor-pointer enabled:hover:-translate-y-px enabled:hover:bg-lime-200 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400';
    addButton.type = 'button';
    addButton.disabled = product.stock === 0;
    addButton.innerHTML = product.stock === 0 ? 'Agotado' : '<span aria-hidden="true">＋</span> Añadir';

    // Guardamos el botón al Map() y los datos del producto para actualizarlo cuando se alcance el stock máximo
    addButtons.set(product.SKU, { button: addButton, product });
    // Al pulsar el botón, añadimos una unidad de este producto al carrito
    addButton.addEventListener('click', () => addProductToCart(product));

    bottom.append(price, addButton);

    item.append(art, title, meta, description, stockMessage, bottom);
    productsList.append(item);
}

// Consultamos la API de forma asíncrona y mostramos un mensaje si falla.
async function loadProducts() {
    try {
        const response = await fetch('./api.php');
        if (!response.ok) {
            throw new Error(`Error al consultar la API: ${response.status}`);
        }

        const data = await response.json();
        currency = data.currency;

        // Creamos ShoppingCart con los productos y la moneda recibidos de la API
        shoppingCart = new ShoppingCart(data.products, data.currency);

        // Creamos una tarjeta en el catálogo por cada producto recibido de la API
        data.products.forEach(addProductToCatalog);

        statusMessage.remove();
        renderCart();
    } catch (error) {
        statusMessage.textContent = 'No se pudieron cargar los productos. Comprueba que has iniciado PHP con php -S localhost:8000 (o el puerto pertinente) en la carpeta del proyecto y que has abierto http://localhost:8000 en lugar de index.html directamente';
        console.error(error);
    }
}

loadProducts();
