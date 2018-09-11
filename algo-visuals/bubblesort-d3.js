var w = 960,
    h = 50;

var n = 240,
    x = d3.scale.linear().domain([0, n]).range([h, w - h]),
    b = d3.scale.linear().domain([0, n - 1]).range([90 + 60, 270 - 60]),
    data = d3.shuffle(d3.range(n)),
    duration = 150;

var svg = d3.select("body").append("svg")
    .attr("width", w)
    .attr("height", h);

var lineBubble = svg.selectAll("line")
    .data(data)
  .enter().append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", h)
    .attr("transform", transform);


function bubbleSort(array){
    var i=0, temp,swapped;
    do{
        swapped=false;
        for(i=0; i<array.length; i++){
          if(array[i]>array[i+1]){
            temp = array[i];
            array[i]=array[i+1];
            array[i+1]=temp;
            swapped=true;
            }
        }
    }while(swapped);
    
    return array;
}

function transform(d, i) {
    return "translate(" + x(i) + "," + h + ")rotate(" + b(d) + ")";
    }
      