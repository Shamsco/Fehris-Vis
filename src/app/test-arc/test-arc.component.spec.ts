import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestArcComponent } from './test-arc.component';

describe('TestArcComponent', () => {
  let component: TestArcComponent;
  let fixture: ComponentFixture<TestArcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestArcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestArcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
