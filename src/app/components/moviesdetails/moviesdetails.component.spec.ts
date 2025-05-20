import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesDetailsComponent } from './moviesdetails.component';

describe('MoviesdetailsComponent', () => {
  let component: MoviesDetailsComponent;
  let fixture: ComponentFixture<MoviesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviesDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoviesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
