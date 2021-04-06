import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { PieData } from 'src/app/interface/pie-data';
import * as graphData from 'src/assets/miserables.json';
import { GlobalVariables } from 'src/app/global-variables/global';

@Component({
  selector: 'app-arc',
  templateUrl: './arc.component.html',
  styleUrls: ['./arc.component.css'],
})

export class ArcComponent implements OnInit {
  private input: any = (graphData as any).default;
  private margin = { top: 20, right: 40, bottom: 20, left: 100 };
  private step: number = 14;
  private height: number =
    (this.input.nodes.length - 1) * this.step +
    this.margin.top +
    this.margin.bottom;
  private width: number =
    (this.input.nodes.length - 1) * this.step +
    this.margin.right +
    this.margin.left;
  private svg;
  private label;
  private paths;
  private overlay;
  private y;
  groupOrder = (a, b) => a.group[0] - b.group[0] || d3.ascending(a.id, b.id);
  nameOrder = (a, b) => d3.ascending(a.id, b.id);
  //Assign this colour to a link who's endpoints do not share a group
  private noMatchColour = '#aaa';

  //Arcs for Multigroup representation
  private groupArc = d3.arc().innerRadius(4).outerRadius(7);

  //Arcs for links between nodes
  private arc(d: any, margin: number) {
    const y1 = d.source.y;
    const y2 = d.target.y;
    const r = Math.abs(y2 - y1) / 2;
    return `M${margin},${y1}A${r},${r} 0,0,${y1 < y2 ? 1 : 0} ${margin},${y2}`;
  }


  private createSvg(width: number, height: number, margin: any): void {
    this.svg = d3
      .select('div#ARC')
      .append('svg')
      .attr('viewBox', `0, 0, ${width}, ${height}`)
      .attr('transform', `translate(${-margin.left})`);
  }

  private drawArc(nodes: any, links: any): void {
    const color = d3.scaleOrdinal(
      nodes.map((d) => d.group[0]).sort(d3.ascending),
      d3.schemeCategory10
    );
    const y = d3.scalePoint(nodes.map((d) => d.id).sort(d3.ascending), [
      this.margin.top,
      this.height - this.margin.bottom,
    ]);
    this.y = y;
    const linkWidth = d3.scalePoint(
      links.map((d) => d.value).sort(d3.ascending),
      [1.5, 7.0]
    );

    this.label = this.createGraphLabels(nodes, 'p', y, color);

    this.paths = this.createGraphPath(links, 'p', color, linkWidth);

    this.overlay = this.createGraphOverlay(nodes, 'p', y, color);

    this.createNodeArcs(this.label, 'p', color);

    //Data Pre-processing for Legend
    let groups: number[][] = nodes.map((d) => d.group);
    let legendGroups: number[] = new Array<number>();
    groups.forEach((d) => {
      d.forEach((value) => {
        legendGroups.push(value);
      });
    });

    legendGroups = [...new Set(legendGroups)];
    let stateArray: boolean[] = Array<boolean>(legendGroups.length).fill(false);
    const legend = this.createGraphLegend(legendGroups, 'p', color, stateArray);

  }

