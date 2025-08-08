document.addEventListener('DOMContentLoaded', (event) => {
    const priceSensitivityEnabledInput = document.getElementById('price-sensitivity-enabled-input');
    const priceSensitivityInputs = document.getElementById('price-sensitivity-inputs');

    function togglePriceSensitivityInputs() {
        if (priceSensitivityEnabledInput.checked) {
            priceSensitivityInputs.style.display = 'block';
        } else {
            priceSensitivityInputs.style.display = 'none';
        }
        updatePlot();
    }

    priceSensitivityEnabledInput.addEventListener('change', togglePriceSensitivityInputs);

    // Event Listeners for sliders that also update a display span
    document.getElementById('new-member-price-input').addEventListener('input', function () {
        document.getElementById('new-price-display').textContent = this.value;
        updatePlot();
    });

    document.getElementById('new-members-input').addEventListener('input', function () {
        document.getElementById('new-members-display').textContent = this.value;
        updatePlot();
    });

    // Add event listeners for all other inputs that should trigger a plot update
    const inputs = [
        'legacy-members-input',
        'legacy-member-price-input',
        'legacy-member-price-increase-input',
        'existing-member-attrition-input',
        'sticker-price-percentage-input',
        'number-of-years-input',
        'inflation-rate-input',
        'recruitment-sensitivity-input',
        'retention-sensitivity-input',
        'year1-attrition-input',
        'year2-attrition-input',
        'year3-attrition-input',
        'year4-attrition-input',
        'year5-attrition-input',
        'year6plus-attrition-input'
    ];

    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', updatePlot);
        }
    });

    // Initial setup
    togglePriceSensitivityInputs(); // Set initial visibility
    updatePlot();
});
