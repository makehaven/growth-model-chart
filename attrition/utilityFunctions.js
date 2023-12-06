// This function calculates the new members based on current recruitment, current price, new price, and price sensitivity.
function calculateNewMembers() {
    let currentRecruitment = parseFloat(document.getElementById('current-recruitment-input').value);
    let currentPrice = parseFloat(document.getElementById('current-price-input').value);
    let newPrice = parseFloat(document.getElementById('new-member-price-input').value);
    let priceSensitivity = parseFloat(document.getElementById('price-sensitivity-input').value) / 100;

    let priceDifference = newPrice - currentPrice;
    let recruitmentChange = 1 - (priceDifference * priceSensitivity);
    let newRecruitment = currentRecruitment * recruitmentChange;
    
    document.getElementById('new-members-input').value = newRecruitment.toFixed(2);
}
