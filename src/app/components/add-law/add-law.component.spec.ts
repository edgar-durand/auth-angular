import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLawComponent } from './add-law.component';

describe('AddLawComponent', () => {
  let component: AddLawComponent;
  let fixture: ComponentFixture<AddLawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLawComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
