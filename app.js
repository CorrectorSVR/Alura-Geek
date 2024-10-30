// Simulación de datos de productos
const products = {
  games: [
    { id: 1, name: "Panzer Dragoon Saga", price: 79.99, image: "https://static.wikia.nocookie.net/panzerdragoon/images/d/d8/Panzer-dragoon-saga-pal-version-box-front.jpg" },
    { id: 2, name: "Fatal Frame II", price: 34.99, image: "https://static.wikia.nocookie.net/fatalframe/images/e/ec/Project_Zero_2wiiedit.jpg" },
    { id: 3, name: "Drakengard 3", price: 49.99, image: "https://static.wikia.nocookie.net/drakengard/images/7/70/Drakengard_3_-_US_Standard_Box_Art2.png" },
    { id: 4, name: "Link Between Worlds", price: 29.99, image: "https://static.wikia.nocookie.net/zelda_gamepedia_en/images/4/46/A_Link_Between_Worlds_cover.jpg" },
  ],
  anime: [
    { id: 1, name: "Cowboy Bebop", price: 19.99, image: "https://static.wikia.nocookie.net/dubbing9585/images/7/75/CowBe.jpg" },
    { id: 2, name: "Ghost in the Shell", price: 24.99, image: "https://static.wikia.nocookie.net/typemoon/images/f/fe/Fate_zero_anime_1st_season.jpg" },
    { id: 3, name: "Lain", price: 28.99, image: "https://static.wikia.nocookie.net/sel/images/8/80/DVD-Lain_Cover.jpg" },
    { id: 4, name: "Boogiepop", price: 26.55, image: "https://static.wikia.nocookie.net/boogiepop/images/e/e7/BoogiepopWaWarawanai2019.jpg" },
  ],
};

// Función para renderizar productos en el DOM
function renderProducts(products, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = ''; // Limpia el contenedor antes de renderizar
  
  products.forEach(product => {
    const productElement = document.createElement('div');
    productElement.classList.add('product');

    productElement.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>Precio: $${product.price}</p>
      <button onclick="addToCart(${product.id}, '${containerId}')">Agregar al carrito</button>
    `;

    container.appendChild(productElement);
  });
}

// Función para agregar un producto al carrito
function addToCart(productId, category) {
  const selectedProduct = products[category].find(product => product.id === productId);
  console.log(`Producto añadido:`, selectedProduct);
  // Aquí puedes manejar la lógica de agregar el producto a un carrito de compras
}

// Inicializa la carga de productos en el DOM
document.addEventListener('DOMContentLoaded', () => {
  renderProducts(products.games, 'games-container');
  renderProducts(products.anime, 'anime-container');
});
