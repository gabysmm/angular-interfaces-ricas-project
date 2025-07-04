import { Component } from "@angular/core"
import { PersonagemListaComponent } from "./personagem-lista/personagem-lista.component"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [PersonagemListaComponent],
  templateUrl: "./app.component.html",
})
export class AppComponent {
  title = "protagonistarios"
}
