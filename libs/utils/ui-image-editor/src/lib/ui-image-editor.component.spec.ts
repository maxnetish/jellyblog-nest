import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiImageEditorComponent } from './ui-image-editor.component';

describe('UiImageEditorComponent', () => {
  let component: UiImageEditorComponent;
  let fixture: ComponentFixture<UiImageEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiImageEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiImageEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
