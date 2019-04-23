var data_promise = d3.json('class.json')

data_promise.then(function(data){
  initialize(data)
},
function(error){
  console.log(error);
})

var initialize = function(data){
  var new_dataset = data.map(function(d, i){
    return d.quizes;
  })

  new_dataset = new_dataset.map(function(array, index){
    var new_array = array.map(function(d, i){
      return d.grade;
    })
    return new_array;
  })
  var screen = {
    width:1850,
    height:800,
  };
  var margins = {
    left:screen.width*0.01,
    bottom:screen.height*0.01,
    right:screen.width*0.075,
    top:screen.height*0.01,
  };

  var svg = d3.select('body').append('svg')
                   .attr('width', screen.width)
                   .attr('height', screen.height);
  var w = screen.width - margins.left - margins.right;
  var h = screen.height - margins.top - margins.bottom;
  var color = d3.scaleOrdinal(d3.schemePastel2);
  var padding = 0.05;
  var xScale = d3.scaleBand()
                 .domain(d3.range(new_dataset.length))
                 .rangeRound([0,w - (w/new_dataset.length)])
                 .paddingInner(padding);
  var yScale = d3.scaleLinear()
                 .domain([0, new_dataset.length - 1])
                 .range([h - (h/new_dataset.length), 0])
  // new_dataset = [
  //   [1, 2, 3, 4, 5],
  //   [1, 2, 3, 4, 5],
  //   [1, 2, 3, 4, 5],
  //   [1, 2, 3, 4, 5],
  //   [1, 2, 3, 4, 5],
  // ]
  var texts = [
    '0.8 –– 1',
    '0.2 –– 0.79',
    '-0.3 –– 0.19',
    '-0.6 –– -0.31',
    '-1 –– -0.61',
  ]
  var plottingPlace = svg.append('g')
                         .classed('Graph', true)
                         .attr('transform', 'translate('+margins.left+','+margins.top+')')
  new_dataset.forEach(function(currStud, currI){
    new_dataset.forEach(function(tempStud, tempI){
      var xMean = d3.mean(currStud);
      var yMean = d3.mean(tempStud);
      var r = (currStud.map(function(currGrade, i){
        var tempGrade = tempStud[i];
        return ((currGrade-xMean) * (tempGrade-yMean))
      }).reduce(function(total, current){ return total+current;})/(d3.deviation(currStud) * d3.deviation(tempStud))) * (1/(new_dataset.length-1))
      if (currI != tempI){
        // .attr('fill', function(d){
        //                     return color(d.name);
        //                   });
        plottingPlace.append('rect')
                     .attr('x', xScale(currI))
                     .attr('y', yScale(tempI))
                     .attr('width', xScale.bandwidth)
                     .attr('height', h/new_dataset.length - (padding))
                     .attr('fill', function(){
                       if (r >= 0.8 && r <= 1){
                         return color(texts[0])
                     }else if (r >= 0.2 && r <= 0.79){
                       return color(texts[1])
                     }else if(r >= -0.3 && r <= 0.19){
                       return color(texts[2])
                     }else if(r > -0.6 && r <= -0.31){
                       return color(texts[3])
                     }else{
                       return color(texts[4])
                     }
                   })
      }else{
        plottingPlace.append('text')
                      .attr('x', xScale(currI))
                      .attr('y', yScale(tempI - 0.5))
                      .text('Student '+(currI + 1))
                      .attr('font-size', 14)
                      .attr('stroke', 'lightgreen')
                      .attr('fill', 'red');
      }

    })
  })
  var legend_screen = {
    width:screen.width * 0.1,
    height:screen.height * 0.8
  }
  var legend_margins = {
    left:legend_screen.width * 0.01,
    top:legend_screen.height * 0.1,
    right:legend_screen.width * 0.01,
    bottom:legend_screen.height * 0.01
  }
  var legend_w = legend_screen.width - legend_margins.left - legend_margins.right;
  var legend_h = legend_screen.height - legend_margins.top - legend_margins.bottom;
  var legend = svg.append('g')
                  .attr('transform', 'translate('+(screen.width - legend_screen.width)+','+h * 0.1+')')
                  .classed('legend', true)
  var padding = 0.1;
  var rect_height = (legend_h * 0.3)/texts.length - ((legend_h/texts.length) * padding)
  var legend_lines = legend.selectAll('g')
                           .data(texts)
                           .enter()
                           .append('g') // 'translate(' + legend_margins.left + ',' + legend_margins.top + ')'
                           .classed('line', true)
                           .attr('transform', function(text, index){
                             console.log("Ran.")
                             return 'translate('+legend_margins.left+','+(index * (rect_height + ((legend_h/texts.length) * padding)))+')';
                           })
                           .each(function(text, index){
                             var current_g = d3.select(this);
                             current_g.append('rect')
                                      .attr('x', 0)
                                      .attr('y', - ((legend_h/texts.length) * padding) * 0.5)
                                      .attr('width', legend_w * 0.25)
                                      .attr('height', rect_height)

                             current_g.append('text')
                                      .attr('x', legend_w * 0.3)
                                      .attr('y', rect_height * 0.5)
                                      .text(function(text){ return text; })
                           })
                           .attr('fill', function(text){
                             return color(text);
                           })

}