  private createGraphLegend(
    grouparr: number[],
    classSuffix: string,
    color: d3.ScaleOrdinal<{ toString(): string }, string, never>,
    stateArray: boolean[]
  ) {
    return this.svg
      .append('g')
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'start')
      .selectAll('g')
      .data(grouparr)
      .join('g')
      .attr(
        'transform',
        (d) => `translate(${this.width - this.width / 2},${d * 10 + 5})`
      )
      .call((g) =>
        g
          .append('text')
          .attr('x', 6)
          .attr('dy', '0.35em')
          .attr('class', (d) => classSuffix + d)
          .attr('fill', (d) => d3.lab(color(d)))
          .text((d) => 'Group ' + d)
      )
      .call((g) =>
        g
          .append('circle')
          .attr('r', 3)
          .attr('class', (d) => classSuffix + d)
          .attr('fill', (d) => color(d))
      )
      .on('click', (event, d) => {
        this.svg.selectAll('path').attr('visibility', 'visible');
        if (stateArray[d] === true) {
          stateArray[d] = false;
          this.svg
            .selectAll(`path.${classSuffix + d}`)
            .attr('stroke-opacity', 0.6)
            .attr('stroke', (d) =>
              d.source.group === d.target.group ? color(d.source.group) : '#aaa'
            );
          this.svg
            .selectAll(`circle.${classSuffix + d}`)
            .attr('stroke-width', '0')
            .attr('stroke', color(d));
          this.svg
            .selectAll(`text.${classSuffix + d}`)
            .attr('fill', d3.lab(color(d)))
            .attr('font-weight', 'none')
            .attr('font-size', 10);
        } else if (stateArray[d] === false) {
          d3.selectAll(`path:not(.${classSuffix + d})`).attr(
            'visibility',
            'hidden'
          );
          stateArray[d] = true;
          this.svg
            .selectAll(`path.${classSuffix + d}`)
            .attr('stroke-opacity', 1)
            .attr('stroke', d3.lab(color(d)).darker(1));
          this.svg
            .selectAll(`circle.${classSuffix + d}`)
            .attr('stroke-width', '1')
            .attr('stroke', 'black');
          this.svg
            .selectAll(`text.${classSuffix + d}`)
            .attr('font-weight', 'bold')
            .attr('font-size', 15);
        }
      });
  }

  private createGraphOverlay(
    nodes: any,
    classSuffix: string,
    y: d3.ScalePoint<{ toString(): string }>,
    color: d3.ScaleOrdinal<{ toString(): string }, string, never>
  ) {
    return this.svg
      .append('g')
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .selectAll('rect')
      .data(nodes)
      .join('rect')
      .attr('width', this.margin.left + 10)
      .attr('height', this.step)
      .attr('y', (d) => y(d.id) - this.step / 2)
      .attr('x', this.margin.left)
      .on('mouseover', (event, d) => {
        let sources = d.sourceLinks.map((d) => [d.target.id, d.target.group]);
        let targets = d.targetLinks.map((d) => [d.source.id, d.source.group]);
        this.svg
          .selectAll(`path.${d.id}`)
          .attr('stroke-opacity', 1)
          .attr('stroke', 'black')
          .attr('z', 1);
        this.svg
          .selectAll(`circle.${d.id}`)
          .attr('stroke-width', '1')
          .attr('stroke', 'black');
        for (let source of sources) {
          this.svg
            .selectAll(`circle.${source[0]}`)
            .attr('stroke-width', '1')
            .attr('stroke', 'black');
          this.svg
            .selectAll(`text.${source[0]}`)
            .attr('font-weight', 'bold')
            .attr('font-size', 15);
        }
        for (let target of targets) {
          this.svg
            .selectAll(`circle.${target[0]}`)
            .attr('stroke-width', '1')
            .attr('stroke', 'black');
          this.svg
            .selectAll(`text.${target[0]}`)
            .attr('font-weight', 'bold')
            .attr('font-size', 15);
        }
        this.svg
          .selectAll(`text.${d.id}`)
          .attr('font-weight', 'bold')
          .attr('font-size', 15);
      })
      .on('mouseout', (event, d) => {
        let sources = d.sourceLinks.map((d) => [d.target.id, d.target.group]);
        let targets = d.targetLinks.map((d) => [d.source.id, d.source.group]);
        this.svg
          .selectAll(`path.${d.id}`)
          .attr('stroke-opacity', 0.6)
          .attr('stroke', '#aaa')
          .attr('z', 0);
        this.svg
          .selectAll(`circle.${d.id}`)
          .attr('stroke-width', '0')
          .attr('stroke', d3.lab(color(d.group)));
        for (let source of sources) {
          this.svg
            .selectAll(`circle.${source[0]}`)
            .attr('stroke-width', '0')
            .attr('stroke', color(d));
          this.svg
            .selectAll(`text.${source[0]}`)
            .attr('fill', d3.lab(color(source[1])))
            .attr('font-weight', 'none')
            .attr('font-size', 10);
        }
        for (let target of targets) {
          this.svg
            .selectAll(`circle.${target[0]}`)
            .attr('stroke-width', '0')
            .attr('stroke', color(d));
          this.svg
            .selectAll(`text.${target[0]}`)
            .attr('fill', d3.lab(color(target[1])))
            .attr('font-weight', 'none')
            .attr('font-size', 10);
        }
        this.svg
          .selectAll(`text.${d.id}`)
          .attr('fill', d3.lab(color(d.group)))
          .attr('font-weight', 'none')
          .attr('font-size', 10);
      });
  }

  private createGraphPath(
    links: any,
    classSuffix: string,
    color: d3.ScaleOrdinal<{ toString(): string }, string, never>,
    linkWidth: d3.ScalePoint<{ toString(): string }>
  ) {
    return this.svg
      .insert('g', '*')
      .attr('fill', 'none')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 1.5)
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('stroke', (d) =>
        d.source.group === d.target.group
          ? color(d.source.group)
          : this.noMatchColour
      )
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6)
      .attr('d', (d) => this.arc(d, this.margin.left * 2))
      .attr(
        'class',
        (d) =>
          d.source.id.replace(/\./g, ' ') +
          ' ' +
          d.target.id.replace(/\./g, ' ') +
          ' ' +
          classSuffix +
          d.source.group.join(' ' + classSuffix)
      );
  }

  private createGraphLabels(
    nodes: any,
    classSuffix: string,
    y: d3.ScalePoint<{ toString(): string }>,
    color: d3.ScaleOrdinal<{ toString(): string }, string, never>
  ) {
    return this.svg
      .append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'end')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr(
        'transform',
        (d) => `translate(${this.margin.left * 2},${(d.y = y(d.id))})`
      )
      .attr(
        'class',
        (d) =>
          'node ' +
          d.id.replace(/\./g, '') +
          ' ' +
          classSuffix +
          d.group.join(' ' + classSuffix)
      );
  }

  //Method to create Node Arcs
  private createNodeArcs(
    node: any,
    classSuffix: string,
    color: d3.ScaleOrdinal<{ toString(): string }, string, never>
  ) {
    node
      .append('text')
      .attr('x', -10)
      .attr('dy', '0.35em')
      .attr(
        'class',
        (d) =>
          d.id.replace(/\./g, '') +
          ' ' +
          classSuffix +
          d.group.join(' ' + classSuffix)
      )
      .attr('fill', (d) => d3.lab(color(d.group)))
      .text((d) => d.id);
    node
      .append('circle')
      .attr('r', 3)
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
            group: element,
            color: color(element),
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
          .attr('d', this.groupArc)
          .attr('class', `${classSuffix}arcs`);
      });
  }
  update(
    value: any
  ) {
    this.y.domain(this.input.nodes.sort(value).map((d) => d.id));

    const t = this.svg.transition().duration(750);

    this.label
      .transition(t)
      .delay((d, i) => i * 20)
      .attrTween('transform', (d) => {
        const i = d3.interpolateNumber(d.y, this.y(d.id));
        return (t) => `translate(${this.margin.left * 2},${(d.y = i(t))})`;
      });

    this.paths
      .transition(t)
      .duration(750 + this.input.nodes.length * 20)
      .attrTween('d', (d) => () => this.arc(d, this.margin.left * 2));

    this.overlay
      .transition(t)
      .delay((d, i) => i * 20)
      .attr('y', (d) => this.y(d.id) - this.step / 2);
  }

  constructor() {}

  ngOnInit(): void {
    const nodes = this.input.nodes.map(({ id, group }) => ({
      id,
      sourceLinks: [],
      targetLinks: [],
      group,
    }));

    const nodeById = new Map(nodes.map((d) => [d.id, d]));
    const links = this.input.links.map(({ source, target, value }) => ({
      source: nodeById.get(source),
      target: nodeById.get(target),
      value,
    }));

    for (const link of links) {
      const { source, target, value } = link;
      source.sourceLinks.push(link);
      target.targetLinks.push(link);
    }
    this.createSvg(this.width, this.height, this.margin);
    this.drawArc(nodes, links);
  }
}
