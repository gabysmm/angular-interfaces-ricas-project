import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonagemListaComponent } from './personagem-lista.component';

describe('PersonagemListaComponent', () => {
  let component: PersonagemListaComponent;
  let fixture: ComponentFixture<PersonagemListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonagemListaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonagemListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
