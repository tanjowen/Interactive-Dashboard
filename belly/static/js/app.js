function buildMetadata(sample) {

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata` 

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

  var url = "/metadata/" + sample; 
  var meta = d3.select("#sample-metadata");

  d3.json(url).then(function(response) {
    
    var data = response;
    meta.html("");

    Object.entries(data).forEach(([key, value]) =>
      meta.append("p").text(`${key}: ${value}`));
  });  
    
}
   

function buildCharts(sample) {

  var url = "/samples/" + sample;
  d3.json(url).then(function(response) {
    var otu_ids = response.otu_ids;
    var sample_values = response.sample_values;
    var otu_labels = response.otu_labels;

    console.log(response);
    var data = [response];

    //BUBBLE CHART
    var trace1 = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: "Earth"
      }
    }];
    var layout1 = {
      margin: { t:0 },
      hovermode: "closest",
      showlegend: true,
      xaxis: { title: 'OTU ID' }
    };

    Plotly.newPlot("bubble", trace1, layout1);

    //PIE CHART
    var filtered_sample = sample_values.slice(0,10);
    var filtered_otu_ids = otu_ids.slice(0,10);
    var filtered_labels = otu_labels.slice(0,10);
    console.log(filtered_sample);
    var trace2 = [{
      values: filtered_sample,
      labels: filtered_otu_ids,
      text: filtered_labels, 
      hoverinfo: "text+value",
      textinfo: "percent",      
      type: "pie"
    }];

    Plotly.newPlot("pie", trace2);

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
