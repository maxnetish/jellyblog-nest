import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsufficientRightsComponent } from './insufficient-rights.component';

describe('InsufficientRightsComponent', () => {
  let component: InsufficientRightsComponent;
  let fixture: ComponentFixture<InsufficientRightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsufficientRightsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsufficientRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
