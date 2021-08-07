import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateInfoComponent } from './private-info.component';

describe('PrivateInfoComponent', () => {
  let component: PrivateInfoComponent;
  let fixture: ComponentFixture<PrivateInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrivateInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
