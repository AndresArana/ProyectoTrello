import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveTableComponent } from './save-table.component';

describe('SaveTableComponent', () => {
  let component: SaveTableComponent;
  let fixture: ComponentFixture<SaveTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
