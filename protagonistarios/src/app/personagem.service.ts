import { Injectable } from '@angular/core';
import { Personagem } from './models/personagem.model';

@Injectable({
  providedIn: 'root'
})
export class PersonagemService {

  private personagens: Personagem[] = [
    { id: 1, nome: 'Gojo Satoru', ativo: false },
    { id: 2, nome: 'Kakashi Hatake', ativo: true },
    { id: 3, nome: 'MaoMao', ativo: true }
  ];

  constructor() { }

  getPersonagens(): Personagem[] {
    return this.personagens;
  }
}