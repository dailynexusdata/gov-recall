import { select } from 'd3-selection';
import * as Plot from '@observablehq/plot';

const makePlot = (d) => {
  const data = d.map((c, i) => {
    const name = c.name.split(' ');
    return {
      ...c,
      pct: c.pct * 100,
      name: name[name.length - 1],
    };
  });

  const size = {
    height: 400,
    width: Math.min(600, window.innerWidth - 40),
  };

  const margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
  };

  const container = select('#laby-gov-recall-candidates')
    .attr('class', 'gov-recall')
    .style('font-size', '10pt');

  container.selectAll('*').remove();

  container
    .append('h1')
    .text('Elder Leads the Replacement Candidates')
    .style('font-size', '24px');

  const el = document.getElementById('laby-gov-recall-candidates');

  el.appendChild(
    Plot.plot({
      width: size.width,
      marginLeft: 130,
      marginTop: 10,
      marginBottom: 40,
      y: {
        domain: data.map((d) => d.name),
        label: null,
      },
      x: {
        grid: true,
        // label: '% →',

        label: '',
        tickFormat: (d, i) => d + (i === 4 ? '%' : ''),
      },
      marks: [
        Plot.barX(data, {
          x: 'pct',
          y: 'name',
          fill: '#005AA3',
        }),
      ],
    }),
  );

  container
    .append('a')
    .style('font-size', '12pt')
    .text('Source: Santa Barbara County Election Summary Report')
    .attr(
      'href',
      'https://countyofsb.org/care/elections/results/2021september14/results-1.htm',
    );
};

export default makePlot;
