import { Injectable } from "@angular/core"
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http"
import { Observable, throwError, BehaviorSubject } from "rxjs"
import { catchError, tap, map } from "rxjs/operators"
import { Personagem } from "./models/personagem.model"

export interface PersonagemResponse {
  count: number
  next: string | null
  previous: string | null
  results: Personagem[]
}

export interface PersonagemFilters {
  nome?: string
  anime?: string
  ativo?: boolean
  search?: string
}

export interface PersonagemEstatisticas {
  total_personagens: number
  personagens_vivos: number
  personagens_falecidos: number
  total_animes: number
}

@Injectable({
  providedIn: "root",
})
export class PersonagemService {
  // ATENÇÃO: VOCÊ PRECISA SUBSTITUIR ESTA URL PELA URL REAL DO SEU CODESPACE PARA A PORTA 8000.
  // EXEMPLO: "https://seu-codespace-nome-8000.app.github.dev/api/personagens"
  // Verifique a aba "PORTS" no seu Codespace para obter a URL correta.
  private readonly API_URL = "https://literate-eureka-x55646qpx7963pq66-8000.app.github.dev/api/personagens"
  private personagensSubject = new BehaviorSubject<Personagem[]>([])
  public personagens$ = this.personagensSubject.asObservable()

  constructor(private http: HttpClient) {
    console.log("API_URL configurada:", this.API_URL) // Adicionado para depuração
  }

  /**
   * Lista todos os personagens com filtros opcionais
   */
  getPersonagens(filters?: PersonagemFilters): Observable<Personagem[]> {
    let params = new HttpParams()

    if (filters) {
      if (filters.nome) {
        params = params.set("nome", filters.nome)
      }
      if (filters.anime) {
        params = params.set("anime", filters.anime)
      }
      if (filters.ativo !== undefined) {
        params = params.set("ativo", filters.ativo.toString())
      }
      if (filters.search) {
        params = params.set("search", filters.search)
      }
    }

    return this.http.get<PersonagemResponse>(`${this.API_URL}/`, { params }).pipe(
      map((response) => response.results),
      tap((personagens) => this.personagensSubject.next(personagens)),
      catchError(this.handleError),
    )
  }

  /**
   * Busca um personagem por ID
   */
  getPersonagemById(id: number): Observable<Personagem> {
    return this.http.get<Personagem>(`${this.API_URL}/${id}/`).pipe(catchError(this.handleError))
  }

  /**
   * Adiciona um novo personagem
   */
  adicionarPersonagem(personagem: Personagem): Observable<Personagem> {
    const personagemData = { ...personagem }
    delete personagemData.id // Remove o ID para criação

    return this.http.post<Personagem>(`${this.API_URL}/`, personagemData).pipe(
      tap((novoPersonagem) => {
        const personagensAtuais = this.personagensSubject.value
        this.personagensSubject.next([...personagensAtuais, novoPersonagem])
      }),
      catchError(this.handleError),
    )
  }

  /**
   * Atualiza um personagem existente
   */
  atualizarPersonagem(personagem: Personagem): Observable<Personagem> {
    if (personagem.id === undefined || personagem.id === null) {
      return throwError(() => new Error("ID do personagem é necessário para atualização."))
    }
    return this.http.put<Personagem>(`${this.API_URL}/${personagem.id}/`, personagem).pipe(
      tap((personagemAtualizado) => {
        const personagensAtuais = this.personagensSubject.value
        const index = personagensAtuais.findIndex((p) => p.id === personagemAtualizado.id)
        if (index >= 0) {
          personagensAtuais[index] = personagemAtualizado
          this.personagensSubject.next([...personagensAtuais])
        }
      }),
      catchError(this.handleError),
    )
  }

  /**
   * Remove um personagem
   */
  removerPersonagem(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}/`).pipe(
      tap(() => {
        const personagensAtuais = this.personagensSubject.value
        const personagensFiltrados = personagensAtuais.filter((p) => p.id !== id)
        this.personagensSubject.next(personagensFiltrados)
      }),
      catchError(this.handleError),
    )
  }

  /**
   * Busca personagens por termo
   */
  buscarPersonagens(termo: string): Observable<Personagem[]> {
    return this.getPersonagens({ search: termo })
  }

  /**
   * Obtém estatísticas dos personagens
   */
  getEstatisticas(): Observable<PersonagemEstatisticas> {
    return this.http.get<PersonagemEstatisticas>(`${this.API_URL}/estatisticas/`).pipe(catchError(this.handleError))
  }

  /**
   * Obtém lista de animes únicos
   */
  getAnimes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/animes/`).pipe(catchError(this.handleError))
  }

  /**
   * Recarrega a lista de personagens
   */
  recarregarPersonagens(): Observable<Personagem[]> {
    return this.getPersonagens()
  }

  /**
   * Limpa o cache local
   */
  limparCache(): void {
    this.personagensSubject.next([])
  }

  /**
   * Gera o próximo ID disponível (para uso offline/fallback)
   */
  gerarProximoId(): number {
    const personagens = this.personagensSubject.value
    if (personagens.length === 0) return 1
    // Filtra IDs que são undefined antes de passar para Math.max
    const ids = personagens.map((p) => p.id).filter((id): id is number => id !== undefined)
    if (ids.length === 0) return 1 // Caso todos os IDs sejam undefined (improvável para dados existentes)
    return Math.max(...ids) + 1
  }

  /**
   * Tratamento de erros HTTP
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = "Erro desconhecido"

    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`
    } else {
      // Erro do lado do servidor
      switch (error.status) {
        case 400:
          errorMessage = "Dados inválidos. Verifique as informações enviadas."
          break
        case 404:
          errorMessage = "Personagem não encontrado."
          break
        case 500:
          errorMessage = "Erro interno do servidor. Tente novamente mais tarde."
          break
        case 0:
          errorMessage = "Não foi possível conectar ao servidor. Verifique sua conexão."
          break
        default:
          errorMessage = `Erro ${error.status}: ${error.message}`
      }

      // Se houver detalhes do erro no response
      if (error.error && typeof error.error === "object") {
        const errorDetails = Object.values(error.error).flat().join(", ")
        if (errorDetails) {
          errorMessage += ` Detalhes: ${errorDetails}`
        }
      }
    }

    console.error("Erro na API:", error)
    return throwError(() => new Error(errorMessage))
  }
}
