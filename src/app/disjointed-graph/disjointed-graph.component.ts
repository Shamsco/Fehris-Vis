import { Component, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { Node } from 'src/app/interface/node';
import { Link } from 'src/app/interface/link';
import { PieData } from 'src/app/interface/pie-data';
import * as graphData from 'src/assets/miserables.json';
import { GlobalVariables } from "src/app/global-variables/global";

@Component({
  selector: 'app-disjointed-graph',
  templateUrl: './disjointed-graph.component.html',
  styleUrls: ['./disjointed-graph.component.css'],
})
export class DisjointedGraphComponent implements OnInit {

  private input : any = (graphData as any).default;
  public checked: boolean = false;
  private height: number = 680;
  private width: number = 680;
  private color = d3.scaleOrdinal(
    this.input.nodes.map((d) => d.group[0]).sort(d3.ascending),
    d3.schemeCategory10
  );
  private arc = d3.arc().innerRadius(5).outerRadius(8);
  private drag = (simulation) => {
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return d3
      .drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  };

  //Method that creates the tooltip Window
  private createPreview(id, inputNodes: Node[], inputLinks: Link[]): void {

    // Data Processing to use only Nodes linked to selected Node
    const linksFilter: Link[] = inputLinks.filter(
      (x) => x.source === id || x.target === id
    );

    const arr = new Array<Node>();

    arr.push(inputNodes.find((x) => x.id === id));

    for (var values of linksFilter) {
      if (values.source === id) {
        arr.push(inputNodes.find((x) => x.id === values.target));
      }
      if (values.target === id) {
        arr.push(inputNodes.find((x) => x.id === values.source));
      }
    }

    const links = linksFilter.map((d) => Object.create(d));

    const nodes = arr.map((d) => Object.create(d));

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3.forceLink<Node, Link>(links).id((d) => d.id)
      )
      .force('charge', d3.forceManyBody())
      .force('x', d3.forceX())
      .force('y', d3.forceY());

    //Creating Graph in Tooltip
    // SVG for Tooltip
    const svg = this.createSVGWithWidthAndHeight(
      'div.nodeTooltip',
      'preview',
      this.height / 4,
      this.width / 4
    );

    // Rect for Close button
    d3.select('.preview')
      .append('rect')
      .attr('width', 20)
      .attr('height', 20)
      .attr('transform', `translate(${this.width / 4 - 21},1)`)
      .attr('class', 'preview')
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('style', 'fill:red;stroke:black;stroke-width:1')
      .on('click', (d) => {
        // Close button
        d3.selectAll(`.pactive`).classed('pactive', false);

        d3.select('div.nodeTooltip').style('opacity', 0);
        
        d3.selectAll('.preview').remove();
      })
      .append('title')
      .text('Close');

    //Tool tip links
    const link = this.createLinks(svg, links, 'p');

    // Tooltip Nodes
    const node = this.createNodes(svg, nodes, simulation, 'p');

    // Tooltip Arcs
    this.createNodeArcs(node, 'p');

    // Position update for tooltip graph
    this.graphUpdates(simulation, link, node);
  }

  // Method to create SVG with specific Height and Width
  // Used to create tooltip window SVG
  private createSVGWithWidthAndHeight(
    selection: string,
    classSuffix: string,
    height: number,
    width: number
  ) {
    return d3
      .select(selection)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0, 0, ${width}, ${height}`)
      .attr('class', classSuffix)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);
  }

  // Creates the Main Force-Directed Graph
  private createGraph(inputNodes: Node[], inputLinks: Link[]): void {
    const links = inputLinks.map((d) => Object.create(d));
    const nodes = inputNodes.map((d) => Object.create(d));
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3.forceLink<Node, Link>(links).id((d) => d.id)
      )
      .force('charge', d3.forceManyBody())
      .force('x', d3.forceX())
      .force('y', d3.forceY())
      .velocityDecay(0.5);

    // Main SVG
    const svg = this.createSVG(
      'div#Disjointed',
      'main',
      this.height,
      this.width
    );

    // Main SVG styling
    this.styleSVG(svg);

    // Graph Links
    const link = this.createLinks(svg, links, 'm');

    //Container for Tooltip
    const div = this.createTooltipWindow('div#Disjointed');

    //Graph Nodes
    const node = this.createNodes(svg, nodes, simulation, 'm');

    //Main view Node onClick
    node.on('click', (event, d) => {
      div
        .transition()
        .duration(200)
        .style('opacity', 0.9)
        .style('left', event.pageX + this.width / 8 + 'px')
        .style('top', event.pageY - this.height / 3 + 'px');
      d3.selectAll('.preview').remove();
      d3.selectAll('.pactive').classed('pactive', false);
      svg.selectAll(`.${d.id.replace(/\./g, '')}`).classed('pactive', true);
      this.createPreview(d.id, inputNodes, inputLinks);
    });

    //MultiCategory
    this.createNodeArcs(node, 'm');

    // Add Title to Nodes

    // Position updates for Graph
    this.graphUpdates(simulation, link, node);

    // Legend
    //Data Pre-processing for Legend
    let groups: number[][] = nodes.map((d) => d.group);
    let legendGroups: number[] = new Array<number>();
    groups.forEach(d => {
      d.forEach( value => {
        legendGroups.push(value)
      })
    })
    
    legendGroups = [... new Set(legendGroups)]
    let stateArray: boolean[] = Array<boolean>(legendGroups.length).fill(false);
    const legend = this.createGroupLegend(svg, legendGroups, stateArray, node, 'm');
    d3.selectAll(".marcs").attr("visibility","hidden")
    d3.selectAll(".gGroup").attr("visibility","hidden")
  }

  constructor() {}
  //Method to create the Legend
  private createGroupLegend(svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>, grouparr: number[], stateArray: boolean[], node: any, classSuffix: string) {
    return svg
      .append('g')
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'start')
      .attr('class', 'gGroup')
      .attr('opacity', 1)
      .selectAll('g')
      .data(grouparr)
      .join('g')
      .attr(
        'transform',
        (d) => `translate(${-this.width / 2 + 10},${-this.height / 4 + d * 10 + 5})`
      )
      .call((g) => g
        .append('text')
        .attr('x', 6)
        .attr('dy', '0.35em')
        .attr('class', (d) => classSuffix + d)
        .attr('fill', (d) => this.color(d))
        .text((d) => 'Group ' + d)
      )
      .call((g) => g
        .append('circle')
        .attr('r', 3)
        .attr('class', (d) => classSuffix + d)
        .attr('fill', (d) => this.color(d))
      )
      .on('click', (event, d) => {
        if (stateArray[d] === true) {
          stateArray[d] = false;
          svg.selectAll(`.${classSuffix + d}`).classed('gactive', false);
          node.selectAll(`circle.${classSuffix + d}`).classed('classic', true);
          node.selectAll(`circle.${classSuffix + d}`).classed('gactive', false);
        } else if (stateArray[d] === false) {
          stateArray[d] = true;
          svg.selectAll(`.${classSuffix + d}`).classed('gactive', true);
          node.selectAll(`circle.${classSuffix + d}`).classed('gactive', true);
          node.selectAll(`circle.${classSuffix + d}`).classed('classic', false);
        }
      });
  }
  //Toggles Group view
  showGroups() {
    d3.selectAll(".marcs").attr("visibility", this.checked? "hidden":"visible")
    d3.selectAll(".gGroup").attr("visibility", this.checked? "hidden":"visible")
  }

  //Method to create an SVG
  private createSVG(
    selection: string,
    classSuffix: string,
    height: number,
    width: number
  ) {
    const svg = d3
      .select(selection)
      .append('svg')
      .attr('viewBox', `${-width / 2}, ${-height / 2}, ${width}, ${height}`)
      .attr('class', classSuffix)
      .style('border', '1px solid black');
    return svg;
  }


  //Method to style the SVG
  private styleSVG(svg: any) {
    svg.append('style').text(`
        line.pactive {
          stroke: #000;
          stroke-opacity: 1;
        } 
        circle.pactive{
          stroke: #000;
        }
        line.gactive {
          stroke: #000;
          stroke-opacity: 1;
        } 
        circle.gactive{
          fill: #fff;
        }
        text.gactive{
          font-weight: bold;
          font-size: 15;
        }
        circle.classic{
          fill: #12b
        }
        div.tooltip {	
          position: absolute;					
          padding: 2px;					
          background: lightsteelblue;	
          border: 0px;		
          border-radius: 8px;			
          pointer-events: auto;			
      }`);
  }

  //Method to create Graph Links
  private createLinks(svg: any, links: any[], classSuffix: string) {
    return svg
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', (d) => Math.sqrt(d.value))
      .attr(
        'class',
        (d) =>
          d.source.id.replace(/\./g, '') +
          ' ' +
          d.target.id.replace(/\./g, '') +
          ' ' +
          classSuffix +
          d.source.group.join(' ' + classSuffix)
      );
  }

  //Method to create the Tooltip Window
  private createTooltipWindow(selection: string) {
    return d3
      .select(selection)
      .append('div')
      .attr('class', 'tooltip nodeTooltip')
      .style('opacity', 0)
      .attr('width', this.width / 4)
      .attr('height', this.height / 4);
  }
  //Method to update the Graph simulation
  private graphUpdates(
    simulation: d3.Simulation<any, undefined>,
    link: any,
    node: any
  ) {
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      node.attr('transform', (d) => `translate(${d.x}, ${d.y})`);
    });
  }
  //Method to create Nodes
  private createNodes(
    svg: any,
    nodes: any[],
    simulation: d3.Simulation<any, undefined>,
    classSuffix: any
  ) {
    return svg
      .append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5)
      .selectAll('.node')
      .data(nodes)
      .join('g')
      .attr(
        'class',
        (d) =>
          'node ' +
          d.id.replace(/\./g, '') +
          ' ' +
          classSuffix +
          d.group.join(' ' + classSuffix)
      )
      .call(this.drag(simulation))
      .on('mouseover', (event, d) => {
        svg
          .selectAll(`line.${d.id.replace(/\./g, '')}`)
          .attr('stroke-opacity', 1)
          .attr('stroke', '#000');
        svg
          .selectAll(`circle.${d.id.replace(/\./g, '')}`)
          .attr('stroke', '#000');
      })
      .on('mouseout', (event, d) => {
        svg
          .selectAll(`line.${d.id.replace(/\./g, '')}`)
          .attr('stroke-opacity', 0.6)
          .attr('stroke', '#999');
        svg
          .selectAll(`circle.${d.id.replace(/\./g, '')}`)
          .attr('stroke', '#fff');
      });
  }
  //Method to create Node Arcs
  private createNodeArcs(node: any, classSuffix: string) {
    node
      .append('circle')
      .attr('r', 5)
      .attr(
        'class',
        (d) =>
          d.id.replace(/\./g, '') +
          ' ' +
          classSuffix +
          d.group.join(' ' + classSuffix)
      )
      .attr('fill', '#12d')
      .each((d, i) => {
        let pieData: PieData[] = [];
        d.group.forEach((element) => {
          pieData.push({
            color: this.color(element),
            value: 1 / d.group.length,
          });
        });
        let arcData = GlobalVariables.pie(pieData);
        let index: number = i;
        let selectedNode = node.filter((d, i) => {
          return i === index;
        });
        selectedNode
          .selectAll()
          .data(arcData)
          .enter()
          .append('path')
          .attr('fill', (d) => d.data.color)
          .attr('d', this.arc)
          .attr("class", `${classSuffix}arcs`);
      });
    node.append('title').text((d) => d.id);
  }
  ngOnInit(): void {
    this.createGraph(this.input.nodes, this.input.links);
  }
}
