import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Personagem } from '../models/personagem.model';
import { PersonagemService } from '../personagem.service';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-personagem-lista',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    TagModule,
    ButtonModule,
    ToolbarModule,
    DialogModule,
    InputTextModule,
    InputSwitchModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './personagem-lista.component.html',
  styleUrls: ['./personagem-lista.component.css']
})

export class PersonagemListaComponent implements OnInit {
  personagens: Personagem[] = [];
  displayModal: boolean = false;
  personagemSelecionado!: Personagem;

  constructor(
    private personagemService: PersonagemService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.personagens = this.personagemService.getPersonagens(); 
  }

  abrirModalNovo() {
    this.personagemSelecionado = {
      id: 0,
      nome: '',
      ativo: false
    };
    this.displayModal = true;
  }

  salvarPersonagem() {
    if (!this.personagemSelecionado.nome.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'O nome é obrigatório.'
      });
      return;
    }

    this.personagemSelecionado.id = this.gerarProximoId();
    this.personagens.push({ ...this.personagemSelecionado });

    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Personagem inserido com sucesso!'
    });

    this.displayModal = false;
  }

  gerarProximoId(): number {
    if (this.personagens.length === 0) return 1;
    return Math.max(...this.personagens.map(p => p.id)) + 1;
  }

  removerPersonagem(personagem: Personagem) {
  this.personagens = this.personagens.filter(p => p.id !== personagem.id);

  this.messageService.add({
    severity: 'success',
    summary: 'Removido',
    detail: `Personagem "${personagem.nome}" foi removido com sucesso!`
  });
}
}
