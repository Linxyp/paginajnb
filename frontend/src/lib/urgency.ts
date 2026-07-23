/**
 * Promo-pricing helpers shared by every product touchpoint (home cards,
 * catalog, related products, product page). Pure, server-safe — no React,
 * no browser APIs — so it can be imported from Server Components too.
 *
 * The "before" price is deliberately NOT a separate fabricated number stored
 * somewhere — it's derived from the real listed price with a per-product
 * (but stable) markup, so the displayed discount always matches the actual
 * price the customer pays and never drifts out of sync with it.
 */

const hashId = (id: string): number => {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
    return h;
};

/** Stable per-product discount between 18% and 32%, derived from the product id. */
export const getDiscountPercent = (id: string): number => 18 + (hashId(id) % 15);

/** "Before" price implied by the current price and that product's discount percent. */
export const getAnchorPrice = (price: number, id: string): number => {
    const pct = getDiscountPercent(id);
    const anchor = price / (1 - pct / 100);
    return Math.round(anchor / 1000) * 1000;
};

/** Slugs of the newly-added products — used to show a "Nuevo" ribbon and to feature them on the home page. */
export const NEW_PRODUCT_SLUGS = ['subwoofer-jnb-caja', 'led-toyota-parrilla', 'amplificador-jnb-sl2000'];
