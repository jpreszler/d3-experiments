
// Based on http://vis.stanford.edu/protovis/ex/sort.html
// Based on work by Robert Sedgewick

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

var lineB = svg.selectAll("line")
    .data(data)
  .enter().append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", h)
    .attr("transform", transform);

start();

// Start the animation!
function start() {
  var passes = mergesort(data).reverse();

  update();

  function update() {
    var pass = passes.pop();

    lineB.data(pass, Number)
      .transition()
        .duration(duration)
        .attr("transform", transform);

    if (passes.length) {
      setTimeout(update, duration);
    } else {
      d3.shuffle(data);
      setTimeout(start, duration + 4500);
    }
  }
}

function transform(d, i) {
  return "translate(" + x(i) + "," + h + ")rotate(" + b(d) + ")";
}

// Sorts the specified array using bottom-up mergesort, returning an array of
// arrays representing the state of the specified array after each insertion for
// each parallel pass. The first pass is performed at size = 2.
function mergesort(array) {
  var passes = [],
      i,
      j,
      n = array.length,
      m = 1;

  // double the size each pass
  while (m < array.length) {
    i = j = 0; while (i < array.length) j += merge(i, i += m, i += m);
    if (j) passes.push(array.slice());
    else m <<= 1;
  }

  // Merges two adjacent sorted arrays in-place.
  function merge(start, middle, end) {
    middle = Math.min(array.length, middle);
    end = Math.min(array.length, end);
    for (; start < middle; start++) {
      if (array[start] > array[middle]) {
        var v = array[start];
        array[start] = array[middle];
        insert(middle, end, v);
        return true;
      }
    }
    return false;
  }

  // Inserts the value v into the subarray specified by start and end.
  function insert(start, end, v) {
    while (start + 1 < end && array[start + 1] < v) {
      var tmp = array[start];
      array[start] = array[start + 1];
      array[start + 1] = tmp;
      start++;
    }
    array[start] = v;
  }

  return passes;
}
