/**
 * @author alex
 * @since 2021-09-15
 */
import './styles.scss';

import { csv } from 'd3-fetch';

// import plot functions here:
// import makePLOT_NAME from "./PLOT_NAME";
import makeRecall from '../plots/recall';
// import makeCandidates from '../plots/candidates';
import makeCandidates from '../plots/faces';

(async () => {
  // import data - use csv or json:
  const cData = await csv('dist/data/candidates.csv');
  const rData = await csv('dist/data/recall.csv');

  const resize = () => {
    // call imported plots here:
    // makePLOT_NAME(data);
    makeCandidates(cData);
    makeRecall(rData);
  };

  window.addEventListener('resize', () => {
    resize();
  });

  resize();
})();
