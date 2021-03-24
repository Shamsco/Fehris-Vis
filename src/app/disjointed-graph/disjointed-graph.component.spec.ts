import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisjointedGraphComponent } from './disjointed-graph.component';

describe('DisjointedGraphComponent', () => {
  let component: DisjointedGraphComponent;
  let fixture: ComponentFixture<DisjointedGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisjointedGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisjointedGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
