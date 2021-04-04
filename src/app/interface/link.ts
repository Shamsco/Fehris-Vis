import { Node } from 'src/app/interface/node'

export interface Link extends d3.SimulationLinkDatum<Node> {
    source: string;
    target: string;
    value: number;
  }