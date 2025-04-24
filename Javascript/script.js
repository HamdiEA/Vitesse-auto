document.addEventListener("DOMContentLoaded", async function () {
  const modelName = window.location.pathname.split("/").pop().replace(".html", "");

  // Local price lookup
  const prixMap = {
    "BMW-M4": 259,
    "BMW-M8": 349,
    "Audi": 0,
    "audi-r8": 389,
    "bmwserie4": 229,
    "gti": 189
  };
  const prix = prixMap[modelName] || 0;

  let currency = "EUR";
  let taux = 1;

  try {
    const ipRes = await fetch('https://api64.ipify.org?format=json');
    const ipData = await ipRes.json();
    const locRes = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=bd57c90ff4f3451c8a9ae1ab99947b9b&ip=${ipData.ip}`);
    const locData = await locRes.json();
    currency = locData.currency?.code || "EUR";

    const exRes = await fetch(`https://api.currencyapi.com/v3/latest?apikey=cur_live_ikQtRU8hewDkQaGUgfLs1zf1YSZubte7TIuovCll&currencies=${currency}&base_currency=EUR`);
    const exData = await exRes.json();
    taux = exData.data[currency]?.value || 1;
  } catch (e) {
    console.error("Erreur de localisation ou taux :", e);
  }

  const finalPrice = Math.round(prix * taux);
  const priceElement = document.createElement("div");
  priceElement.className = "fw-bold mb-2";
  priceElement.textContent = `Prix : ${finalPrice} ${currency}`;

  const louerBtn = document.getElementById("btn-forum");
  if (louerBtn && louerBtn.parentNode) {
    louerBtn.style.visibility = "hidden";  // hide button until ready
    louerBtn.parentNode.insertBefore(priceElement, louerBtn);
  }

  const response = await fetch(`/api/car?model=${encodeURIComponent(modelName)}`);
  const data = await response.json();

  if (data.available) {
    louerBtn.classList.remove("btn-danger", "btn-secondary");
    louerBtn.classList.add("btn-success");
    louerBtn.disabled = false;
    louerBtn.textContent = "Louer maintenant";
  } else {
    louerBtn.disabled = true;
    louerBtn.classList.remove("btn-primary", "btn-success");
    louerBtn.classList.add("btn-danger");
    louerBtn.textContent = "Non disponible";
  }

  louerBtn.style.visibility = "visible"; // show button only once it's ready
});
