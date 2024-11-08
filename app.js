// Función personalizada para mostrar alertas con confirmación manual
async function showAlert(icon, title, text, showCancel = false) {
  return await Swal.fire({
    icon: icon,
    title: title,
    text: text,
    showConfirmButton: true,
    showCancelButton: showCancel,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
    allowOutsideClick: false,
    allowEscapeKey: false,
    timer: undefined,
  });
}

// Función para obtener productos de la API
async function fetchProducts(category) {
  try {
    const response = await fetch(`https://alura-geek-eta-six.vercel.app/${category}`);  // Cambiado URL a Vercel
    if (!response.ok) throw new Error(`Error ${response.status}: No se pudieron obtener los productos`);
    const products = await response.json();
    renderProducts(products, `${category}-container`);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
  }
}

// Función para renderizar productos en el DOM
function renderProducts(products, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = ''; // Limpia el contenedor antes de renderizar
  
  products.forEach(product => {
    const productElement = document.createElement('div');
    productElement.classList.add('product');
    productElement.setAttribute('data-product-id', product.id);

    productElement.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>Precio: $${product.price}</p>
      <button class="delete-btn" data-id="${product.id}">
        <img src="./Assets/cesta.svg" alt=""> Eliminar
      </button>
    `;

    productElement.querySelector(".delete-btn").addEventListener("click", (event) => {
      removeProduct(event);
    });

    container.appendChild(productElement);
  });
}

// Función para renderizar productos filtrados en el DOM
function renderFilteredProducts(products, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = ''; // Limpia el contenedor antes de renderizar

  products.forEach(product => {
    const productElement = document.createElement('div');
    productElement.classList.add('product', 'product-filtered'); // Clase específica para productos filtrados
    productElement.setAttribute('data-product-id', product.id);

    productElement.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>Precio: $${product.price}</p>
      <button class="delete-btn" data-id="${product.id}">
        <img src="./Assets/cesta.svg" alt=""> Eliminar
      </button>
    `;

    productElement.querySelector(".delete-btn").addEventListener("click", (event) => {
      removeProduct(event);
    });

    container.appendChild(productElement);
  });
}

// Función para centralizar la solicitud DELETE
async function deleteProduct(category, productId) {
  try {
    const response = await fetch(`https://alura-geek-eta-six.vercel.app/${category}/${productId}`, {  // Cambiado URL a Vercel
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`Error ${response.status}: No se pudo eliminar el producto`);
    return true;
  } catch (error) {
    console.error("Error al conectar con la API para eliminar:", error);
    return false;
  }
}

// Función para eliminar un producto
async function removeProduct(event) {
  const button = event.target.closest(".delete-btn");
  const productId = button.getAttribute("data-id");
  const categoryElement = button.closest(".product").parentNode;
  const category = categoryElement.id ? categoryElement.id.replace("-container", "") : null;

  if (!productId || !category) {
    console.error("Error: ID de producto o categoría no encontrado");
    return;
  }

  const confirmDelete = await showAlert('warning', '¿Estás seguro?', `¿Quieres eliminar el producto con ID ${productId}?`, true);
  if (confirmDelete.isConfirmed) {
    const success = await deleteProduct(category, productId);
    if (success) {
      await showAlert('success', 'Producto eliminado', `El producto con ID ${productId} ha sido eliminado exitosamente.`);
      fetchProducts(category);
    } else {
      await showAlert('error', 'Error', 'No se pudo eliminar el producto. Inténtalo de nuevo.');
    }
  }
}

// Función para agregar un producto a través de la API
async function addProduct(name, price, image, category) {
  const confirmAdd = await showAlert('info', '¿Agregar producto?', `¿Quieres agregar el producto "${name}"?`, true);
  
  if (confirmAdd.isConfirmed) {
    try {
      const response = await fetch(`https://alura-geek-eta-six.vercel.app/${category}`, {  // Cambiado URL a Vercel
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, price, image }),
      });

      if (response.ok) {
        await showAlert('success', 'Producto agregado', `El producto "${name}" ha sido agregado exitosamente.`);
        fetchProducts(category);
      } else {
        await showAlert('error', 'Error', 'No se pudo agregar el producto. Inténtalo de nuevo.');
        console.error("Error al agregar el producto:", response.statusText);
      }
    } catch (error) {
      await showAlert('error', 'Error de conexión', 'No se pudo conectar con la API. Inténtalo de nuevo.');
      console.error("Error al conectar con la API:", error);
    }
  }
}

// Función para buscar productos
async function searchProducts(query) {
  // Obtener productos de ambas categorías
  const categories = ['games', 'anime'];
  
  for (const category of categories) {
    try {
      const response = await fetch(`https://alura-geek-eta-six.vercel.app/${category}`);  // Cambiado URL a Vercel
      if (!response.ok) throw new Error(`Error ${response.status}: No se pudieron obtener los productos`);
      
      const products = await response.json();
      // Filtrar productos que coincidan con la consulta de búsqueda
      const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase())
      );

      // Renderizar productos filtrados solo en su contenedor correspondiente
      renderFilteredProducts(filteredProducts, `${category}-container`);
    } catch (error) {
      console.error(`Error al obtener productos de la categoría ${category}:`, error);
    }
  }
}

// Event listener para la barra de búsqueda
document.getElementById("search-bar").addEventListener("input", (event) => {
  const query = event.target.value;
  
  if (query.trim() === '') {
    fetchProducts('games');
    fetchProducts('anime');
  } else {
    searchProducts(query);
  }
});

// Event listener para el formulario de agregar producto
document.getElementById("cart-form").addEventListener("submit", (event) => {
  event.preventDefault();
  
  const name = document.getElementById("product-name-wide").value;
  const price = parseFloat(document.getElementById("product-price-wide").value);
  const category = document.getElementById("product-category-wide").value.toLowerCase();
  const image = document.getElementById("product-image-wide").value;

  // Validación básica de categoría
  if (category !== "games" && category !== "anime") {
    showAlert('error', 'Categoría no válida', 'Por favor, ingresa "games" o "anime" como categoría.');
    return;
  }

  addProduct(name, price, image, category);
  event.target.reset(); // Limpia el formulario después de agregar el producto
});

// Inicializa la carga de productos en el DOM
document.addEventListener('DOMContentLoaded', () => {
  fetchProducts('games');
  fetchProducts('anime');
});

