function calculateLTV(yearlyAttritionRates, initialPrice, inflationRate) {
    let ltv = 0;
    let survivalProbability = 1.0;
    let currentPrice = initialPrice;
    const maxYears = 20; // Calculate LTV over a 20 year period for practicality

    for (let month = 0; month < maxYears * 12; month++) {
        if (month > 0 && month % 12 === 0) {
            currentPrice *= (1 + inflationRate);
        }

        const year = Math.floor(month / 12);
        const attritionRate = yearlyAttritionRates[Math.min(year, yearlyAttritionRates.length - 1)];

        ltv += survivalProbability * currentPrice;
        survivalProbability *= (1 - attritionRate);

        if (survivalProbability < 0.001) {
            break; // Stop if the member is very unlikely to still be active
        }
    }
    return ltv;
}

function updatePlot() {
    // Get all input values from the DOM
    const legacyMembers = parseFloat(document.getElementById('legacy-members-input').value);
    const legacyMemberPrice = parseFloat(document.getElementById('legacy-member-price-input').value);
    const legacyMemberAttritionRate = parseFloat(document.getElementById('existing-member-attrition-input').value) / 100;

    const newMembersPerMonth = parseFloat(document.getElementById('new-members-input').value);
    const initialNewMemberPrice = parseFloat(document.getElementById('new-member-price-input').value);
    const inflationRate = parseFloat(document.getElementById('inflation-rate-input').value) / 100;

    const stickerPricePercentage = parseFloat(document.getElementById('sticker-price-percentage-input').value) / 100;
    const numberOfYears = parseInt(document.getElementById('number-of-years-input').value);
    const numberOfMonths = numberOfYears * 12;

    const yearlyAttritionRates = [
        parseFloat(document.getElementById("year1-attrition-input").value) / 100,
        parseFloat(document.getElementById("year2-attrition-input").value) / 100,
        parseFloat(document.getElementById("year3-attrition-input").value) / 100,
        parseFloat(document.getElementById("year4-attrition-input").value) / 100,
        parseFloat(document.getElementById("year5-attrition-input").value) / 100,
        parseFloat(document.getElementById("year6plus-attrition-input").value) / 100
    ];

    // Calculate and display LTV
    const ltv = calculateLTV(yearlyAttritionRates, initialNewMemberPrice, inflationRate);
    document.getElementById('ltv-display').innerText = `New Member LTV: $${ltv.toFixed(2)}`;


    // Initialize arrays for storing data
    const legacyMembersArray = [];
    const cohortMembersArrays = {};
    for (let year = 0; year < numberOfYears; year++) {
        cohortMembersArrays[year] = new Array(numberOfMonths).fill(0);
    }
    const totalCohortMembersArray = new Array(numberOfMonths).fill(0);
    const revenueArray = [];
    const months = Array.from({ length: numberOfMonths }, (_, i) => {
        const year = Math.floor(i / 12) + 2024; // Assuming start year is 2024
        const month = (i % 12) + 1;
        return `${year}-${String(month).padStart(2, '0')}`;
    });

    let newMemberPrice = initialNewMemberPrice;
    // Main simulation loop
    for (let i = 0; i < numberOfMonths; i++) {
        // Apply inflation at the start of each year
        if (i > 0 && i % 12 === 0) {
            newMemberPrice *= (1 + inflationRate);
        }

        // 1. Calculate legacy members for the current month
        if (i === 0) {
            legacyMembersArray[i] = legacyMembers;
        } else {
            const attrition = legacyMembersArray[i - 1] * legacyMemberAttritionRate;
            legacyMembersArray[i] = legacyMembersArray[i - 1] - attrition;
        }

        // 2. Calculate cohort members for the current month
        let totalCohortMembersThisMonth = 0;
        for (let year = 0; year < numberOfYears; year++) {
            if (i < year * 12) {
                cohortMembersArrays[year][i] = 0;
                continue;
            }

            const monthsInThisCohort = i - year * 12;
            let currentYearAttritionRate;
            if (monthsInThisCohort < 12) currentYearAttritionRate = yearlyAttritionRates[0];
            else if (monthsInThisCohort < 24) currentYearAttritionRate = yearlyAttritionRates[1];
            else if (monthsInThisCohort < 36) currentYearAttritionRate = yearlyAttritionRates[2];
            else if (monthsInThisCohort < 48) currentYearAttritionRate = yearlyAttritionRates[3];
            else if (monthsInThisCohort < 60) currentYearAttritionRate = yearlyAttritionRates[4];
            else currentYearAttritionRate = yearlyAttritionRates[5];

            let previousMonthMembers = (i > 0) ? cohortMembersArrays[year][i - 1] : 0;
            let survivingMembers = previousMonthMembers * (1 - currentYearAttritionRate);

            // Add new members to the cohort only during its first year
            let newAdditions = (i >= year * 12 && i < (year + 1) * 12) ? newMembersPerMonth : 0;

            let currentCohortSize = survivingMembers + newAdditions;
            cohortMembersArrays[year][i] = currentCohortSize < 0.5 ? 0 : Math.round(currentCohortSize);
            totalCohortMembersThisMonth += cohortMembersArrays[year][i];
        }
        totalCohortMembersArray[i] = totalCohortMembersThisMonth;

        // 3. Calculate revenue for the current month
        const legacyMemberRevenue = legacyMembersArray[i] * legacyMemberPrice;

        const cohortMemberRevenue = totalCohortMembersArray[i] * newMemberPrice;

        const totalRevenue = (legacyMemberRevenue + cohortMemberRevenue) * stickerPricePercentage;
        revenueArray.push(totalRevenue);
    }

    // Update total members display
    const finalTotalMembers = legacyMembersArray[numberOfMonths - 1] + totalCohortMembersArray[numberOfMonths - 1];
    document.getElementById("totalMembers").innerText = `Ending Members: ${Math.round(finalTotalMembers)}`;

    // Create Plotly traces
    const traces = [];
    traces.push({
        x: months,
        y: legacyMembersArray,
        stackgroup: 'one',
        name: 'Legacy Members',
        hovertemplate: '%{y:.0f} Legacy Members<extra></extra>'
    });

    for (let year = 0; year < numberOfYears; year++) {
        traces.push({
            x: months,
            y: cohortMembersArrays[year],
            name: `Cohort ${year + 1}`,
            stackgroup: 'one',
            hovertemplate: '%{y:.0f} members<extra></extra>'
        });
    }

    traces.push({
        x: months,
        y: revenueArray.map(r => r / 1000), // Display revenue in thousands
        name: 'Revenue',
        yaxis: 'y2',
        line: { color: '#1f77b4' },
        hovertemplate: '$%{y:.1f}K<extra></extra>'
    });

    const layout = {
        title: 'Projected Membership Growth and Revenue',
        xaxis: { title: 'Year-Month', tickangle: -45 },
        yaxis: { title: 'Membership' },
        yaxis2: {
            title: 'Revenue ($K)',
            overlaying: 'y',
            side: 'right',
            tickprefix: '$',
            ticksuffix: 'K',
            rangemode: 'tozero'
        },
        hovermode: 'x unified'
    };

    Plotly.newPlot('plotly-div', traces, layout).then(gd => {
        gd.on('plotly_hover', data => {
            if (data.points.length > 0) {
                const pointNumber = data.points[0].pointNumber;
                const totalMembersAtPoint = legacyMembersArray[pointNumber] + totalCohortMembersArray[pointNumber];
                document.getElementById("totalMembers").innerText = `Total Members: ${Math.round(totalMembersAtPoint)}`;
            }
        });
    });
}
