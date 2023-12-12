# Growth Model Chart 

## Overview
The "Growth Model Chart" project offers a visual representation of various growth models, primarily focused on understanding and analyzing membership or user growth in organizations or platforms. It uses interactive charts to depict different scenarios like attrition rates and cohort behaviors, providing valuable insights into member engagement and retention strategies.

This project was primarily designed for modeling the growth and price change impacts of a membership-based makerspace. The basic functionality is working but it should be considered a work in progress. Contributions and fixes from others are welcome.

## Demo
**View online at:**  
[https://makehaven.github.io/growth-model-chart/](https://makehaven.github.io/growth-model-chart/)

**Alternatively, to run locally:**  
- Clone or download the repository to your local machine.
- Navigate to the project directory.
- Open the `index.html` file in a web browser.

## Charts
- `index.html`: The main entry point of the project. Lists chart visualizations.
- `simple/`: Offers a simplified perspective on growth. An attrition rate can be set independently for new vs existing members.
- `cohorts/`: Adds annual cohorts to the visualization.
- `attrition/`: Adds option for different attrition rates for members based on tenure (better modeling behavior of increasing retention). Also adds a linear price sensitivity so you can make a simple projection of price change impacts.

## Todo 
- The attrition model math needs to be reviewed to ensure it is correct. In particular, if Year 1 attrition is lower than others, it seems to distort the line.
- Add documention alongside the charts of the formulas used.

## MIT License 
Copyright 2023 MakeHaven

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
