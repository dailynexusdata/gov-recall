import { select, selectAll } from 'd3-selection';
import { scaleLinear, scaleBand } from 'd3-scale';
import { max } from 'd3-array';
import { axisBottom } from 'd3-axis';

const getPhotoUrl = (person) => {
  const name = person.toLowerCase().replaceAll(' ', '_').replaceAll('"', '');
  //   return `dist/photos/${name}.jpg`;
  return `https://github.com/dailynexusdata/gov-recall/blob/main/dist/photos/${name}.jpg?raw=true`;
};

const makePlot = (data) => {
  //   const size = {
  //     height: 100,
  //     width: Math.min(600, window.innerWidth - 40),
  //   };
  const size = {
    height: 450,
    width: Math.min(600, Math.min(600, window.innerWidth - 40)),
  };
  //   const margin = {
  //     top: 10,
  //     right: 10,
  //     bottom: 10,
  //     left: 10,
  //   };

  const container = select('#laby-gov-recall-candidates')
    .attr('class', 'gov-recall')
    .style('font-size', '10pt');

  container.selectAll('*').remove();
  container
    .append('h1')
    .attr('fill', '#00002b')
    .text("SB County's Top Replacement Candidates")
    .style('font-size', '24px');

  /*
    Container Setup:
  */

  // height and width of images
  const imageSize = 40;

  const margin = {
    top: 15,
    right: 50 + imageSize / 2,
    bottom: 25,
    left: 10 + imageSize / 2,
  };

  const resizeDuration = 1000;

  const svg = container
    .selectAll('#ucsb-as-voting-faces-container')
    .data([size])
    .join('svg')
    .attr('xmlns:xhtml', 'http://www.w3.org/1999/xhtml')
    .attr('id', 'ucsb-as-voting-faces-container')
    .attr('width', (d) => d.width)
    .attr('height', (d) => d.height);

  container
    .append('a')
    .style('font-size', '12pt')
    .attr('fill', '#00002b')
    .text('Source: Santa Barbara County Election Summary Report')
    .attr(
      'href',
      'https://countyofsb.org/care/elections/results/2021september14/results-1.htm',
    );

  /*
    Create Scales:
  */
  const x = scaleLinear()
    .domain([0, 0.5])
    .range([margin.left, size.width - margin.right]);

  const y = scaleBand()
    .domain(data.map((d) => d.name))
    .range([margin.top, size.height - margin.bottom]);

  /*
    Start Plot:
  */
  const barColors = {
    yes: 'green',
    no: 'red',
  };

  const bars = svg.selectAll('bars').data(data).join('g');

  // bar chart
  // -- color based on .elected

  // name text on top of bars

  // put images at end of bars
  bars
    .append('rect')
    .attr('x', x(0))
    .attr('y', (d) => y(d.name))
    .attr('width', (d) => x(d.pct) - x(0))
    .attr('height', imageSize + 10)
    .attr('fill', '#4e79a7');

  bars
    .append('text')
    .text((d) => `${Math.round(d.pct * 100)}%`)
    .attr('x', (d) => {
      if (d.name === 'Write-in') {
        return x(d.pct) + 5;
      }
      return (
        (d.pct < 0.03 ? x(d.pct) + imageSize : x(d.pct) + imageSize / 2) + 5
      );
    })
    .attr('y', (d) => y(d.name) + 5 + imageSize / 2)
    .attr('fill', '#adadad');

  bars
    .on('mouseenter', (event, d) => {
      svg
        .append('text')
        .text(`${Math.round(d.pct * 100)}%`)
        .attr(
          'x',
          d.pct < 0.03 ? x(d.pct) + imageSize + 30 : x(d.pct) + imageSize + 10,
        )
        .attr('y', y(d.name) + 5 + imageSize / 2)
        .attr('class', 'hover-over-text')
        .style('pointer-events', 'none')
        .attr('text-anchor', 'end')
        .attr('fill', d.pct < 25 ? 'black' : 'white');
    })
    .on('mouseleave', () => {
      selectAll('.hover-over-text').remove();
    });

  bars
    .append('foreignObject')
    .filter((d) => d.name !== 'Write-in')
    .attr('x', (d) => (d.pct < 0.03 ? x(d.pct) : x(d.pct) - imageSize / 2))
    .attr('y', (d) => y(d.name) + 5)
    .attr('width', imageSize)
    .attr('height', imageSize)
    .append('xhtml:img')
    .attr('width', imageSize)
    .attr('height', imageSize)
    .style('width', `${imageSize}px`)
    .style('height', `${imageSize}px`)
    .attr('src', (d) => getPhotoUrl(d.name))
    .style('border-radius', '50%');

  bars
    .append('text')
    .text((d) => d.name)
    .attr('x', x(0))
    .attr('y', (d) => y(d.name) - 3)
    .attr('text-anchor', 'start')
    .attr('font-size', '11pt')
    .attr('fill', '#00002b');

  /*
     x-axis
    */
  svg
    .selectAll('.ucsb-as-voting-faces-xaxis')
    .data([size])
    .join('g')
    .style('color', '#adadad')
    .style('font-size', '12pt')
    .attr('class', 'ucsb-as-voting-faces-xaxis')
    .attr('transform', `translate(0, ${size.height - margin.bottom - 10})`)
    .call(
      axisBottom()
        .scale(x)
        .ticks(5)
        .tickFormat((d) => `${d * 100}%`),
    );
};

export default makePlot;
