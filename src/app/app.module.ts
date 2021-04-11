import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BarComponent } from './bar/bar.component';
import { PieComponent } from './pie/pie.component';
import { ScatterComponent } from './scatter/scatter.component';
import { ArcComponent } from './arc/arc.component';
import { DataServiceService } from './data-service.service';
import { RouterModule, Routes } from '@angular/router';
import { ForceDirectedComponent } from './force-directed/force-directed.component';
import { TestArcComponent } from './test-arc/test-arc.component';
import { DisjointedGraphComponent } from './disjointed-graph/disjointed-graph.component';
import { GraphViewComponent } from './graph-view/graph-view.component';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSelectModule} from '@angular/material/select';
const routes: Routes = [];


@NgModule({
  declarations: [
    AppComponent,
    BarComponent,
    PieComponent,
    ScatterComponent,
    ArcComponent,
    ForceDirectedComponent,
    TestArcComponent,
    DisjointedGraphComponent,
    GraphViewComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatButtonModule,
    MatSlideToggleModule,
    BrowserAnimationsModule,
    FormsModule,
    MatSelectModule,
    MatButtonToggleModule,
    RouterModule.forRoot(routes)
  ],
  providers: [DataServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
