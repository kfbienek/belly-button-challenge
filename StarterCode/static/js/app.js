//Display the sample metadata, i.e., an individual's demographic information.
//Display each key-value pair from the metadata JSON object somewhere on the page.
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata= data.metadata;
      var resarray= metadata.filter(sampleobject => 
        sampleobject.id == sample);
      var result= resarray[0]
      var panel = d3.select("#sample-metadata");
      panel.html("");
      Object.entries(result).forEach(([key, value]) => {
        panel.append("h6").text(`${key}: ${value}`);
      });
    });
  }
  
  
  
  function buildCharts(sample) {
  
  // Use `d3.json` to fetch the sample data for the plots
  d3.json("samples.json").then((data) => {
    var samples= data.samples;
    var resarray= samples.filter(sampleobject => 
        sampleobject.id == sample);
    var result= resarray[0]
  
    var ids = result.otu_ids;
    var labels = result.otu_labels;
    var values = result.sample_values;
  
      /*Create a bubble chart that displays each sample.
      Use otu_ids for the x values.
      Use sample_values for the y values.
      Use sample_values for the marker size.
      Use otu_ids for the marker colors.
      Use otu_labels for the text values. */
  
    var bubbleLayout = {
      margin: { t: 0 },
      xaxis: { title: "OTU ID" },
      hovermode: "closest",
      };
  
      var bubble_data = [ 
      {
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
        marker: {
          color: ids,
          size: values,
          }
      }
    ];
  
    Plotly.newPlot("bubble", bubble_data, bubbleLayout);
  
  
  /*Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
  Use sample_values as the values for the bar chart.
  Use otu_ids as the labels for the bar chart.
  Use otu_labels as the hovertext for the chart.*/ 
  
    var barchart_data =[
      {
        y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
        x:values.slice(0,10).reverse(),
        text:labels.slice(0,10).reverse(),
        type:"bar",
        orientation:"h"
  
      }
    ];
  
    var barchartLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };
  
    Plotly.newPlot("bar", barchart_data, barchartLayout);
  });
  }
   
  
  function init() {
  var selecting = d3.select("#selDataset");
  // populating selecting options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selecting
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
  }
  
  function optionChanged(newSample) {
  //Update all the plots when a new sample is selected. Additionally, you are welcome to create any layout that you would like for your dashboard. An example dashboard is shown as follows:
  buildCharts(newSample);
  buildMetadata(newSample);
  }
  
  // Initialize dash
  init();
  