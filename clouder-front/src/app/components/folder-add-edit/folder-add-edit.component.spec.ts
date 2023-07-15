import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderAddEditComponent } from './folder-add-edit.component';

describe('FolderAddEditComponent', () => {
  let component: FolderAddEditComponent;
  let fixture: ComponentFixture<FolderAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FolderAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FolderAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
