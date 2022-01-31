import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideDividerComponent } from './side-divider.component';

describe('SideDividerComponent', () => {
  let component: SideDividerComponent;
  let fixture: ComponentFixture<SideDividerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SideDividerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SideDividerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
