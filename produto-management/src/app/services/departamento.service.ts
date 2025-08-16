import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Departamento } from '../models/produto';

@Injectable({ providedIn: 'root' })
export class DepartamentoService {
  private readonly apiUrl = 'http://localhost:44317/api';

  constructor(private http: HttpClient) {}

  getDepartamentos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(`${this.apiUrl}/departamentos`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro inesperado';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
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
