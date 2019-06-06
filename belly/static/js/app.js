function buildMetadata(sample) {

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata` 

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

  var url = "/metadata/" + sample; 
  
  d3.json(url).then(function(response) {

    console.log(response);
    var data = response;
    var meta = d3.select(#sample-metadata);
    Object.entries(response).forEach(([key, value]) =>
      meta.append("p").text(`${key}: ${value}`));
  })  
    
}
   

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots    
    // @TODO: Build a Bubble Chart using the sample data
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  var url = "/samples/" + sample;
  d3.json(url).then(function(response) {

    console.log(response);
    var data = [response];

    //BUBBLE CHART
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        color: otu_ids,
        size: sample_values
      }
    };
    var layout1 = {
      title: ,
      showlegend: false,
      height: 600,
      width: 1200
    };
    Plotly.newPlot('bubble', trace1, layout1);

    //PIE CHART
    var filtered_sample = sample_values.slice(0,11);
    var filtered_otu_ids = otu_ids.slice(0,11);
    var filtered_labels = otu_labels.slice(0,11);

    var trace2 = [{
      values: filtered_sample,
      labels: filtered_otu_ids,
      text: filtered_labels,
      type: "pie"
    }];
    var layout2 = {
      height: 400,
      width: 500,
    };
    Plotly.newPlot('pie', trace2. layout2);

  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
