import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoverPagePage } from './cover-page.page';

describe('CoverPagePage', () => {
  let component: CoverPagePage;
  let fixture: ComponentFixture<CoverPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
