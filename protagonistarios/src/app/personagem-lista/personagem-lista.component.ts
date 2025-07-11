import { Component, OnInit, OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Personagem } from "../models/personagem.model"
import { PersonagemService } from "../personagem.service"
import { ToastModule } from "primeng/toast"
import { MessageService } from "primeng/api"
import { PersonagemTabelaComponent } from "../components/personagem-tabela/personagem-tabela.component"
import { PersonagemFormComponent } from "../components/personagem-form/personagem-form.component"
import { PersonagemDetalhesComponent } from "../components/personagem-detalhes/personagem-detalhes.component"
import { Subject, takeUntil } from "rxjs"

@Component({
  selector: "app-personagem-lista",
  standalone: true,
  imports: [CommonModule, ToastModule, PersonagemTabelaComponent, PersonagemFormComponent, PersonagemDetalhesComponent],
  providers: [MessageService],
  templateUrl: "./personagem-lista.component.html",
})
export class PersonagemListaComponent implements OnInit, OnDestroy {
  personagens: Personagem[] = []
  displayFormModal = false
  displayDetalhesModal = false
  personagemSelecionado: Personagem | null = null
  personagemDetalhado: Personagem | null = null
  tituloForm = "Personagem"
  carregando = false

  private destroy$ = new Subject<void>()

  constructor(
    private personagemService: PersonagemService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.carregarPersonagens()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  carregarPersonagens(): void {
    this.carregando = true
    this.personagemService
      .getPersonagens()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (personagens) => {
          this.personagens = personagens
          this.carregando = false
        },
        error: (error) => {
          this.messageService.add({
            severity: "error",
            summary: "Erro",
            detail: error.message || "Erro ao carregar personagens",
          })
          this.carregando = false
        },
      })
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
    if (personagem.id === undefined || personagem.id === null) {
      this.messageService.add({
        severity: "error",
        summary: "Erro",
        detail: "ID do personagem não encontrado para exclusão.",
      })
      return
    }
    this.personagemService
      .removerPersonagem(personagem.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: "success",
            summary: "Removido",
            detail: `Personagem "${personagem.nome}" foi removido com sucesso!`,
          })
          this.carregarPersonagens()
        },
        error: (error) => {
          this.messageService.add({
            severity: "error",
            summary: "Erro",
            detail: error.message || "Erro ao remover personagem",
          })
        },
      })
  }

  onNovoPersonagem(): void {
    this.personagemSelecionado = {
      id: 0,
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

    const isNovo = !personagem.id || personagem.id === 0

    const operacao = isNovo
      ? this.personagemService.adicionarPersonagem(personagem)
      : this.personagemService.atualizarPersonagem(personagem)

    operacao.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.messageService.add({
          severity: "success",
          summary: "Sucesso",
          detail: `Personagem ${isNovo ? "adicionado" : "atualizado"} com sucesso!`,
        })

        this.displayFormModal = false
        this.personagemSelecionado = null
        this.carregarPersonagens()
      },
      error: (error) => {
        this.messageService.add({
          severity: "error",
          summary: "Erro",
          detail: error.message || `Erro ao ${isNovo ? "adicionar" : "atualizar"} personagem`,
        })
      },
    })
  }

  onFecharDetalhes(): void {
    this.displayDetalhesModal = false
    this.personagemDetalhado = null
  }
}
