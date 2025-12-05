function updatePlot() {
    // 1. Recalculate 'new members per month' based on price sensitivity
    calculateNewMembers();

    // 2. Read Inputs
    const numberOfYears = parseInt(document.getElementById('number-of-years-input').value) || 5;
    const numberOfMonths = numberOfYears * 12;

    const initialMembers = parseFloat(document.getElementById('initial-members-input').value) || 0;
    const stickerPricePercentage = (parseFloat(document.getElementById('sticker-price-percentage-input').value) || 100) / 100;

    // Prices
    const currentRecruitmentPrice = parseFloat(document.getElementById('current-price-input').value) || 0; // Baseline price
    const existingMemberPrice = parseFloat(document.getElementById('existing-member-price-input').value) || 0;
    const newMemberPrice = parseFloat(document.getElementById('new-member-price-input').value) || 0;

    // Attrition Rates (Monthly %)
    let baseExistingMemberAttritionRate = (parseFloat(document.getElementById('existing-member-attrition-input').value) || 0) / 100;

    let baseYearlyAttritionRates = [
        (parseFloat(document.getElementById("year1-attrition-input").value) || 0) / 100,
        (parseFloat(document.getElementById("year2-attrition-input").value) || 0) / 100,
        (parseFloat(document.getElementById("year3-attrition-input").value) || 0) / 100,
        (parseFloat(document.getElementById("year4-attrition-input").value) || 0) / 100,
        (parseFloat(document.getElementById("year5-attrition-input").value) || 0) / 100,
        (parseFloat(document.getElementById("year6plus-attrition-input").value) || 0) / 100
    ];

    // Price Sensitivities
    // Sensitivity is "% reduction per added dollar".
    // If Price increases (Delta > 0), Retention REDUCES => Attrition INCREASES.
    // Factor = 1 + (Sensitivity * PriceDelta).
    // If Sensitivity is 0.02 (2%), and Delta is $10. Factor = 1 + 0.2 = 1.2. Attrition increases by 20%.

    const retentionPriceSensitivity = (parseFloat(document.getElementById('price-sensitivity-existing-retention-input').value) || 0) / 100;
    const recruitmentPriceSensitivity = (parseFloat(document.getElementById('price-sensitivity-input').value) || 0) / 100;

    // Adjust Existing Member Attrition
    // Delta = Existing Price - Current Base Price
    // Note: The logic assumes 'current-price-input' is the price they were paying or the anchor.
    let existingPriceDelta = existingMemberPrice - currentRecruitmentPrice;
    let existingMemberAttritionRate = baseExistingMemberAttritionRate * (1 + (retentionPriceSensitivity * existingPriceDelta));
    // Ensure non-negative
    if (existingMemberAttritionRate < 0) existingMemberAttritionRate = 0;

    // Adjust New Cohort Attrition
    // Delta = New Price - Current Base Price
    let newPriceDelta = newMemberPrice - currentRecruitmentPrice;
    // Apply sensitivity to all yearly rates for new members
    // Wait, the original code applied `retentionPriceSensitivity` to cohort attrition too.
    // "retentionPriceSensitivity" label is "Retention Price Sensitivity".
    // "price-sensitivity-input" label is "Recruitment Price Sensitivity".
    // So yes, Retention Sensitivity applies to attrition of BOTH existing and new members.

    let yearlyAttritionRates = baseYearlyAttritionRates.map(rate => {
        let adjusted = rate * (1 + (retentionPriceSensitivity * newPriceDelta));
        return adjusted < 0 ? 0 : adjusted;
    });

    // 3. Simulation Data Structures

    // We will simulate monthly cohorts to properly handle tenure.
    // monthlyCohorts[m] stores the current count of members who joined in month m (0 to numberOfMonths-1).
    // Since we only add cohorts as time progresses, we can just push to a list.
    // However, we need to update *old* cohorts every month.
    // So `monthlyCohorts` will be an array of numbers, index = month joined.

    let monthlyCohorts = [];

    // Histories for plotting
    let existingMembersHistory = [];
    let revenueHistory = [];
    let annualCohortHistories = [];
    for(let y=0; y<numberOfYears; y++) {
        annualCohortHistories.push(new Array(numberOfMonths).fill(0));
    }

    let existingMembersCount = initialMembers;
    const newMembersPerMonth = parseFloat(document.getElementById('new-members-input').value) || 0;

    // 4. Simulation Loop
    for (let currentMonth = 0; currentMonth < numberOfMonths; currentMonth++) {

        // --- A. Record State at Start of Month (for Plotting) ---

        // 1. Existing Members Trace
        existingMembersHistory.push(existingMembersCount);

        // 2. New Members (Cohorts) Trace
        // Add a new cohort for this month
        monthlyCohorts.push(newMembersPerMonth);

        // Calculate totals for plotting Annual Cohorts
        // We iterate over all active monthly cohorts and sum them into the correct annual bucket for this month.
        for (let joinMonth = 0; joinMonth <= currentMonth; joinMonth++) {
            let count = monthlyCohorts[joinMonth];
            let cohortYear = Math.floor(joinMonth / 12);
            if (cohortYear < numberOfYears) {
                annualCohortHistories[cohortYear][currentMonth] += count;
            }
        }

        // --- B. Calculate Revenue ---
        // Revenue is collected from everyone present this month.
        // Existing Members + Sum of all Monthly Cohorts

        let totalCohortMembers = 0;
        for (let joinMonth = 0; joinMonth <= currentMonth; joinMonth++) {
            totalCohortMembers += monthlyCohorts[joinMonth];
        }

        let monthlyRevenue = (existingMembersCount * existingMemberPrice) + (totalCohortMembers * newMemberPrice);
        monthlyRevenue *= stickerPricePercentage;
        revenueHistory.push(monthlyRevenue);

        // --- C. Apply Attrition (Preparation for Next Month) ---

        // 1. Existing Members Attrition
        existingMembersCount -= (existingMembersCount * existingMemberAttritionRate);
        if (existingMembersCount < 0) existingMembersCount = 0;

        // 2. Monthly Cohorts Attrition
        // Iterate over all cohorts.
        // For a cohort joined at `joinMonth`, they have finished `currentMonth`.
        // Their tenure during `currentMonth` was `currentMonth - joinMonth`.
        // (e.g. Joined Month 0. In Month 0, Tenure=0. End of Month 0, apply Year 1 rate).
        // (e.g. Joined Month 0. In Month 12, Tenure=12. End of Month 12, apply Year 2 rate).

        for (let joinMonth = 0; joinMonth <= currentMonth; joinMonth++) {
            let tenure = currentMonth - joinMonth;

            let rate = 0;
            if (tenure < 12) rate = yearlyAttritionRates[0];
            else if (tenure < 24) rate = yearlyAttritionRates[1];
            else if (tenure < 36) rate = yearlyAttritionRates[2];
            else if (tenure < 48) rate = yearlyAttritionRates[3];
            else if (tenure < 60) rate = yearlyAttritionRates[4];
            else rate = yearlyAttritionRates[5];

            monthlyCohorts[joinMonth] -= (monthlyCohorts[joinMonth] * rate);
            if (monthlyCohorts[joinMonth] < 0) monthlyCohorts[joinMonth] = 0;
        }
    }

    // 5. Prepare Plot Data

    let monthsLabel = Array.from({ length: numberOfMonths }, (_, i) => {
        const year = Math.floor(i / 12) + 2024; // Assuming start year 2024
        const month = (i % 12) + 1;
        return `${year}-${String(month).padStart(2, '0')}`;
    });

    let traces = [];

    // Trace 1: Existing Members
    traces.push({
        x: monthsLabel,
        y: existingMembersHistory,
        stackgroup: 'one',
        name: 'Existing Members',
        line: { color: '#ff7f0e' },
        hovertemplate: '%{y:.0f} Existing base<extra></extra>'
    });

    // Traces: Cohorts
    for (let year = 0; year < numberOfYears; year++) {
        traces.push({
            x: monthsLabel,
            y: annualCohortHistories[year],
            name: `Cohort ${year + 1}`,
            stackgroup: 'one',
            line: { width: 2 },
            hovertemplate: '%{y:.0f} members<extra></extra>'
        });
    }

    // Trace: Revenue
    // Divide by 1000 for K
    let revenueInK = revenueHistory.map(v => v / 1000);
    traces.push({
        x: monthsLabel,
        y: revenueInK,
        name: 'Revenue',
        yaxis: 'y2',
        line: { color: '#1f77b4' }, // Blue
        hovertemplate: '$%{y:.1f}K<extra></extra>'
    });

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
        },
        hovermode: 'x unified'
    };

    Plotly.newPlot('plotly-div', traces, layout).then(function(gd) {
        gd.on('plotly_hover', function(data){
            // Calculate total members at the hovered point
            // points[0].pointIndex is the index in the data array
            let idx = data.points[0].pointIndex;
            let total = existingMembersHistory[idx];
            for (let y = 0; y < numberOfYears; y++) {
                total += annualCohortHistories[y][idx];
            }
            document.getElementById("totalMembers").innerText = "Total Members: " + Math.round(total);
        });
    });

    // Update initial display of total members (end of simulation)
    let finalTotal = existingMembersHistory[numberOfMonths-1];
    for (let y = 0; y < numberOfYears; y++) {
        finalTotal += annualCohortHistories[y][numberOfMonths-1];
    }
    document.getElementById("totalMembers").innerText = `Total Members: ${Math.round(finalTotal)}`;
}
