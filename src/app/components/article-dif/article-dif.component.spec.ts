import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleDifComponent } from './article-dif.component';

describe('ArticleDifComponent', () => {
  let component: ArticleDifComponent;
  let fixture: ComponentFixture<ArticleDifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleDifComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleDifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
