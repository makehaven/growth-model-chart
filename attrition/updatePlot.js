function updatePlot() {
    // Call calculateNewMembers at the beginning to update the 'new members per month' based on current inputs
    calculateNewMembers();


    let priceSensitivity = parseFloat(document.getElementById('price-sensitivity-input').value) / 100;

let initialMembers = parseFloat(document.getElementById('initial-members-input').value);
    let existingMemberAttritionRate = parseFloat(document.getElementById('existing-member-attrition-input').value) / 100;
    let newMembersPerMonth = parseFloat(document.getElementById('new-members-input').value);
    let existingMemberPrice = parseFloat(document.getElementById('existing-member-price-input').value);
    let newMemberPrice = parseFloat(document.getElementById('new-member-price-input').value);
    let stickerPricePercentage = parseFloat(document.getElementById('sticker-price-percentage-input').value) / 100;

    let existingMembers = initialMembers;  // start with initial members
    let baseExistingMembers = initialMembers;  // keep track of the base number
    let retentionPriceSensitivity = parseFloat(document.getElementById('price-sensitivity-existing-retention-input').value) / 100;

    let newMembers = 0;
    let existingMembersArray = [initialMembers];  // Removed the duplicate line
    let newMembersArray = [newMembers];
    

    let priceDifference = newMemberPrice - existingMemberPrice;  // assuming newMemberPrice and existingMemberPrice are already defined



// Initialize arrays for storing cohort data
let cohortMembersArrays = {};
let numberOfYears = parseInt(document.getElementById('number-of-years-input').value);
let numberOfMonths = numberOfYears * 12;

// Initialize array to hold the sum of all cohort members for each month
let totalCohortMembersArray = new Array(numberOfMonths).fill(0);

// Initialize cohort arrays
for (let year = 0; year < numberOfYears; year++) {
    cohortMembersArrays[year] = Array(numberOfMonths).fill(0);
}

let revenueArray = [];

for (let i = 0; i < numberOfMonths; i++) {
    // Calculate the revenue from existing members
    let existingMemberRevenue = existingMembersArray[i] * existingMemberPrice;
 
    console.log("Before cohortMemberRevenue calculation, totalCohortMembersArray[i]:", totalCohortMembersArray[i]);  // Debug line
    // Calculate the revenue from cohort members
    let cohortMemberRevenue = totalCohortMembersArray[i] * newMemberPrice;
    console.log("Cohort Member Revenue:", cohortMemberRevenue);  // Debug line
    // Calculate the total revenue for the month
    let monthlyRevenue = existingMemberRevenue + cohortMemberRevenue;

    // Apply the sticker price percentage
    monthlyRevenue *= (stickerPricePercentage / 100);

    // Add to the revenue array
    revenueArray.push(monthlyRevenue);
}



let yearlyAttritionRates = [
    parseFloat(document.getElementById("year1-attrition-input").value) / 100,
    parseFloat(document.getElementById("year2-attrition-input").value) / 100,
    parseFloat(document.getElementById("year3-attrition-input").value) / 100,
    parseFloat(document.getElementById("year4-attrition-input").value) / 100,
    parseFloat(document.getElementById("year5-attrition-input").value) / 100,
    parseFloat(document.getElementById("year6plus-attrition-input").value) / 100 // For year 6 and beyond
];

existingMemberAttritionRate = existingMemberAttritionRate * (1 + (retentionPriceSensitivity * priceDifference));
yearlyAttritionRates = yearlyAttritionRates.map(rate => rate * (1 + (retentionPriceSensitivity * priceDifference)));

for (let i = 1; i <= numberOfMonths; i++) {
    let attritionExisting = existingMembers * existingMemberAttritionRate;
    existingMembers = existingMembers - attritionExisting;
    console.log("Existing Members after calculation:", existingMembers);  // Debug line
    existingMembersArray.push(existingMembers);
    console.log("Existing Members Array:", existingMembersArray);  // Debug line

// Calculate total members for this month by adding up all cohort members
let totalMembersForMonth = existingMembers;
let totalNewMembersForMonth = 0;  // Initialize to 0, will sum up all new cohort members for this month
for (let year = 0; year < numberOfYears; year++) {
    totalNewMembersForMonth += cohortMembersArrays[year][i-1];  // Summing up the new members from each cohort
}
totalMembersForMonth += totalNewMembersForMonth;  // Adding new members to the total

// Now, you can use totalMembersForMonth and totalNewMembersForMonth in your revenue calculation
let monthlyRevenue = existingMembers * existingMemberPrice + totalNewMembersForMonth * newMemberPrice;
monthlyRevenue *= stickerPricePercentage;  // Applying the sticker price percentage
revenueArray.push(monthlyRevenue);

}

let months = Array.from({ length: 12 * numberOfYears }, (_, i) => {
    const year = Math.floor(i / 12) + 2024; // Assuming the start year is 2024
    const month = (i % 12) + 1;
    return `${year}-${String(month).padStart(2, '0')}`;
});

console.log("Initial totalCohortMembersArray:", totalCohortMembersArray);  // Debug line
// Cohort logic
for (let i = 0; i < numberOfMonths; i++) {
    let currentNewMembers = newMembersPerMonth;

    for (let year = 0; year < numberOfYears; year++) {
        if (i < year * 12) continue;
        
        let monthsInThisCohort = i - year * 12;
        let attritionRate;
        
        if (monthsInThisCohort < 12) {
            attritionRate = yearlyAttritionRates[0];
        } else if (monthsInThisCohort < 24) {
            attritionRate = yearlyAttritionRates[1];
        } else if (monthsInThisCohort < 36) {
            attritionRate = yearlyAttritionRates[2];
        } else if (monthsInThisCohort < 48) {
            attritionRate = yearlyAttritionRates[3];
        } else if (monthsInThisCohort < 60) {
            attritionRate = yearlyAttritionRates[4];
        } else {
            attritionRate = yearlyAttritionRates[5]; // For year 6 and beyond
        }

        if (i === year * 12) {
            cohortMembersArrays[year][i] = currentNewMembers;  // New members join in January
        } else if (i > year * 12 && i < (year + 1) * 12) {  // For months after January but within the first year
            cohortMembersArrays[year][i] = cohortMembersArrays[year][i - 1] * (1 - attritionRate) + currentNewMembers;
        } else if (i >= (year + 1) * 12) {  // For months after the first year
            cohortMembersArrays[year][i] = cohortMembersArrays[year][i - 1] * (1 - attritionRate);
        }

        // Correct for negative or lingering cohort size
        if (cohortMembersArrays[year][i] < 1) cohortMembersArrays[year][i] = 0;
        if (cohortMembersArrays[year][i] < 0.5) cohortMembersArrays[year][i] = 0;

        // Round cohort size
        cohortMembersArrays[year][i] = Math.round(cohortMembersArrays[year][i]);
    }
}

// Calculate the sum of all cohort members for each month
for (let i = 0; i < numberOfMonths; i++) {
    for (let year = 0; year < numberOfYears; year++) {
        totalCohortMembersArray[i] += cohortMembersArrays[year][i];
    }
}

// Apply attrition to base existing members
for (let i = 1; i < numberOfMonths; i++) {
    let attritionExisting = existingMembersArray[i - 1] * existingMemberAttritionRate;
    existingMembersArray.push(existingMembersArray[i - 1] - attritionExisting); // Push the new value into the array
}

// For total number of members
// You can calculate this in JavaScript and update an HTML element like this:
let totalMembers = existingMembersArray[existingMembersArray.length - 1] + totalCohortMembersArray[totalCohortMembersArray.length - 1];
document.getElementById("totalMembers").innerText = `Total Members: ${totalMembers}`;

    // Create Plotly traces for each cohort
    let cohortTraces = [];
    for (let year = 0; year < numberOfYears; year++) {
        cohortTraces.push({
            x: months,
            y: cohortMembersArrays[year],
            name: `Cohort ${year + 1}`,
            stackgroup: 'one',
            line: { width: 2 },
            hovertemplate: cohortMembersArrays[year] > 0 ? '%{y:.0f} members<extra></extra>' : ''
        });
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
            tickprefix: '$',
            ticksuffix: 'K',
            rangemode: 'tozero' 
        }
    };

    let trace1 = {
        x: months,
        y: existingMembersArray,
        stackgroup: 'one',
        name: 'Existing Members',
        line: { color: '#ff7f0e' },
        hovertemplate: '%{y:.0f} Existing base<extra></extra>'
    };

    let trace2 = {
        x: months,
        y: newMembersArray,
        stackgroup: 'one',
        name: 'New Members',
        line: { color: '#2ca02c' },
        hovertemplate: '%{y:.0f} New members<extra></extra>'
    };

    let trace3 = {
        x: months,
        y: revenueArray,
        name: 'Revenue',
        yaxis: 'y2',
        line: { color: '#1f77b4' },
        hovertemplate: '$%{y:.1f}<extra></extra>'
    };


    Plotly.newPlot('plotly-div', [trace1, trace3, ...cohortTraces], layout);

    Plotly.newPlot('plotly-div', [trace1, trace3, ...cohortTraces], layout).then(function(gd) {
        gd.on('plotly_hover', function(data){
            let pointNumber = data.points[0].pointNumber;
            let totalMembersAtPoint = existingMembersArray[pointNumber] + totalCohortMembersArray[pointNumber];
            document.getElementById("totalMembers").innerText = "Total Members: " + Math.round(totalMembersAtPoint);
        });
    });
    

}
