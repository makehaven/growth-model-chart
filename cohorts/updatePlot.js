function updatePlot() {
    // Call calculateNewMembers at the beginning to update the 'new members per month' based on current inputs
    calculateNewMembers();


    let priceSensitivity = parseFloat(document.getElementById('price-sensitivity-input').value) / 100;

let initialMembers = parseFloat(document.getElementById('initial-members-input').value);
    let existingMemberAttritionRate = parseFloat(document.getElementById('existing-member-attrition-input').value) / 100;
    let newMemberAttritionRate = parseFloat(document.getElementById('new-member-attrition-input').value) / 100;
    let newMembersPerMonth = parseFloat(document.getElementById('new-members-input').value);
    let existingMemberPrice = parseFloat(document.getElementById('existing-member-price-input').value);
    let newMemberPrice = parseFloat(document.getElementById('new-member-price-input').value);
    let stickerPricePercentage = parseFloat(document.getElementById('sticker-price-percentage-input').value) / 100;

    let existingMembers = initialMembers;  // start with initial members
    let baseExistingMembers = initialMembers;  // keep track of the base number
    
    let newMembers = 0;
    let existingMembersArray = [initialMembers];  // Removed the duplicate line
    let newMembersArray = [newMembers];
    let revenueArray = [(existingMembers * existingMemberPrice + newMembers * newMemberPrice) * stickerPricePercentage];

// Initialize arrays for storing cohort data
let cohortMembersArrays = {};
let numberOfYears = parseInt(document.getElementById('number-of-years-input').value);
let numberOfMonths = numberOfYears * 12;


// Initialize cohort arrays
for (let year = 0; year < numberOfYears; year++) {
    cohortMembersArrays[year] = Array(numberOfMonths).fill(0);
}


for (let i = 1; i <= numberOfMonths; i++) {
    let attritionExisting = existingMembers * existingMemberAttritionRate;
    let attritionNew = newMembers * newMemberAttritionRate;
    existingMembers = existingMembers - attritionExisting;
    newMembers = (newMembers - attritionNew) + newMembersPerMonth;
    existingMembersArray.push(existingMembers);
    newMembersArray.push(newMembers);
    let monthlyRevenue = (existingMembers * existingMemberPrice + newMembers * newMemberPrice) * stickerPricePercentage;
    revenueArray.push(monthlyRevenue);
}


let months = Array.from({ length: 12 * numberOfYears }, (_, i) => {
    const year = Math.floor(i / 12) + 2024;
    const month = (i % 12) + 1;
    return `${year}-${String(month).padStart(2, '0')}`;
});

    let maxY2 = Math.max(...revenueArray);
    let lowerLimit = 30000;
    let upperLimit = 35000;
    if (maxY2 > 35000) {
        upperLimit = Math.ceil(maxY2 / 10000) * 10000;
    }
// Initialize array to hold the sum of all cohort members for each month
let totalCohortMembersArray = new Array(numberOfMonths).fill(0);


// Cohort logic
for (let i = 0; i < numberOfMonths; i++) {
    // Set the current new members for this month to be 37
    let currentNewMembers = newMembersPerMonth;

    for (let year = 0; year < numberOfYears; year++) {
        // Skip the months before this cohort starts
        if (i < year * 12) continue;

        // If it's the second month of the cohort, start with the new members from the first month
        if (i === year * 12 + 1) {
            cohortMembersArrays[year][i] = currentNewMembers;
        }
        // If still within the year of the cohort, add new members and apply attrition
        else if (i > year * 12 + 1 && i <= (year + 1) * 12) {
            cohortMembersArrays[year][i] = cohortMembersArrays[year][i - 1] * (1 - newMemberAttritionRate) + currentNewMembers;
        }
// If beyond the first year of the cohort, only apply attrition
else if (i > (year + 1) * 12) {
    cohortMembersArrays[year][i] = cohortMembersArrays[year][i - 1] * (1 - newMemberAttritionRate);
}

        // Correct for negative cohort size due to attrition
        if (cohortMembersArrays[year][i] < 1) {
            cohortMembersArrays[year][i] = 0;
        }
// Correct for lingering cohort size due to rounding
if (cohortMembersArrays[year][i] < 0.5) {
    cohortMembersArrays[year][i] = 0;
}
                 // Round cohort size
        cohortMembersArrays[year][i] = Math.round(cohortMembersArrays[year][i]);
    }
}

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
        y: revenueArray.map(val => val / 1000),
        name: 'Revenue',
        yaxis: 'y2',
        line: { color: '#1f77b4' },
        hovertemplate: '$%{y:.1f}K<extra></extra>'
    };

    console.log(cohortMembersArrays);
    console.log(cohortTraces);
    console.log([trace1, trace2, trace3, ...cohortTraces]);

    Plotly.newPlot('plotly-div', [trace1, trace3, ...cohortTraces], layout);

    Plotly.newPlot('plotly-div', [trace1, trace3, ...cohortTraces], layout).then(function(gd) {
        gd.on('plotly_hover', function(data){
            let pointNumber = data.points[0].pointNumber;
            let totalMembersAtPoint = existingMembersArray[pointNumber] + totalCohortMembersArray[pointNumber];
            document.getElementById("totalMembers").innerText = "Total Members: " + Math.round(totalMembersAtPoint);
        });
    });
    

}
