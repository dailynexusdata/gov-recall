import { select } from 'd3-selection';
import * as Plot from '@observablehq/plot';

const makePlot = (d) => {
  const data = d.map((c) => ({ ...c, pct: c.pct * 100 }));

  const size = {
    height: 100,
    width: Math.min(600, window.innerWidth - 40),
  };

  const margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
  };

  const container = select('#laby-gov-recall-result')
    .attr('class', 'gov-recall')
    .style('font-size', '10pt');

  container.selectAll('*').remove();
  container
    .append('h1')
    .text('Should Gov. Newson be Recalled?')
    .style('font-size', '24px');

  const el = document.getElementById('laby-gov-recall-result');

  el.appendChild(
    Plot.plot({
      width: size.width,
      marginTop: 30,
      marginBottom: 40,
      height: size.height,
      y: {
        domain: data.map((d) => d.name),
        label: null,
        axis: null,
      },
      x: {
        // label: '% →',
        label: '',
        domain: [0, 100],
        tickFormat: (d, i) => d + (i === 4 ? '%' : ''),
      },
      marks: [
        Plot.barX(data, {
          x: 'pct',
          y: 'hello',
          fill: (d) => d.which,
        }),
        Plot.text(data, {
          x: (d, i) => (i === 0 ? 0 : data[0].pct),
          y: 'hello',
          text: (d) => `${d.which} - ${d.pct}%`,
          dy: -15,
          dx: 5,
          textAnchor: 'start',
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
