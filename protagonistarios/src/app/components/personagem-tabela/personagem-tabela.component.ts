import { Component, Input, Output, EventEmitter } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Personagem } from "../../models/personagem.model"
import { TableModule } from "primeng/table"
import { TagModule } from "primeng/tag"
import { ButtonModule } from "primeng/button"

@Component({
  selector: "app-personagem-tabela",
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, ButtonModule],
  templateUrl: "./personagem-tabela.component.html",
  styleUrls: ["./personagem-tabela.component.css"],
})
export class PersonagemTabelaComponent {
  @Input() personagens: Personagem[] = []

  @Output() visualizarPersonagem = new EventEmitter<Personagem>()
  @Output() editarPersonagem = new EventEmitter<Personagem>()
  @Output() excluirPersonagem = new EventEmitter<Personagem>()
  @Output() novoPersonagem = new EventEmitter<void>()

  onVisualizar(personagem: Personagem): void {
    this.visualizarPersonagem.emit(personagem)
  }

  onEditar(personagem: Personagem): void {
    this.editarPersonagem.emit(personagem)
  }

  onExcluir(personagem: Personagem): void {
    this.excluirPersonagem.emit(personagem)
  }

  onNovo(): void {
    this.novoPersonagem.emit()
  }
}
