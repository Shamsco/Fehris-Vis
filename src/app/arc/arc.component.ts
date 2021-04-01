import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { utcThursdays } from 'd3';

interface node extends d3.SimulationNodeDatum {
  id: string;
  group: number[];
}

interface link extends d3.SimulationLinkDatum<node> {
  source: string;
  target: string;
  value: number;
}

interface pieData {
  color: string;
  value: number;
}
@Component({
  selector: 'app-arc',
  templateUrl: './arc.component.html',
  styleUrls: ['./arc.component.css'],
})
export class ArcComponent implements OnInit {
  private nodes = [
    { id: 'Myriel', group: [1, 4, 7, 8] },
    { id: 'Napoleon', group: [1, 7] },
    { id: 'Mlle.Baptistine', group: [1, 5] },
    { id: 'Mme.Magloire', group: [1, 8, 2, 6] },
    { id: 'CountessdeLo', group: [1, 8, 6] },
    { id: 'Geborand', group: [1, 4, 8] },
    { id: 'Champtercier', group: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    { id: 'Cravatte', group: [1] },
    { id: 'Count', group: [1] },
    { id: 'OldMan', group: [1] },
    { id: 'Labarre', group: [2] },
    { id: 'Valjean', group: [2] },
    { id: 'Marguerite', group: [3] },
    { id: 'Mme.deR', group: [2] },
    { id: 'Isabeau', group: [2] },
    { id: 'Gervais', group: [2] },
    { id: 'Tholomyes', group: [3] },
    { id: 'Listolier', group: [3] },
    { id: 'Fameuil', group: [3] },
    { id: 'Blacheville', group: [3] },
    { id: 'Favourite', group: [3] },
    { id: 'Dahlia', group: [3] },
    { id: 'Zephine', group: [3] },
    { id: 'Fantine', group: [3] },
    { id: 'Mme.Thenardier', group: [4] },
    { id: 'Thenardier', group: [4] },
    { id: 'Cosette', group: [5] },
    { id: 'Javert', group: [4] },
    { id: 'Fauchelevent', group: [0] },
    { id: 'Bamatabois', group: [2] },
    { id: 'Perpetue', group: [3] },
    { id: 'Simplice', group: [2] },
    { id: 'Scaufflaire', group: [2] },
    { id: 'Woman1', group: [2] },
    { id: 'Judge', group: [2] },
    { id: 'Champmathieu', group: [2] },
    { id: 'Brevet', group: [2] },
    { id: 'Chenildieu', group: [2] },
    { id: 'Cochepaille', group: [2] },
    { id: 'Pontmercy', group: [4] },
    { id: 'Boulatruelle', group: [6] },
    { id: 'Eponine', group: [4] },
    { id: 'Anzelma', group: [4] },
    { id: 'Woman2', group: [5] },
    { id: 'MotherInnocent', group: [0] },
    { id: 'Gribier', group: [0] },
    { id: 'Jondrette', group: [7] },
    { id: 'Mme.Burgon', group: [7] },
    { id: 'Gavroche', group: [8] },
    { id: 'Gillenormand', group: [5] },
    { id: 'Magnon', group: [5] },
    { id: 'Mlle.Gillenormand', group: [5] },
    { id: 'Mme.Pontmercy', group: [5] },
    { id: 'Mlle.Vaubois', group: [5] },
    { id: 'Lt.Gillenormand', group: [5] },
    { id: 'Marius', group: [8] },
    { id: 'BaronessT', group: [5] },
    { id: 'Mabeuf', group: [8] },
    { id: 'Enjolras', group: [8] },
    { id: 'Combeferre', group: [8] },
    { id: 'Prouvaire', group: [8] },
    { id: 'Feuilly', group: [8] },
    { id: 'Courfeyrac', group: [8] },
    { id: 'Bahorel', group: [8] },
    { id: 'Bossuet', group: [8] },
    { id: 'Joly', group: [8] },
    { id: 'Grantaire', group: [8] },
    { id: 'MotherPlutarch', group: [9] },
    { id: 'Gueulemer', group: [4] },
    { id: 'Babet', group: [4] },
    { id: 'Claquesous', group: [4] },
    { id: 'Montparnasse', group: [4] },
    { id: 'Toussaint', group: [5] },
    { id: 'Child1', group: [10] },
    { id: 'Child2', group: [10] },
    { id: 'Brujon', group: [4] },
    { id: 'Mme.Hucheloup', group: [8] },
  ];
  private links = [
    { source: 'Napoleon', target: 'Myriel', value: 1 },
    { source: 'Mlle.Baptistine', target: 'Myriel', value: 8 },
    { source: 'Mme.Magloire', target: 'Myriel', value: 10 },
    { source: 'Mme.Magloire', target: 'Mlle.Baptistine', value: 6 },
    { source: 'CountessdeLo', target: 'Myriel', value: 1 },
    { source: 'Geborand', target: 'Myriel', value: 1 },
    { source: 'Champtercier', target: 'Myriel', value: 1 },
    { source: 'Cravatte', target: 'Myriel', value: 1 },
    { source: 'Count', target: 'Myriel', value: 2 },
    { source: 'OldMan', target: 'Myriel', value: 1 },
    { source: 'Valjean', target: 'Labarre', value: 1 },
    { source: 'Valjean', target: 'Mme.Magloire', value: 3 },
    { source: 'Valjean', target: 'Mlle.Baptistine', value: 3 },
    { source: 'Valjean', target: 'Myriel', value: 5 },
    { source: 'Marguerite', target: 'Valjean', value: 1 },
    { source: 'Mme.deR', target: 'Valjean', value: 1 },
    { source: 'Isabeau', target: 'Valjean', value: 1 },
    { source: 'Gervais', target: 'Valjean', value: 1 },
    { source: 'Listolier', target: 'Tholomyes', value: 4 },
    { source: 'Fameuil', target: 'Tholomyes', value: 4 },
    { source: 'Fameuil', target: 'Listolier', value: 4 },
    { source: 'Blacheville', target: 'Tholomyes', value: 4 },
    { source: 'Blacheville', target: 'Listolier', value: 4 },
    { source: 'Blacheville', target: 'Fameuil', value: 4 },
    { source: 'Favourite', target: 'Tholomyes', value: 3 },
    { source: 'Favourite', target: 'Listolier', value: 3 },
    { source: 'Favourite', target: 'Fameuil', value: 3 },
    { source: 'Favourite', target: 'Blacheville', value: 4 },
    { source: 'Dahlia', target: 'Tholomyes', value: 3 },
    { source: 'Dahlia', target: 'Listolier', value: 3 },
    { source: 'Dahlia', target: 'Fameuil', value: 3 },
    { source: 'Dahlia', target: 'Blacheville', value: 3 },
    { source: 'Dahlia', target: 'Favourite', value: 5 },
    { source: 'Zephine', target: 'Tholomyes', value: 3 },
    { source: 'Zephine', target: 'Listolier', value: 3 },
    { source: 'Zephine', target: 'Fameuil', value: 3 },
    { source: 'Zephine', target: 'Blacheville', value: 3 },
    { source: 'Zephine', target: 'Favourite', value: 4 },
    { source: 'Zephine', target: 'Dahlia', value: 4 },
    { source: 'Fantine', target: 'Tholomyes', value: 3 },
    { source: 'Fantine', target: 'Listolier', value: 3 },
    { source: 'Fantine', target: 'Fameuil', value: 3 },
    { source: 'Fantine', target: 'Blacheville', value: 3 },
    { source: 'Fantine', target: 'Favourite', value: 4 },
    { source: 'Fantine', target: 'Dahlia', value: 4 },
    { source: 'Fantine', target: 'Zephine', value: 4 },
    { source: 'Fantine', target: 'Marguerite', value: 2 },
    { source: 'Fantine', target: 'Valjean', value: 9 },
    { source: 'Mme.Thenardier', target: 'Fantine', value: 2 },
    { source: 'Mme.Thenardier', target: 'Valjean', value: 7 },
    { source: 'Thenardier', target: 'Mme.Thenardier', value: 13 },
    { source: 'Thenardier', target: 'Fantine', value: 1 },
    { source: 'Thenardier', target: 'Valjean', value: 12 },
    { source: 'Cosette', target: 'Mme.Thenardier', value: 4 },
    { source: 'Cosette', target: 'Valjean', value: 31 },
    { source: 'Cosette', target: 'Tholomyes', value: 1 },
    { source: 'Cosette', target: 'Thenardier', value: 1 },
    { source: 'Javert', target: 'Valjean', value: 17 },
    { source: 'Javert', target: 'Fantine', value: 5 },
    { source: 'Javert', target: 'Thenardier', value: 5 },
    { source: 'Javert', target: 'Mme.Thenardier', value: 1 },
    { source: 'Javert', target: 'Cosette', value: 1 },
    { source: 'Fauchelevent', target: 'Valjean', value: 8 },
    { source: 'Fauchelevent', target: 'Javert', value: 1 },
    { source: 'Bamatabois', target: 'Fantine', value: 1 },
    { source: 'Bamatabois', target: 'Javert', value: 1 },
    { source: 'Bamatabois', target: 'Valjean', value: 2 },
    { source: 'Perpetue', target: 'Fantine', value: 1 },
    { source: 'Simplice', target: 'Perpetue', value: 2 },
    { source: 'Simplice', target: 'Valjean', value: 3 },
    { source: 'Simplice', target: 'Fantine', value: 2 },
    { source: 'Simplice', target: 'Javert', value: 1 },
    { source: 'Scaufflaire', target: 'Valjean', value: 1 },
    { source: 'Woman1', target: 'Valjean', value: 2 },
    { source: 'Woman1', target: 'Javert', value: 1 },
    { source: 'Judge', target: 'Valjean', value: 3 },
    { source: 'Judge', target: 'Bamatabois', value: 2 },
    { source: 'Champmathieu', target: 'Valjean', value: 3 },
    { source: 'Champmathieu', target: 'Judge', value: 3 },
    { source: 'Champmathieu', target: 'Bamatabois', value: 2 },
    { source: 'Brevet', target: 'Judge', value: 2 },
    { source: 'Brevet', target: 'Champmathieu', value: 2 },
    { source: 'Brevet', target: 'Valjean', value: 2 },
    { source: 'Brevet', target: 'Bamatabois', value: 1 },
    { source: 'Chenildieu', target: 'Judge', value: 2 },
    { source: 'Chenildieu', target: 'Champmathieu', value: 2 },
    { source: 'Chenildieu', target: 'Brevet', value: 2 },
    { source: 'Chenildieu', target: 'Valjean', value: 2 },
    { source: 'Chenildieu', target: 'Bamatabois', value: 1 },
    { source: 'Cochepaille', target: 'Judge', value: 2 },
    { source: 'Cochepaille', target: 'Champmathieu', value: 2 },
    { source: 'Cochepaille', target: 'Brevet', value: 2 },
    { source: 'Cochepaille', target: 'Chenildieu', value: 2 },
    { source: 'Cochepaille', target: 'Valjean', value: 2 },
    { source: 'Cochepaille', target: 'Bamatabois', value: 1 },
    { source: 'Pontmercy', target: 'Thenardier', value: 1 },
    { source: 'Boulatruelle', target: 'Thenardier', value: 1 },
    { source: 'Eponine', target: 'Mme.Thenardier', value: 2 },
    { source: 'Eponine', target: 'Thenardier', value: 3 },
    { source: 'Anzelma', target: 'Eponine', value: 2 },
    { source: 'Anzelma', target: 'Thenardier', value: 2 },
    { source: 'Anzelma', target: 'Mme.Thenardier', value: 1 },
    { source: 'Woman2', target: 'Valjean', value: 3 },
    { source: 'Woman2', target: 'Cosette', value: 1 },
    { source: 'Woman2', target: 'Javert', value: 1 },
    { source: 'MotherInnocent', target: 'Fauchelevent', value: 3 },
    { source: 'MotherInnocent', target: 'Valjean', value: 1 },
    { source: 'Gribier', target: 'Fauchelevent', value: 2 },
    { source: 'Mme.Burgon', target: 'Jondrette', value: 1 },
    { source: 'Gavroche', target: 'Mme.Burgon', value: 2 },
    { source: 'Gavroche', target: 'Thenardier', value: 1 },
    { source: 'Gavroche', target: 'Javert', value: 1 },
    { source: 'Gavroche', target: 'Valjean', value: 1 },
    { source: 'Gillenormand', target: 'Cosette', value: 3 },
    { source: 'Gillenormand', target: 'Valjean', value: 2 },
    { source: 'Magnon', target: 'Gillenormand', value: 1 },
    { source: 'Magnon', target: 'Mme.Thenardier', value: 1 },
    { source: 'Mlle.Gillenormand', target: 'Gillenormand', value: 9 },
    { source: 'Mlle.Gillenormand', target: 'Cosette', value: 2 },
    { source: 'Mlle.Gillenormand', target: 'Valjean', value: 2 },
    { source: 'Mme.Pontmercy', target: 'Mlle.Gillenormand', value: 1 },
    { source: 'Mme.Pontmercy', target: 'Pontmercy', value: 1 },
    { source: 'Mlle.Vaubois', target: 'Mlle.Gillenormand', value: 1 },
    { source: 'Lt.Gillenormand', target: 'Mlle.Gillenormand', value: 2 },
    { source: 'Lt.Gillenormand', target: 'Gillenormand', value: 1 },
    { source: 'Lt.Gillenormand', target: 'Cosette', value: 1 },
    { source: 'Marius', target: 'Mlle.Gillenormand', value: 6 },
    { source: 'Marius', target: 'Gillenormand', value: 12 },
    { source: 'Marius', target: 'Pontmercy', value: 1 },
    { source: 'Marius', target: 'Lt.Gillenormand', value: 1 },
    { source: 'Marius', target: 'Cosette', value: 21 },
    { source: 'Marius', target: 'Valjean', value: 19 },
    { source: 'Marius', target: 'Tholomyes', value: 1 },
    { source: 'Marius', target: 'Thenardier', value: 2 },
    { source: 'Marius', target: 'Eponine', value: 5 },
    { source: 'Marius', target: 'Gavroche', value: 4 },
    { source: 'BaronessT', target: 'Gillenormand', value: 1 },
    { source: 'BaronessT', target: 'Marius', value: 1 },
    { source: 'Mabeuf', target: 'Marius', value: 1 },
    { source: 'Mabeuf', target: 'Eponine', value: 1 },
    { source: 'Mabeuf', target: 'Gavroche', value: 1 },
    { source: 'Enjolras', target: 'Marius', value: 7 },
    { source: 'Enjolras', target: 'Gavroche', value: 7 },
    { source: 'Enjolras', target: 'Javert', value: 6 },
    { source: 'Enjolras', target: 'Mabeuf', value: 1 },
    { source: 'Enjolras', target: 'Valjean', value: 4 },
    { source: 'Combeferre', target: 'Enjolras', value: 15 },
    { source: 'Combeferre', target: 'Marius', value: 5 },
    { source: 'Combeferre', target: 'Gavroche', value: 6 },
    { source: 'Combeferre', target: 'Mabeuf', value: 2 },
    { source: 'Prouvaire', target: 'Gavroche', value: 1 },
    { source: 'Prouvaire', target: 'Enjolras', value: 4 },
    { source: 'Prouvaire', target: 'Combeferre', value: 2 },
    { source: 'Feuilly', target: 'Gavroche', value: 2 },
    { source: 'Feuilly', target: 'Enjolras', value: 6 },
    { source: 'Feuilly', target: 'Prouvaire', value: 2 },
    { source: 'Feuilly', target: 'Combeferre', value: 5 },
    { source: 'Feuilly', target: 'Mabeuf', value: 1 },
    { source: 'Feuilly', target: 'Marius', value: 1 },
    { source: 'Courfeyrac', target: 'Marius', value: 9 },
    { source: 'Courfeyrac', target: 'Enjolras', value: 17 },
    { source: 'Courfeyrac', target: 'Combeferre', value: 13 },
    { source: 'Courfeyrac', target: 'Gavroche', value: 7 },
    { source: 'Courfeyrac', target: 'Mabeuf', value: 2 },
    { source: 'Courfeyrac', target: 'Eponine', value: 1 },
    { source: 'Courfeyrac', target: 'Feuilly', value: 6 },
    { source: 'Courfeyrac', target: 'Prouvaire', value: 3 },
    { source: 'Bahorel', target: 'Combeferre', value: 5 },
    { source: 'Bahorel', target: 'Gavroche', value: 5 },
    { source: 'Bahorel', target: 'Courfeyrac', value: 6 },
    { source: 'Bahorel', target: 'Mabeuf', value: 2 },
    { source: 'Bahorel', target: 'Enjolras', value: 4 },
    { source: 'Bahorel', target: 'Feuilly', value: 3 },
    { source: 'Bahorel', target: 'Prouvaire', value: 2 },
    { source: 'Bahorel', target: 'Marius', value: 1 },
    { source: 'Bossuet', target: 'Marius', value: 5 },
    { source: 'Bossuet', target: 'Courfeyrac', value: 12 },
    { source: 'Bossuet', target: 'Gavroche', value: 5 },
    { source: 'Bossuet', target: 'Bahorel', value: 4 },
    { source: 'Bossuet', target: 'Enjolras', value: 10 },
    { source: 'Bossuet', target: 'Feuilly', value: 6 },
    { source: 'Bossuet', target: 'Prouvaire', value: 2 },
    { source: 'Bossuet', target: 'Combeferre', value: 9 },
    { source: 'Bossuet', target: 'Mabeuf', value: 1 },
    { source: 'Bossuet', target: 'Valjean', value: 1 },
    { source: 'Joly', target: 'Bahorel', value: 5 },
    { source: 'Joly', target: 'Bossuet', value: 7 },
    { source: 'Joly', target: 'Gavroche', value: 3 },
    { source: 'Joly', target: 'Courfeyrac', value: 5 },
    { source: 'Joly', target: 'Enjolras', value: 5 },
    { source: 'Joly', target: 'Feuilly', value: 5 },
    { source: 'Joly', target: 'Prouvaire', value: 2 },
    { source: 'Joly', target: 'Combeferre', value: 5 },
    { source: 'Joly', target: 'Mabeuf', value: 1 },
    { source: 'Joly', target: 'Marius', value: 2 },
    { source: 'Grantaire', target: 'Bossuet', value: 3 },
    { source: 'Grantaire', target: 'Enjolras', value: 3 },
    { source: 'Grantaire', target: 'Combeferre', value: 1 },
    { source: 'Grantaire', target: 'Courfeyrac', value: 2 },
    { source: 'Grantaire', target: 'Joly', value: 2 },
    { source: 'Grantaire', target: 'Gavroche', value: 1 },
    { source: 'Grantaire', target: 'Bahorel', value: 1 },
    { source: 'Grantaire', target: 'Feuilly', value: 1 },
    { source: 'Grantaire', target: 'Prouvaire', value: 1 },
    { source: 'MotherPlutarch', target: 'Mabeuf', value: 3 },
    { source: 'Gueulemer', target: 'Thenardier', value: 5 },
    { source: 'Gueulemer', target: 'Valjean', value: 1 },
    { source: 'Gueulemer', target: 'Mme.Thenardier', value: 1 },
    { source: 'Gueulemer', target: 'Javert', value: 1 },
    { source: 'Gueulemer', target: 'Gavroche', value: 1 },
    { source: 'Gueulemer', target: 'Eponine', value: 1 },
    { source: 'Babet', target: 'Thenardier', value: 6 },
    { source: 'Babet', target: 'Gueulemer', value: 6 },
    { source: 'Babet', target: 'Valjean', value: 1 },
    { source: 'Babet', target: 'Mme.Thenardier', value: 1 },
    { source: 'Babet', target: 'Javert', value: 2 },
    { source: 'Babet', target: 'Gavroche', value: 1 },
    { source: 'Babet', target: 'Eponine', value: 1 },
    { source: 'Claquesous', target: 'Thenardier', value: 4 },
    { source: 'Claquesous', target: 'Babet', value: 4 },
    { source: 'Claquesous', target: 'Gueulemer', value: 4 },
    { source: 'Claquesous', target: 'Valjean', value: 1 },
    { source: 'Claquesous', target: 'Mme.Thenardier', value: 1 },
    { source: 'Claquesous', target: 'Javert', value: 1 },
    { source: 'Claquesous', target: 'Eponine', value: 1 },
    { source: 'Claquesous', target: 'Enjolras', value: 1 },
    { source: 'Montparnasse', target: 'Javert', value: 1 },
    { source: 'Montparnasse', target: 'Babet', value: 2 },
    { source: 'Montparnasse', target: 'Gueulemer', value: 2 },
    { source: 'Montparnasse', target: 'Claquesous', value: 2 },
    { source: 'Montparnasse', target: 'Valjean', value: 1 },
    { source: 'Montparnasse', target: 'Gavroche', value: 1 },
    { source: 'Montparnasse', target: 'Eponine', value: 1 },
    { source: 'Montparnasse', target: 'Thenardier', value: 1 },
    { source: 'Toussaint', target: 'Cosette', value: 2 },
    { source: 'Toussaint', target: 'Javert', value: 1 },
    { source: 'Toussaint', target: 'Valjean', value: 1 },
    { source: 'Child1', target: 'Gavroche', value: 2 },
    { source: 'Child2', target: 'Gavroche', value: 2 },
    { source: 'Child2', target: 'Child1', value: 3 },
    { source: 'Brujon', target: 'Babet', value: 3 },
    { source: 'Brujon', target: 'Gueulemer', value: 3 },
    { source: 'Brujon', target: 'Thenardier', value: 3 },
    { source: 'Brujon', target: 'Gavroche', value: 1 },
    { source: 'Brujon', target: 'Eponine', value: 1 },
    { source: 'Brujon', target: 'Claquesous', value: 1 },
    { source: 'Brujon', target: 'Montparnasse', value: 1 },
    { source: 'Mme.Hucheloup', target: 'Bossuet', value: 1 },
    { source: 'Mme.Hucheloup', target: 'Joly', value: 1 },
    { source: 'Mme.Hucheloup', target: 'Grantaire', value: 1 },
    { source: 'Mme.Hucheloup', target: 'Bahorel', value: 1 },
    { source: 'Mme.Hucheloup', target: 'Courfeyrac', value: 1 },
    { source: 'Mme.Hucheloup', target: 'Gavroche', value: 1 },
    { source: 'Mme.Hucheloup', target: 'Enjolras', value: 1 },
  ];

  public margin = { top: 20, right: 40, bottom: 20, left: 100 };
  private step: number = 14;
  private pie = d3.pie<any>().value((d) => d.value);
  private height: number =
    (this.nodes.length - 1) * this.step + this.margin.top + this.margin.bottom;
  private width:number =
    (this.nodes.length - 1) * this.step + this.margin.right + this.margin.left;
  private svg;
  private noMatchColour = '#aaa';
  private groupArc = d3.arc().innerRadius(4).outerRadius(7);
  private arc(d: any, margin: number) {
    const y1 = d.source.y;
    const y2 = d.target.y ;
    const r = Math.abs(y2 - y1) / 2;
    return `M${margin},${y1}A${r},${r} 0,0,${y1 < y2 ? 1 : 0} ${margin},${y2}`;
  }

  private createSvg(width: number, height: number, margin: any): void {
    this.svg = d3
      .select('div#ARC')
      .append('svg')
      // .attr('width', width - margin.left * 3)
      // .attr('height', height + margin.left)
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
    const linkWidth = d3.scalePoint(
      links.map((d) => d.value).sort(d3.ascending),
      [1.5, 7.0]
    );
    
    const label = this.createGraphLabels(nodes,"p", y, color);

    const path = this.createGraphPath(links, "p",color, linkWidth);

    const overlay = this.createGraphOverlay(nodes, "p",y, color);
    
    this.createNodeArcs(label,"p",color);

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
    const legend = this.createGraphLegend(legendGroups, "p",color, stateArray);



    this.update(nodes, y, label,path, overlay)
  }

  constructor() {}

  private createGraphLegend(grouparr: number[], classSuffix: string, color: d3.ScaleOrdinal<{ toString(): string; }, string, never>, stateArray: boolean[]) {
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
      .call((g) => g
        .append('text')
        .attr('x', 6)
        .attr('dy', '0.35em')
        .attr('class', (d) => classSuffix + d)
        .attr('fill', (d) => d3.lab(color(d)))
        .text((d) => 'Group ' + d)
      )
      .call((g) => g
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
            .selectAll(`path.${classSuffix+d}`)
            .attr('stroke-opacity', 0.6)
            .attr('stroke', (d) => d.source.group === d.target.group ? color(d.source.group) : '#aaa'
            );
          this.svg
            .selectAll(`circle.${classSuffix+d}`)
            .attr('stroke-width', '0')
            .attr('stroke', color(d));
          this.svg
            .selectAll(`text.${classSuffix+d}`)
            .attr('fill', d3.lab(color(d)))
            .attr('font-weight', 'none')
            .attr('font-size', 10);
        } else if (stateArray[d] === false) {
          d3.selectAll(`path:not(.${classSuffix+d})`).attr('visibility', 'hidden');
          stateArray[d] = true;
          this.svg
            .selectAll(`path.${classSuffix+d}`)
            .attr('stroke-opacity', 1)
            .attr('stroke', d3.lab(color(d)).darker(1));
          this.svg
            .selectAll(`circle.${classSuffix+d}`)
            .attr('stroke-width', '1')
            .attr('stroke', 'black');
          this.svg
            .selectAll(`text.${classSuffix+d}`)
            .attr('font-weight', 'bold')
            .attr('font-size', 15);
        }
      });
  }

  private createGraphOverlay(nodes: any, classSuffix: string, y: d3.ScalePoint<{ toString(): string; }>, color: d3.ScaleOrdinal<{ toString(): string; }, string, never>) {
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
          .attr('stroke', "black"
          )
          .attr("z", 1);
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
          .attr('stroke', '#aaa'
          )
          .attr("z", 0);
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

  private createGraphPath(links: any, classSuffix:string, color: d3.ScaleOrdinal<{ toString(): string; }, string, never>, linkWidth: d3.ScalePoint<{ toString(): string; }>) {
    return this.svg
      .insert('g', '*')
      .attr('fill', 'none')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 1.5)
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('stroke', (d) => d.source.group === d.target.group
        ? color(d.source.group)
        : this.noMatchColour
      )
      .attr('stroke-width', (d) => linkWidth(d.source.group))
      .attr('stroke-opacity', 0.6)
      .attr('d', d => this.arc(d, this.margin.left * 2))
      .attr(
        'class',
        (d) => d.source.id.replace(/\./g, ' ') +
          ' ' +
          d.target.id.replace(/\./g, ' ') +
          ' ' + classSuffix +
          d.source.group.join(" " + classSuffix)
      );
  }

  private createGraphLabels(nodes: any, classSuffix: string, y: d3.ScalePoint<{ toString(): string; }>, color: d3.ScaleOrdinal<{ toString(): string; }, string, never>) {
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
      )

  }

    //Method to create Node Arcs
    private createNodeArcs(node: any, classSuffix: string, color: d3.ScaleOrdinal<{ toString(): string; }, string, never>) {
      node
      .append('text')
      .attr('x', -10)
      .attr('dy', '0.35em')
      .attr(     'class',
      (d) =>
        d.id.replace(/\./g, '') +
        ' ' +
        classSuffix +
        d.group.join(' ' + classSuffix))
      .attr('fill', (d) => d3.lab(color(d.group)))
      .text((d) => d.id)
      node
        .append('circle')
        .attr('r', 3)
        .attr(        'class',
        (d) =>
          d.id.replace(/\./g, '') +
          ' ' +
          classSuffix +
          d.group.join(' ' + classSuffix))
        .attr('fill', "#12d")
        .each((d, i) => {
          let pieData: pieData[] = [];
          d.group.forEach((element) => {
            pieData.push({
              color: color(element),
              value: 1 / d.group.length,
            });
          });
          let arcData = this.pie(pieData);
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
            .attr("class", `${classSuffix}arcs`);
        });
    }
    private update(nodes: any, y:any, label:any,path: any, overlay: any) {
      y.domain(nodes.sort((a, b) => a.group - b.group || d3.ascending(a.id, b.id)).map(d => d.id));
  
      const t = this.svg.transition()
          .duration(750);
  
      label.transition(t)
          .delay((d, i) => i * 20)
          .attrTween("transform", d => {
            const i = d3.interpolateNumber(d.y, y(d.id));
            return t => `translate(${this.margin.left * 2},${d.y = i(t)})`;
          });
  
      path.transition(t)
          .duration(750 + nodes.length * 20)
          .attrTween("d", d => () => this.arc(d, this.margin.left * 2));
  
      overlay.transition(t)
          .delay((d, i) => i * 20)
          .attr("y", d => y(d.id) - this.step / 2);
    }
  ngOnInit(): void {
    const nodes = this.nodes.map(({ id, group }) => ({
      id,
      sourceLinks: [],
      targetLinks: [],
      group,
    }));

    const nodeById = new Map(nodes.map((d) => [d.id, d]));
    const links = this.links.map(({ source, target, value }) => ({
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
    this.drawArc(nodes,links);
  }
}
