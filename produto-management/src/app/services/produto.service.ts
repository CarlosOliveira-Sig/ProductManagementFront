import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Produto } from '../models/produto';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private readonly apiUrl = 'http://localhost:44317/api';

  constructor(private http: HttpClient) {}

  getProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}/produtos`).pipe(
      catchError(this.handleError)
    );
  }

  getProduto(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/produtos/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createProduto(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(`${this.apiUrl}/produtos`, produto).pipe(
      catchError(this.handleError)
    );
  }

  updateProduto(id: number, produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/produtos/${id}`, produto).pipe(
      catchError(this.handleError)
    );
  }

  deleteProduto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/produtos/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro inesperado';
    
    if (error.error instanceof ErrorEvent) {
      // Erro do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do servidor
      switch (error.status) {
        case 400:
          errorMessage = 'Dados inválidos enviados para o servidor';
          break;
        case 401:
          errorMessage = 'Não autorizado. Verifique suas credenciais';
          break;
        case 403:
          errorMessage = 'Acesso negado';
          break;
        case 404:
          errorMessage = 'Recurso não encontrado';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor';
          break;
        case 0:
          errorMessage = 'Não foi possível conectar com o servidor';
          break;
        default:
          errorMessage = `Erro ${error.status}: ${error.message}`;
      }
    }
    
    console.error('Erro na API:', error);
    return throwError(() => new Error(errorMessage));
  }
}
