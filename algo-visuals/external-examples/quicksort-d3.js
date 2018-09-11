var margin = {top: 10, right: 30, bottom: 10, left: 30},
    widthQS = 960 - margin.left - margin.right,
    heightQS = 50 - margin.top - margin.bottom;

var nQS = 240,
    indexQS = d3.range(nQS),
    dataQS = shuffle(indexQS.slice());

var xQS = d3.scale.ordinal().domain(indexQS).rangePoints([0, widthQS]),
    a = d3.scale.linear().domain([0, nQS - 1]).range([-Math.PI / 4, Math.PI / 4]);

var svg = d3.select("body").append("svg")
    .attr("width", widthQS + margin.left + margin.right)
    .attr("height", heightQS + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + (margin.top + heightQS) + ")");

var lineA = svg.selectAll("line")
    .data(dataQS)
  .enter().append("line")
    .attr("index", function(d, i) { return "i" + i; })
    .attr("x2", function(d) { return heightQS * Math.sin(a(d)); })
    .attr("y2", function(d) { return -heightQS * Math.cos(a(d)); })
    .attr("transform", function(d, i) { return "translate(" + xQS(i) + ")"; });

// Fisher–Yates shuffle
function shuffle(array) {
  var i = array.length, j, t;
  while (--i > 0) {
    j = ~~(Math.random() * (i + 1));
    t = array[j];
    array[j] = array[i];
    array[i] = t;
  }
  return array;
}

function quicksort(array) {
  var actions = [];

  function partition(left, right, pivot) {
    var v = array[pivot];
    swap(pivot, --right);
    for (var i = left; i < right; ++i) if (array[i] <= v) swap(i, left++);
    swap(left, right);
    return left;
  }

  function swap(i, j) {
    var t = array[i];
    array[i] = array[j];
    array[j] = t;
    actions.push({type: "swap", i: i, j: j});
  }

  function recurse(left, right) {
    if (left < right) {
      var pivot = left + ~~(Math.random() * (right - left));
      actions.push({type: "partition", pivot: pivot});
      pivot = partition(left, right, pivot);
      recurse(left, pivot);
      recurse(pivot + 1, right);
    }
  }

  recurse(0, array.length);
  return actions;
}

var actions = quicksort(dataQS).reverse();

setInterval(function step() {
  var action = actions.pop();
  if (action) switch (action.type) {
    case "partition": {
      lineA.style("stroke", function(d, i) { return i == action.pivot ? "red" : null; });
      step();
      break;
    }
    case "swap": {
      var t = lineA[0][action.i];
      lineA[0][action.i] = lineA[0][action.j];
      lineA[0][action.j] = t;
      lineA.attr("transform", function(d, i) { return "translate(" + xQS(i) + ")"; });
      break;
    }
  }
}, 20);

