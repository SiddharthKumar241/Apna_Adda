let listings = [];
let filteredListings = [];

function renderListings(data) {
  const container = document.getElementById("listingContainer");
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = "<p>No listings found.</p>";
    return;
  }

 data.forEach((listing) => {
  const card = document.createElement("div");
  card.className = "listing-card";
  card.setAttribute("data-rent", `₹${listing.rent}`);

  card.innerHTML = `
    <img src="/${listing.image}" alt="${listing.title}" />
    <div class="content">
      <h3>${listing.title}</h3>
      <p><strong>City:</strong> ${listing.city}</p>
      <p><strong>Type:</strong> ${listing.type}</p>
      <p><strong>Area:</strong> ${listing.area || 'N/A'}</p>
      <div class="rent">₹${listing.rent}</div>
      <div class="posted">Posted on: ${listing.dateAdded}</div>
    </div>
  `;
  container.appendChild(card);
});

}

function applyAllFilters() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const filterCity = filterCityInput.value.trim().toLowerCase();
  const filterPrice = Number(filterPriceInput.value);
  const filterType = filterTypeInput.value.toLowerCase();

  filteredListings = listings.filter(listing => {
    const cityMatch = listing.city.toLowerCase().includes(filterCity);
    const priceMatch = listing.rent <= filterPrice;
    const typeMatch = filterType === "any" || listing.type.toLowerCase() === filterType;

    const searchMatch = searchTerm === "" || 
                        listing.city.toLowerCase().includes(searchTerm) || 
                        listing.title.toLowerCase().includes(searchTerm);

    return cityMatch && priceMatch && typeMatch && searchMatch;
  });

  renderListings(filteredListings);
}

async function fetchListings() {
  try {
    const response = await fetch('/api/listings'); // Now using backend
    const data = await response.json();
    listings = data;
    filteredListings = listings;
    renderListings(listings);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

fetchListings();

// DOM elements
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const filterCityInput = document.getElementById("filterCity");
const filterPriceInput = document.getElementById("filterPrice");
const filterTypeInput = document.getElementById("filterType");
const priceValue = document.getElementById("priceValue");
const applyFiltersBtn = document.getElementById("applyFilters");

filterPriceInput.addEventListener("input", function() {
  priceValue.textContent = `₹${filterPriceInput.value}`;
});

searchForm.addEventListener("submit", function(event) {
  event.preventDefault();
  applyAllFilters();
});

applyFiltersBtn.addEventListener("click", function() {
  applyAllFilters();
});
