import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewKhataComponent } from './view-khata.component';

describe('ViewKhataComponent', () => {
  let component: ViewKhataComponent;
  let fixture: ComponentFixture<ViewKhataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewKhataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewKhataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
