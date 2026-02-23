// src/services/skinport.service.js
//Skinport client wrapper.
//returns raw array item from skinport or throws invalid JSON.
//All skinport-specific behavior should live here so routes / jobs stay clean.
const SKINPORT_ITEMS_URL = "https://api.skinport.com/v1/items?app_id=730&currency=USD&tradable=1";

async function fetchItemsFromSkinport() {
    const res = await fetch(SKINPORT_ITEMS_URL);

    if(!res.ok){
        throw new Error('Skinport fetch failed: ${res.status} ${res.statusText}');
    }

    const data = await res.json();

    if(!Array.isArray(data)){
        throw new Error("Skinport response not an array");
    }
    
    return data;
}

module.exports = { fetchItemsFromSkinport };
