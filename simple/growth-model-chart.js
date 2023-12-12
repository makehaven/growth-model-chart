document.getElementById('existing-member-price-input').addEventListener('input', function () {
    document.getElementById('existing-price-display').textContent = this.value;
});

document.getElementById('new-member-price-input').addEventListener('input', function () {
    document.getElementById('new-price-display').textContent = this.value;
});

document.getElementById('sticker-price-percentage-input').addEventListener('input', function () {
    document.getElementById('sticker-price-percentage-display').textContent = this.value;
});

function updatePlot() {
    let initialMembers = parseFloat(document.getElementById('initial-members-input').value);
    let existingMemberAttritionRate = parseFloat(document.getElementById('existing-member-attrition-input').value) / 100;
    let newMemberAttritionRate = parseFloat(document.getElementById('new-member-attrition-input').value) / 100;
    let newMembersPerMonth = parseFloat(document.getElementById('new-members-input').value);
    let existingMemberPrice = parseFloat(document.getElementById('existing-member-price-input').value);
    let newMemberPrice = parseFloat(document.getElementById('new-member-price-input').value);
    let stickerPricePercentage = parseFloat(document.getElementById('sticker-price-percentage-input').value) / 100;


    let existingMembers = initialMembers;
    let newMembers = 0;
    let existingMembersArray = [existingMembers];
    let newMembersArray = [newMembers];
    let revenueArray = [(existingMembers * existingMemberPrice + newMembers * newMemberPrice) * stickerPricePercentage];

    for (let i = 1; i <= 60; i++) {
    let attritionExisting = existingMembers * existingMemberAttritionRate;
    let attritionNew = newMembers * newMemberAttritionRate;
    existingMembers = existingMembers - attritionExisting;
    newMembers = (newMembers - attritionNew) + newMembersPerMonth;
    existingMembersArray.push(existingMembers);
    newMembersArray.push(newMembers);

    // Update this line to correctly calculate revenue from both existing and new members
    let monthlyRevenue = (existingMembers * existingMemberPrice + newMembers * newMemberPrice) * stickerPricePercentage;
    revenueArray.push(monthlyRevenue);
    }


    let months = Array.from({ length: 60 }, (_, i) => {
        const year = Math.floor(i / 12) + 2024;
        const month = (i % 12) + 1;
        return `${year}-${String(month).padStart(2, '0')}`;
    });

    // Membership Growth Chart
// Find the maximum value for the revenue Y-axis
let maxY2 = Math.max(...revenueArray);

// Set a default floor of 30K and a default ceiling of 35K
let lowerLimit = 30000;
let upperLimit = 35000;

// If the maximum value in the data is greater than 35K, round up to the nearest 10K
if (maxY2 > 35000) {
    upperLimit = Math.ceil(maxY2 / 10000) * 10000;
}

let layout = {
    title: 'Projected Membership Growth and Revenue',
    xaxis: {
        title: 'Year-Month',
        tickangle: -45
    },
    yaxis: {
        title: 'Membership',
    },
    yaxis2: {
        title: 'Revenue ($)',
        overlaying: 'y',
        side: 'right',
    }
};

  let trace1 = {
    x: months,
    y: existingMembersArray,
    stackgroup: 'one',
    name: 'Existing Members',
    line: { color: '#ff7f0e' },
    hovertemplate: '%{y:.0f} members<extra></extra>'
};

let trace2 = {
    x: months,
    y: newMembersArray,
    stackgroup: 'one',
    name: 'New Members',
    line: { color: '#2ca02c' },
    hovertemplate: '%{y:.0f} members<extra></extra>'
};

let trace3 = {
    x: months,
    y: revenueArray.map(val => val / 1000), // Convert all values to 'K'
    name: 'Revenue',
    yaxis: 'y2',
    line: { color: '#1f77b4' },
    hovertemplate: '$%{y:.1f}K<extra></extra>'
};

    Plotly.newPlot('plotly-div', [trace1, trace2, trace3], layout);

}

// Initial plot and event listeners for other input fields
updatePlot();
document.getElementById('initial-members-input').addEventListener('input', updatePlot);
document.getElementById('existing-member-attrition-input').addEventListener('input', updatePlot);
document.getElementById('new-member-attrition-input').addEventListener('input', updatePlot);
document.getElementById('new-members-input').addEventListener('input', updatePlot);
document.getElementById('existing-member-price-input').addEventListener('input', updatePlot);
document.getElementById('new-member-price-input').addEventListener('input', updatePlot);
document.getElementById('sticker-price-percentage-input').addEventListener('input', updatePlot);

