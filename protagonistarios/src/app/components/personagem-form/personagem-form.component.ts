import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Personagem } from "../../models/personagem.model"
import { DialogModule } from "primeng/dialog"
import { ButtonModule } from "primeng/button"
import { InputTextModule } from "primeng/inputtext"
import { InputSwitchModule } from "primeng/inputswitch"

@Component({
  selector: "app-personagem-form",
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule, InputSwitchModule],
  templateUrl: "./personagem-form.component.html",
  styleUrls: ["./personagem-form.component.css"],
})
export class PersonagemFormComponent implements OnChanges {
  @Input() visible = false
  @Input() personagem: Personagem | null = null
  @Input() titulo = "Personagem"

  @Output() fechar = new EventEmitter<void>()
  @Output() salvar = new EventEmitter<Personagem>()

  formData: Personagem = this.criarPersonagemVazio()

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["personagem"] && this.personagem) {
      this.formData = { ...this.personagem }
    } else if (changes["visible"] && this.visible && !this.personagem) {
      this.formData = this.criarPersonagemVazio()
    }
  }

  onFechar(): void {
    this.fechar.emit()
  }

  onSalvar(): void {
    this.salvar.emit(this.formData)
  }

  private criarPersonagemVazio(): Personagem {
    return {
      id: 0,
      nome: "",
      anime: "",
      fotoUrl: "",
      ativo: true,
      descricao: "",
    }
  }
}
