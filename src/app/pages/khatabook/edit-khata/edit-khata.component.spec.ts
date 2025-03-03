import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditKhataComponent } from './edit-khata.component';

describe('EditKhataComponent', () => {
  let component: EditKhataComponent;
  let fixture: ComponentFixture<EditKhataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditKhataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditKhataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
