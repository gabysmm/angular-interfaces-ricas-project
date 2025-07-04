import { Component, Input, Output, EventEmitter } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Personagem } from "../../models/personagem.model"
import { DialogModule } from "primeng/dialog"
import { TagModule } from "primeng/tag"

@Component({
  selector: "app-personagem-detalhes",
  standalone: true,
  imports: [CommonModule, DialogModule, TagModule],
  templateUrl: "./personagem-detalhes.component.html",
  styleUrls: ["./personagem-detalhes.component.css"],
})
export class PersonagemDetalhesComponent {
  @Input() visible = false
  @Input() personagem: Personagem | null = null

  @Output() fechar = new EventEmitter<void>()

  onFechar(): void {
    this.fechar.emit()
  }
}
