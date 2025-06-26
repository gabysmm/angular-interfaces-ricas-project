import { Injectable } from '@angular/core';
import { Personagem } from './models/personagem.model';

@Injectable({
  providedIn: 'root'
})
export class PersonagemService {

  private personagens: Personagem[] = [
  {
    id: 1,
    nome: 'Gojo Satoru',
    anime: 'Jujutsu Kaisen',
    fotoUrl: 'https://newr7-r7-prod.web.arc-cdn.net/resizer/v2/CAIYZXKE7NEBJOW6BCIVHPYGLE.jpeg?auth=8814a2758f7986025d440c8929a45b6cc82f124feb7d63bfdee108425da27181&width=1600&height=2284',
    ativo: false,
    descricao: 'Adoro o gojo satoru porque o personagem apesar de ser o mais forte, ele divertido e engraçado, e apesar de tentarem desumaniza-lo por ser poderoso, ele é um dos personagens mais humanos da obra'
  },
  {
    id: 2,
    nome: 'Kakashi Hatake',
    anime: 'Naruto',
    fotoUrl: 'https://cdna.artstation.com/p/assets/images/images/027/778/344/large/julia-felitte-kakashi3.jpg?1592511826',
    ativo: true,
    descricao: 'Kakashi é o personagem que tinha tudo pra ser vilão e não foi, um dos mais humanos da obra. Uma criança soldado que teve de crescer rápido demais com o trabalho e com as perdas'
  },
  {
    id: 3,
    nome: 'MaoMao',
    anime: 'The Apothecary Diaries',
    fotoUrl: 'https://static.wikia.nocookie.net/kusuriya-no-hitorigoto/images/2/26/Maomao_%28Anime%29.png/revision/latest?cb=20230819200042',
    ativo: true,
    descricao: 'Maomao é uma personagem femina que foge do esteriotipo de delicada, frágil, gentil e sexualizada. Ela não é forte, mas tem uma inteligência e sagacidade incrivel, e sai por ai resolvendo milhares de misterios'
  }
];


  constructor() { }

  getPersonagens(): Personagem[] {
    return this.personagens;
  }
}