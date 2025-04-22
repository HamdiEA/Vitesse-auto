const prixm4 = 259;
const prixm8 = 349;
const prixgti = 189;
const prixr8 = 389;
const prixserie4 = 229;

const prices = [
  { id: "prixm4", value: prixm4 },
  { id: "prixm8", value: prixm8 },
  { id: "prixgti", value: prixgti },
  { id: "prixr8", value: prixr8 },
  { id: "prixserie4", value: prixserie4 }
];

// Show base prices in EUR immediately
prices.forEach(price => {
  const priceElement = document.getElementById(price.id);
  if (priceElement) {
    priceElement.textContent = `${price.value.toFixed(2)} EUR`;
  }
});

async function updatePrices() {
  try {
    const cached = JSON.parse(localStorage.getItem("currencyData"));
    const now = Date.now();
    if (cached && cached.timestamp && now - cached.timestamp < 12 * 60 * 60 * 1000) {
      applyPrices(cached.rate, cached.currency);
      return;
    }

    // Get user IP
    const ipResponse = await fetch('https://api64.ipify.org?format=json');
    const ipData = await ipResponse.json();
    const userIP = ipData.ip;

    // Get location and currency
    const locationResponse = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=bd57c90ff4f3451c8a9ae1ab99947b9b&ip=${userIP}`);
    const locationData = await locationResponse.json();
    const currency = locationData.currency?.code;

    if (!currency) throw new Error("Currency not found");

    // Get exchange rate from CurrencyAPI
    const apiKey = "cur_live_QnyNOtnqT8Dtxi3L8QlQquSJlNUFQKhwcrpOPQ0Q"; // Replace with your CurrencyAPI key
    const exchangeResponse = await fetch(`https://api.currencyapi.com/v3/latest?apikey=${apiKey}&base_currency=EUR&currencies=${currency}`);
    const exchangeData = await exchangeResponse.json();
    const rate = exchangeData.data[currency]?.value;

    if (!rate) throw new Error("Exchange rate not found");

    // Cache the result
    localStorage.setItem("currencyData", JSON.stringify({
      rate,
      currency,
      timestamp: now
    }));

    applyPrices(rate, currency);

  } catch (error) {
    console.error("Error updating prices:", error);
  }
}

function applyPrices(rate, currency) {
  prices.forEach(price => {
    const priceElement = document.getElementById(price.id);
    if (priceElement) {
      priceElement.textContent = `${(price.value * rate).toFixed(2)} ${currency}`;
    }
  });
}

updatePrices();
