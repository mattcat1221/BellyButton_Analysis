       // Define the URL as a constant
       const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

       // Use d3 to load dataset and call the init function
       d3.json(url).then(init).catch(error => console.log(error));

       // Initialize function to set up dropdown and initial charts
       function init(data) {
           // Create dropdown menu with d3 and select data
           let dropdownMenu = d3.select('#selDataset');
           // Retrieve sample names from data
           let samples = data.names;
           // Append options to the dropdown menu
           samples.forEach(id => {
               dropdownMenu.append('option').text(id).property('value', id);
           });
           // Event listener for dropdown change
           dropdownMenu.on('change', optionChanged);

           // Initialize with the first sample
           let firstSample = samples[0];
           // Build initial charts and metadata
           buildBarChart(firstSample, data);
           buildBubbleChart(firstSample, data);
           buildMetadata(firstSample, data);
           buildGaugeChart(data.metadata.find(d => d.id == firstSample).wfreq);
       }

       // Function to build the horizontal bar chart
       function buildBarChart(id, data) {
           let individualData = data.samples.find(sample => sample.id === id);
           let top10OTUs = individualData.otu_ids.slice(0, 10).reverse();
           let top10Counts = individualData.sample_values.slice(0, 10).reverse();
           let top10Labels = individualData.otu_labels.slice(0, 10).reverse();

           let bar_data = [{
               x: top10Counts,
               y: top10OTUs.map(otu => `OTU ${otu}`),
               type: "bar",
               text: top10Labels,
               orientation: "h"
           }];
           
           let layout = {
               title: "Top 10 OTUs",
               height: 400,
               width: 800
           };
           
           Plotly.newPlot("bar", bar_data, layout);
       }

       // Function to build the bubble chart
       function buildBubbleChart(id, data) {
           let individualData = data.samples.find(sample => sample.id === id);

           let bubble_data = [{
               x: individualData.otu_ids,
               y: individualData.sample_values,
               mode: "markers",
               marker: {
                   color: individualData.otu_ids,
                   size: individualData.sample_values
               },
               text: individualData.otu_labels
           }];
           
           let layout = {
               title: "Bacteria in Sample",
               height: 500,
               width: 1000,
               xaxis: {
                   title: "OTU ID"
               },
               yaxis: {
                   title: "Sample Value"
               }
           };
           
           Plotly.newPlot("bubble", bubble_data, layout);
       }

       // Function to build the metadata panel
       function buildMetadata(sample, data) {
           let individualData = data.metadata.find(metadata => metadata.id == sample);
           let panel = d3.select("#sample-metadata");
           panel.html("");
           let table = panel.append("table").classed("table", true);
           
           Object.entries(individualData).forEach(([key, value]) => {
               let row = table.append("tr");
               row.append("td").text(key);
               row.append("td").text(value);
           });
       }

       // Function to update charts and metadata on dropdown change
       function optionChanged() {
           let selectedSample = d3.select('#selDataset').property('value');
           d3.json(url).then(data => {
               buildBarChart(selectedSample, data);
               buildBubbleChart(selectedSample, data);
               buildMetadata(selectedSample, data);
               buildGaugeChart(data.metadata.find(d => d.id == selectedSample).wfreq);
           });
       }

       // Function to build the gauge chart
       function buildGaugeChart(value) {
           let data = [{
               domain: { x: [0, 1], y: [0, 1] },
               value: value,
               title: { text: "Belly Button Washing Frequency<br><sub>Scrubs per Week</sub>" },
               type: "indicator",
               mode: "gauge+number",
               gauge: {
                   axis: { range: [null, 9] },
                   bar: { color: "rgb(200,200,200)" },
                   bgcolor: "white",
                   borderwidth: 2,
                   bordercolor: "gray",
                   steps: [
                       { range: [0, 1], color: 'rgb(230, 240, 215)' },
                       { range: [1, 2], color: 'rgb(200, 230, 180)' },
                       { range: [2, 3], color: 'rgb(170, 220, 140)' },
                       { range: [3, 4], color: 'rgb(110, 190, 85)' },
                       { range: [4, 5], color: 'rgb(80, 180, 60)' },
                       { range: [5, 6], color: 'rgb(50, 160, 50)' },
                       { range: [6, 7], color: 'rgb(20, 140, 40)' },
                       { range: [7, 8], color: 'rgb(0, 120, 30)' },
                       { range: [8, 9], color: 'rgb(0, 100, 20)' }
                   ]
               }
           }];
           
           let layout = {
               width: 600,
               height: 450,
               margin: { t: 25, r: 25, l: 25, b: 25 },
               paper_bgcolor: "white",
               font: { color: "darkblue", family: "Arial" }
           };
           
           Plotly.newPlot('gauge', data, layout);
       }
  