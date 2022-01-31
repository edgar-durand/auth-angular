import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleContentItemComponent } from './article-content-item.component';

describe('ArticleContentItemComponent', () => {
  let component: ArticleContentItemComponent;
  let fixture: ComponentFixture<ArticleContentItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleContentItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleContentItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
