class ShoppingCart {
    constructor(products, currency) {
        // Indexamos el catálogo por SKU y guardamos aparte las cantidades elegidas
        this.productsBySku = new Map(products.map((product) => [product.SKU, product]));
        this.quantities = new Map();
        this.currency = currency;
    }

    // Cambia las unidades de un producto sin superar el stock
    updateQuantity(sku, quantity) {
        const product = this.productsBySku.get(sku);
        if (!product) throw new Error(`Producto desconocido: ${sku}`);
        if (!Number.isInteger(quantity) || quantity < 0 || quantity > product.stock) {
            throw new RangeError(`Cantidad inválida de ${sku}`);
        }

        // Una cantidad de cero elimina el producto del carrito
        if (quantity === 0) {
            this.quantities.delete(sku);
        } else {
            this.quantities.set(sku, quantity);
        }
    }

    // Devuelve los datos del producto junto con sus unidades seleccionadas
    getProductInfo(sku) {
        const product = this.productsBySku.get(sku);
        if (!product) return undefined;
        return { ...product, sku, quantity: this.quantities.get(sku) ?? 0 };
    }

    // Devuelve los productos añadidos, la moneda y el total calculado
    getCart() {
        // Reunimos los datos de los productos que tienen unidades seleccionadas
        const products = Array.from(this.quantities.keys(), (sku) => this.getProductInfo(sku));
        // Sumamos precio por cantidad y redondeamos el total a dos decimales
        const total = Number(products.reduce((sum, product) => sum + Number(product.price) * product.quantity, 0).toFixed(2));
        return { products, total, currency: this.currency };
    }
}
