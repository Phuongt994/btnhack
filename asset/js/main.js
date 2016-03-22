$(document).ready(function() {
  $("#title").append("<h1> Click nodes to choose a topic </h1>").fadeIn(1000);
});

// Clicback page function
function clickBack() {
  $("#content").fadeOut(800);
  $("#back").remove();
  $("#banner").delay(1000).slideDown(800);
  window.scrollTo(0,0);
}

// THIS IS D3
var width = 800,
    height = 500;

var color = d3.scale.category20(); //what is category number?

// Fisheye
var fisheye = d3.fisheye.circular()
    .radius(120);

var svg = d3.select("#navmap").append("svg")
    .attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
    .gravity(0.025)
    .distance(150)
    .charge(-50)
    .linkStrength(0.05)
    .size([width, height]);

d3.json("/asset/data/graph.json", function(error, json) {
  if (error) throw error;

  var link = svg.selectAll(".link")
      .data(json.links)
      .enter().append("line")
      .attr("class", "link")
      // .linkDistance(20);
    	// .style("stroke", "#CCC"); replaced by CSS

  var node = svg.selectAll(".node")
    .data(json.nodes)
    .enter().append("g")
    .attr("class", "node")
  	.style("font-size", 12)
    .call(force.drag);

  force
    .nodes(json.nodes)
    .links(json.links)
    .start();

  node.append("circle")
    .attr("class", "node")
    .attr("r", 10)
    .style("fill", function(d) { return color(d.group); })
    .call(force.drag);

  node.append("text")
    .attr("dx", 12)
    .attr("dy", "1em")
    .style("fill", "white")
    .text(function(d) { return d.name });

  // Fisheye
  svg.on("mousemove", function() {

      fisheye.focus(d3.mouse(this));


      node.each(function(d) { d.fisheye = fisheye(d); })
        .attr("x", function(d) { return d.fisheye.x; })
        .attr("y", function(d) { return d.fisheye.y; })
      d3.selectAll("circle").each(function(d) { d.fisheye = fisheye(d); })
        .attr("r", function(d) { return d.fisheye.z * 10; })
      node.attr("transform", function(d) { return "translate(" + d.fisheye.x + "," + d.fisheye.y + ")"; })

      // .attr("cx", function(d) { return d.fisheye.x; })
      // .attr("cy", function(d) { return d.fisheye.y; })
      // .attr("r", function(d) { return d.fisheye.z * 8; });


      link.attr("x1", function(d) { return d.source.fisheye.x; })
          .attr("y1", function(d) { return d.source.fisheye.y; })
          .attr("x2", function(d) { return d.target.fisheye.x; })
          .attr("y2", function(d) { return d.target.fisheye.y; });
  });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });



  d3.selectAll(".node circle").on("dblclick", function(d,i){
    for (i = 0; i <=16; i++) {
      if (d.id==i) {
        $("#title").empty();
        $("#title").hide().append("<h1>"+d.name+"</h1>").fadeIn(1000);
        $("#banner").delay(1500).slideUp(800, function() {
          writeContent(d.id);
          $("#article").append("<h2 id='back' onclick='clickBack()'> Back </h2>");
        });

      }
    };
  });

  d3.selectAll(".node text").on("dblclick", function(d,i){
    for (i = 0; i <=16; i++) {
      if (d.id==i) {
        $("#title").empty();
        $("#title").hide().append("<h1>"+d.name+"</h1>").fadeIn(1000);
        $("#banner").delay(1500).slideUp(800, function() {
          writeContent(d.id);
          $("#article").append("<h2 id='back' onclick='clickBack()'> Back </h2>");
        });
      }
    };
  });
});

$("#epilogue").append("<h2 class='medium'> Epilogue </h2>");
// To write text
function writeContent(idNo) {
  $.ajax({
    url:"asset/data/id"+idNo+"Text.txt",
    dataType:"text",
    success: function (data) {
      $("#content").fadeIn(800).html(data);
    }
  });
};

function clickConcl() {
  $("#title").empty();
  $("#title").hide().append("<h1>Conclusion</h1>").fadeIn(1000);
  $("#banner").delay(1500).slideUp(800, function() {
    writeContent(6);
    $("#article").append("<h2 id='back' onclick='clickBack()'> Back </h2>");
  });
}
