import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PersonagemListaComponent } from './personagem-lista/personagem-lista.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PersonagemListaComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'protagonistarios';
}
