// Set up event listeners for input changes
function setupEventListeners() {
    document.getElementById('existing-member-price-input').addEventListener('input', function () {
        document.getElementById('existing-price-display').textContent = this.value;
        updatePlot();
    });

    document.getElementById('new-member-price-input').addEventListener('input', function () {
        document.getElementById('new-price-display').textContent = this.value;
        updatePlot();
    });

    document.getElementById('sticker-price-percentage-input').addEventListener('input', function () {
        document.getElementById('sticker-price-percentage-display').textContent = this.value;
        updatePlot();
    });

    document.getElementById('initial-members-input').addEventListener('input', updatePlot);
    document.getElementById('existing-member-attrition-input').addEventListener('input', updatePlot);
    document.getElementById('new-members-input').addEventListener('input', updatePlot);
    document.getElementById('existing-member-price-input').addEventListener('input', updatePlot);
    document.getElementById('new-member-price-input').addEventListener('input', updatePlot);
    document.getElementById('sticker-price-percentage-input').addEventListener('input', updatePlot);
}

// Initialize the plot with the default settings and values
function setupPlot() {
    // Set up event listeners
    setupEventListeners();

    // Initial plot update
    updatePlot();
}
