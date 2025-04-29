document.addEventListener("DOMContentLoaded", async function () {

  //Extracts the model name from the path of the html file
  const modelName = window.location.pathname.split("/").pop().replace(".html", "");

  // Local price lookup
  //Each car model has a specific price
  const prixMap = {
    "BMW-M4": 259,
    "BMW-M8": 349,
    "Audi": 0,
    "audi-r8": 389,
    "bmwserie4": 229,
    "gti": 189
  };

  const prix = prixMap[modelName] || 0;

  let currency = "EUR";// Default currency
  let taux = 1;// Default exchange rate

  try {
    // Fetch IP address
    const ipRes = await fetch('https://api64.ipify.org?format=json');
    if (!ipRes.ok) throw new Error('Failed to fetch IP address');
    const ipData = await ipRes.json();

    // Fetch location data
    const locRes = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=bd57c90ff4f3451c8a9ae1ab99947b9b&ip=${ipData.ip}`);
    if (!locRes.ok) throw new Error('Failed to fetch location data');
    const locData = await locRes.json();
    
    currency = locData.currency?.code || "EUR";

    // Fetch currency exchange rate
    const exRes = await fetch(`https://api.currencyapi.com/v3/latest?apikey=cur_live_QnyNOtnqT8Dtxi3L8QlQquSJlNUFQKhwcrpOPQ0Q&currencies=${currency}&base_currency=EUR`);
    if (!exRes.ok) throw new Error('Failed to fetch currency exchange rate');
    const exData = await exRes.json();
    taux = exData.data[currency].value;
  } catch (e) {
    console.error("Erreur de localisation ou taux :", e);
  }

  const finalPrice = Math.round(prix * taux);
  const priceElement = document.createElement("div");
  priceElement.className = "fw-bold mb-2";
  priceElement.textContent = `Prix : ${finalPrice} ${currency}`;

  const louerBtn = document.getElementById("btn-forum");
  if (louerBtn && louerBtn.parentNode) {
    // Hide the button initially
    louerBtn.style.visibility = "hidden";
    louerBtn.parentNode.insertBefore(priceElement, louerBtn);
  }

  try {
    const response = await fetch(`/api/car?model=${encodeURIComponent(modelName)}`);
    if (!response.ok) throw new Error('Failed to fetch car availability');
    const data = await response.json();

    if (data.available) {
      louerBtn.classList.remove("btn-danger", "btn-secondary");
      louerBtn.classList.add("btn-success");
      louerBtn.disabled = false;
      louerBtn.textContent = "Louer maintenant";
      louerBtn.addEventListener("click", function () {
        window.location.href = `/html/forum.html`;
      });
    } else {
      louerBtn.disabled = true;
      louerBtn.classList.remove("btn-primary", "btn-success");
      louerBtn.classList.add("btn-danger");
      louerBtn.textContent = "Non disponible";
    }
  } catch (e) {
    console.error("Erreur de disponibilité de la voiture :", e);
    louerBtn.disabled = true;
    louerBtn.classList.remove("btn-primary", "btn-success");
    louerBtn.classList.add("btn-danger");
    louerBtn.textContent = "Non disponible";
  }

  // Show the button only after it's ready
  if (louerBtn) {
    louerBtn.style.visibility = "visible";
  }
});