const prixm4 = 259;
const prixm8 = 349;
const prixgti = 189;
const prixr8 = 389;
const prixserie4 = 229;

async function updatePrices() {
  try {
    // Get user's IP address
    const ipResponse = await fetch('https://api64.ipify.org?format=json');
    const ipData = await ipResponse.json();
    const userIP = ipData.ip;
    console.log('User IP:', userIP);

    // Get location info using IP address
    const locationResponse = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=bd57c90ff4f3451c8a9ae1ab99947b9b=${userIP}`);
    const locationData = await locationResponse.json();
    console.log('Location Data:', locationData);

    const currency = locationData.currency && locationData.currency.code;
    console.log('Currency:', currency);

    if (!currency) {
      throw new Error('Currency not found in location data');
    }

    // Get exchange rate for user's currency
    const exchangeResponse = await fetch(`https://api.currencyapi.com/v3/latest?apikey=${APIKEY}&currencies=${currency}&base_currency=EUR`);
    const exchangeData = await exchangeResponse.json();
    console.log('Taux de change:', exchangeData);

    const taux = exchangeData.data[currency]?.value;
    if (!taux) {
      throw new Error('Exchange rate not found');
    }

    // Update prices in the DOM
    const prices = [
      { id: "prixm4", value: prixm4 },
      { id: "prixm8", value: prixm8 },
      { id: "prixgti", value: prixgti },
      { id: "prixr8", value: prixr8 },
      { id: "prixserie4", value: prixserie4 }
    ];

    prices.forEach(price => {
      const priceElement = document.getElementById(price.id);
      if (priceElement) {
        priceElement.textContent = `${(price.value * taux).toFixed(2)} ${currency}`;
      }
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

updatePrices();
