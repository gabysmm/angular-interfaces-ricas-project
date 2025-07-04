import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Personagem } from "../models/personagem.model"
import { PersonagemService } from "../personagem.service"
import { ToastModule } from "primeng/toast"
import { MessageService } from "primeng/api"
import { PersonagemTabelaComponent } from "../components/personagem-tabela/personagem-tabela.component"
import { PersonagemFormComponent } from "../components/personagem-form/personagem-form.component"
import { PersonagemDetalhesComponent } from "../components/personagem-detalhes/personagem-detalhes.component"

@Component({
  selector: "app-personagem-lista",
  standalone: true,
  imports: [CommonModule, ToastModule, PersonagemTabelaComponent, PersonagemFormComponent, PersonagemDetalhesComponent],
  providers: [MessageService],
  templateUrl: "./personagem-lista.component.html",
})
export class PersonagemListaComponent implements OnInit {
  personagens: Personagem[] = []
  displayFormModal = false
  displayDetalhesModal = false
  personagemSelecionado: Personagem | null = null
  personagemDetalhado: Personagem | null = null
  tituloForm = "Personagem"

  constructor(
    private personagemService: PersonagemService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.carregarPersonagens()
  }

  carregarPersonagens(): void {
    this.personagens = this.personagemService.getPersonagens()
  }

  // Handlers para eventos da tabela
  onVisualizarPersonagem(personagem: Personagem): void {
    this.personagemDetalhado = personagem
    this.displayDetalhesModal = true
  }

  onEditarPersonagem(personagem: Personagem): void {
    this.personagemSelecionado = { ...personagem }
    this.tituloForm = "Editar Personagem"
    this.displayFormModal = true
  }

  onExcluirPersonagem(personagem: Personagem): void {
    this.personagemService.removerPersonagem(personagem.id)
    this.carregarPersonagens()

    this.messageService.add({
      severity: "success",
      summary: "Removido",
      detail: `Personagem "${personagem.nome}" foi removido com sucesso!`,
    })
  }

  onNovoPersonagem(): void {
    this.personagemSelecionado = {
      id: this.personagemService.gerarProximoId(),
      nome: "",
      anime: "",
      fotoUrl: "",
      ativo: true,
      descricao: "",
    }
    this.tituloForm = "Novo Personagem"
    this.displayFormModal = true
  }

  // Handlers para eventos do formulário
  onFecharForm(): void {
    this.displayFormModal = false
    this.personagemSelecionado = null
  }

  onSalvarPersonagem(personagem: Personagem): void {
    if (!personagem.nome.trim()) {
      this.messageService.add({
        severity: "warn",
        summary: "Atenção",
        detail: "O nome é obrigatório.",
      })
      return
    }

    const isNovo = !this.personagens.some((p) => p.id === personagem.id)

    if (isNovo) {
      this.personagemService.adicionarPersonagem(personagem)
    } else {
      this.personagemService.atualizarPersonagem(personagem)
    }

    this.carregarPersonagens()

    this.messageService.add({
      severity: "success",
      summary: "Sucesso",
      detail: `Personagem ${isNovo ? "adicionado" : "atualizado"} com sucesso!`,
    })

    this.displayFormModal = false
    this.personagemSelecionado = null
  }

  // Handlers para eventos do modal de detalhes
  onFecharDetalhes(): void {
    this.displayDetalhesModal = false
    this.personagemDetalhado = null
  }
}
