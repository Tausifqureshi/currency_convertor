const BASE_URL =
  "https://v6.exchangerate-api.com/v6/a90210b667953f2ad04c7bc8/latest/USD";

// TODO: Query selectors for HTML elements
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector(".amount input");
const loadingSpinner = document.querySelector(".loading-spinner");

const showLoading = () => {
  loadingSpinner.style.display = "block";
};

const hideLoading = () => {
  loadingSpinner.style.display = "none";
};

// Populate dropdowns with currency codes from countryList
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }

    select.append(newOption);
  }

  // Add event listener to update flag on currency change
  select.addEventListener("change", (event) => {
    updateFlag(event.target);
  });
}

// Function to update flag image based on selected currency
const updateFlag = (element) => {
  const currencyName = element.value;
  const countryCode = countryList[currencyName];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Function to fetch and update exchange rate
const updateExchangeRate = async () => {
  let amtVal = amountInput.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amountInput.value = "1";
  }
  showLoading(); // Show loading animation

  try {
    let response = await fetch(`${BASE_URL}`);
    console.log(response);

    if (!response.ok) throw new Error("Failed to fetch exchange rates");

    let data = await response.json();
    console.log(data);

    // Extracting the relevant exchange rate
    let rate = data.conversion_rates[toCurr.value];
    console.log(rate);
    if (!rate) throw new Error(`Exchange rate for ${toCurr.value} not found`);

    let finalAmount = amtVal * rate;

    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${
      toCurr.value
    }`;
  } catch (error) {
    console.error(error);
    msg.innerText = "Failed to retrieve exchange rate. Please try again later.";
  } finally {
    hideLoading(); // Hide loading animation
  }
};

// Event listener for button click to update exchange rate
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Update exchange rate on window load
window.addEventListener("load", () => {
  updateExchangeRate();
});















