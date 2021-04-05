import * as d3 from "d3";
import { PieData } from "src/app/interface/pie-data";

export const GlobalVariables = Object.freeze({
    pie : d3.pie<PieData>().value((d) => d.value)
});