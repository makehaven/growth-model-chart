document.addEventListener('DOMContentLoaded', (event) => {
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
        'existing-member-attrition-input',
        'sticker-price-percentage-input',
        'number-of-years-input',
        'inflation-rate-input',
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
});
