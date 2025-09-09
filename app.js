const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((categories) => displayCategories(categories.categories));
};
loadCategories();
const displayCategories = (categories) => {
  const categoryContainer = document.getElementById("category-container");
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = `
    <div class="text-center text-gray-500 py-10 font-medium col-span-3 m-auto flex flex-col justify-center items-center gap-4">
        <i class="fa-solid fa-triangle-exclamation text-7xl"></i>
        <h1>Please select any category</h1>
    </div>
  `;
  const allButtonDiv = document.createElement("div");
  allButtonDiv.innerHTML = `
    <button class="w-full text-left lg:pl-3 py-2 hover:bg-[#15803D] hover:text-white duration-200 cursor-pointer rounded-md font-medium text-[16px] category-btn border lg:border-none flex px-5 border-green-500">
      All Trees
    </button>
  `;
  categoryContainer.appendChild(allButtonDiv);
  allButtonDiv.querySelector("button").addEventListener("click", (e) => {
    activeButton(e.target);
    cardContainer.innerHTML = `
    <div class="text-center py-10 font-medium col-span-3 m-auto flex flex-col justify-center items-center gap-4">
        <span class="loading loading-infinity loading-xl"></span>
    </div>
    `;
    fetch("https://openapi.programming-hero.com/api/plants")
      .then((res) => res.json())
      .then((plants) => displayAllPlants(plants.plants));
  });
  categories.forEach((category) => {
    const eachCategoryDiv = document.createElement("div");
    eachCategoryDiv.innerHTML = `
      <button class="w-full text-left lg:pl-3 py-2 hover:bg-[#15803D] hover:text-white duration-200 cursor-pointer rounded-md font-medium text-[16px] category-btn border lg:border-none mx-auto px-5 border-green-500">
        ${category.category_name}
      </button>
    `;
    categoryContainer.appendChild(eachCategoryDiv);
    eachCategoryDiv.querySelector("button").addEventListener("click", (e) => {
      activeButton(e.target);
      cardContainer.innerHTML = `
        <div class="text-center py-10 font-medium col-span-3 m-auto flex flex-col justify-center items-center gap-4">
        <span class="loading loading-infinity loading-xl"></span>
    </div>
      `;
      fetch(`https://openapi.programming-hero.com/api/category/${category.id}`)
        .then((res) => res.json())
        .then((plants) => {
          if (plants.plants && plants.plants.length > 0) {
            displayAllPlants(plants.plants);
          } else {
            showEmptyMessage();
          }
        });
    });
  });
};
const displayAllPlants = (plantsArray) => {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";

  plantsArray.forEach((plant) => {
    const card = document.createElement("div");
    card.innerHTML = `
      <div class="flex flex-col p-4 gap-3 bg-white rounded-[8px] shadow hover:scale-105 duration-200">
        <div class="img-part">
          <img src="${plant.image}" alt="" class="w-full h-40 object-cover rounded">
        </div>
        <div class="text-part flex flex-col gap-2">
          <h1 class="font-semibold text-[14px] text-[#1F2937]">${plant.name}</h1>
          <p class="text-[12px] text-[#1F2937]">${plant.description}</p>
          <div class="flex justify-between">
            <div class="font-medium text-[14px] rounded-full bg-[#DCFCE7] py-1 px-3 text-[#15803D]">
              ${plant.category}
            </div>
            <div class="font-semibold text-[14px] text-[#1F2937]">
              ৳${plant.price}
            </div>
          </div>
        </div>
        <div class="button py-3 text-center bg-[#15803D] rounded-full font-medium text-[16px] text-white cursor-pointer">
          Add to Cart
        </div>
      </div>
    `;
    cardContainer.appendChild(card);
    card.querySelector(".button").addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(plant);
    });
    card.addEventListener("click", () => {
      const modal = document.getElementById("plantModal");
      document.getElementById("modalTitle").textContent = plant.name;
      document.getElementById("modalImage").src = plant.image;
      document.getElementById("modalDescription").textContent =
        plant.description;
      modal.showModal();
    });
  });
};
let cartTotal = 0;
const addToCart = (plant) => {
  const cartContainer = document.querySelector(".addToCart");
  const cartItem = document.createElement("div");
  cartItem.classList.add(
    "flex",
    "items-center",
    "gap-3",
    "bg-white",
    "rounded-md",
    "p-3",
    "shadow",
    "justify-between",
    "bg-[#F0FDF4]!",
    "hover:bg-[#B3FFCA]!"
  );
  cartItem.innerHTML = `
        <div class="flex flex-col">
            <h1 class="font-semibold text--[14px] text-[#1F2937]">${plant.name}</h1>
            <p class="text-[16px] text-[#1F2937]">৳${plant.price} x 1</p>
        </div>
        <button class="text-[#8C8C8C] hover:text-red-700 text-[16px] cursor-pointer">✕</button>
    `;
  cartContainer.appendChild(cartItem);
  cartTotal += plant.price;
  updateCartTotal();
  cartItem.querySelector("button").addEventListener("click", () => {
    cartItem.remove();
    cartTotal -= plant.price;
    updateCartTotal();
  });
};
const showEmptyMessage = () => {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = `
    <div class="text-center text-gray-500 py-10 font-medium col-span-3 m-auto flex flex-col justify-center items-center gap-4">
        <i class="fa-solid fa-circle-xmark text-7xl"></i>
        <h1>No plants found in this category</h1>
    </div>
  `;
};
const activeButton = (clickedBtn) => {
  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.classList.remove("active-element");
  });
  clickedBtn.classList.add("active-element");
};
const updateCartTotal = () => {
  const totalElement = document.getElementById("cart-total");
  totalElement.textContent = `৳${cartTotal}`;
};
