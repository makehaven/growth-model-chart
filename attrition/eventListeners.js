document.addEventListener('DOMContentLoaded', (event) => {
// Event Listeners for input fields
document.getElementById('existing-member-price-input').addEventListener('input', function () {
    document.getElementById('existing-price-display').textContent = this.value;
});

document.getElementById('new-member-price-input').addEventListener('input', function () {
    document.getElementById('new-price-display').textContent = this.value;
});

document.getElementById('sticker-price-percentage-input').addEventListener('input', function () {
    document.getElementById('sticker-price-percentage-display').textContent = this.value;
});

// Event listeners for updatePlot function
document.getElementById('initial-members-input').addEventListener('input', updatePlot);
document.getElementById('number-of-years-input').addEventListener('input', updatePlot);
document.getElementById('current-recruitment-input').addEventListener('input', updatePlot);
document.getElementById('current-price-input').addEventListener('input', updatePlot);
document.getElementById('price-sensitivity-input').addEventListener('input', updatePlot);
document.getElementById('year1-attrition-input').addEventListener('input', updatePlot);
document.getElementById('year2-attrition-input').addEventListener('input', updatePlot);
document.getElementById('year3-attrition-input').addEventListener('input', updatePlot);
document.getElementById('year4-attrition-input').addEventListener('input', updatePlot);
document.getElementById('year5-attrition-input').addEventListener('input', updatePlot);
document.getElementById('year6plus-attrition-input').addEventListener('input', updatePlot);

});