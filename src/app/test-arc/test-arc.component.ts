import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';


@Component({
  selector: 'app-test-arc',
  templateUrl: './test-arc.component.html',
  styleUrls: ['./test-arc.component.css']
})
export class TestArcComponent implements OnInit {
  private nodes = [
    {"id": "Myriel", "group": 1},
    {"id": "Napoleon", "group": 1},
    {"id": "Mlle.Baptistine", "group": 1},
    {"id": "Mme.Magloire", "group": 1},
    {"id": "CountessdeLo", "group": 1},
  ];
  private links = [
    {"source": "Napoleon", "target": "Myriel", "value": 1},
    {"source": "Mlle.Baptistine", "target": "Myriel", "value": 8},
    {"source": "Mme.Magloire", "target": "Myriel", "value": 10},
    {"source": "Mme.Magloire", "target": "Mlle.Baptistine", "value": 6},
    {"source": "CountessdeLo", "target": "Myriel", "value": 1},
  ];
  public margin = ({top: 20, right: 20, bottom: 20, left: 100});
  private step = 14;
  private height = (this.nodes.length - 1) * this.step + this.margin.top + this.margin.bottom;
  private width = (this.nodes.length - 1) * this.step + this.margin.right + this.margin.left;
  private svg;
  private color = d3.scaleOrdinal(this.nodes.map(d => d.group).sort(d3.ascending), d3.schemeCategory10);
  private y = d3.scalePoint(this.nodes.map(d => d.id).sort(d3.ascending), [this.margin.top, this.height - this.margin.bottom]);
  private linkWidth = d3.scalePoint(this.links.map(d => d.value).sort(d3.ascending), [0.0, 7.0]);

  private arc(d: any) {
    const y1 = d.source.y;
    const y2 = d.target.y;
    const r = Math.abs(y2 - y1) / 2;
    return `M${y1},${100}A${r},${r} 0,0,${y1 < y2 ? 1 : 0} ${y2},${100}`;
  } 

  private createSvg(): void {
    this.svg = d3.select("figure#test-ARC")
    .append("svg")
    .attr("width", this.width + (this.margin.left * 2))
    .attr("height", this.height + (this.margin.left * 2))
    this.svg.append("style").text(`
      .hover path {
      stroke: #ccc;
      }

      .hover text {
      fill: #ccc;
      }

      .hover g.primary text {
      fill: black;
      font-weight: bold;
      }

      .hover g.secondary text {
      fill: #333;
      }

      .hover path.primary {
      stroke: #333;
      stroke-opacity: 1;
      }

      `);
  }
  private drawArc(nodes :any , links: any): void {
    const label = this.svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
      .selectAll("g")
      .data(nodes)
      .join("g")
        .attr("transform", d => `translate(${d.y = this.y(d.id)},${this.margin.left})rotate(-90)`)
        .call(g => g.append("text")
            .attr("y", 10)
            .attr("dy", "-0.7em")
            .attr("dx", '-0.7em')
            .attr("fill", d => d3.lab(this.color(d.group)).darker(2))
            .text(d => d.id))
        .call(g => g.append("circle")
            .attr("r", 3)
            .attr("fill", d => this.color(d.group)));
          
    const path = this.svg.insert("g", "*")
        .attr("fill", "none")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", 1.5)
      .selectAll("path")
      .data(links)
      .join("path")
        .attr("stroke", d => d.source.group === d.target.group ? this.color(d.source.group) : "#aaa")
        .attr('stroke-width', d => this.linkWidth(d.value) - 2)
        .attr("d", this.arc)
        .attr('class', d => d.source.id.replace(/\./g,' ') + " " + d.target.id.replace(/\./g,' '));
        
    const overlay = this.svg.append("g")
        .attr("fill", "none")
        .attr("pointer-events", "all")
      .selectAll("rect")
      .data(nodes)
      .join("rect")
        .attr("width", this.step)
        .attr("height", this.margin.left - 10)
        .attr("x", d => this.y(d.id) - this.step / 2)
        .attr('y', this.margin.left - 10)
        .on("mouseover", (event, d) => {
          this.svg.selectAll(`.${d.id}`)
            .attr('stroke-opacity', 1)
            .attr('stroke','#000')
          this.svg.selectAll(`:not(.${d.id})`)
            .style('hidden')
        })
        .on("mouseout", (event, d) => {
          this.svg.selectAll(`.${d.id}`)
            .attr('stroke-opacity', 0.6)
            .attr('stroke', d => d.source.group === d.target.group ? this.color(d.source.group) : "#aaa")
          this.svg.selectAll(`:not(.${d.id})`)
          .style('visible')
        });
    
  
  }
  constructor() { }

  ngOnInit(): void {
    const nodes = this.nodes.map(({id, group}) => ({
      id,
      sourceLinks: [],
      targetLinks: [],
      group
    }));
  
    const nodeById = new Map(nodes.map(d => [d.id, d]));
  
    const links = this.links.map(({source, target, value}) => ({
      source: nodeById.get(source),
      target: nodeById.get(target),
      value
    }));
  
    for (const link of links) {
      const {source, target, value} = link;
      source.sourceLinks.push(link);
      target.targetLinks.push(link);
    }
    this.createSvg();
    this.drawArc(nodes, links);
  }

}
