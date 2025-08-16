import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Produto, Departamento } from '../../models/produto';
import { ProdutoService } from '../../services/produto.service';
import { DepartamentoService } from '../../services/departamento.service';

// Constantes para melhorar a manutenibilidade
const SNACKBAR_DURATION = 3000;
const SNACKBAR_POSITIONS = {
  horizontal: 'center' as const,
  vertical: 'bottom' as const
};

@Component({
  selector: 'app-produto',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
    MatTooltipModule
  ],
  templateUrl: './produto.html',
  styleUrl: './produto.css'
})
export class ProdutoComponent implements OnInit {
  // Propriedades públicas
  public readonly displayedColumns: string[] = ['codigo', 'descricao', 'departamento', 'preco', 'status', 'acoes'];
  
  // Propriedades privadas
  public produtoForm!: FormGroup;
  public produtos: Produto[] = [];
  public departamentos: Departamento[] = [];
  public isEditing = false;
  public editingId: number | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly produtoService: ProdutoService,
    private readonly departamentoService: DepartamentoService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  // Métodos públicos
  public salvarProduto(): void {
    if (this.produtoForm.valid) {
      const produto: Produto = this.produtoForm.value;
      
      if (this.isEditing && this.editingId) {
        this.atualizarProduto(produto);
      } else {
        this.criarProduto(produto);
      }
    } else {
      this.mostrarMensagem('Por favor, preencha todos os campos obrigatórios.', 'warning');
    }
  }

  public editarProduto(produto: Produto): void {
    this.isEditing = true;
    this.editingId = produto.id;
    this.produtoForm.patchValue({
      codigo: produto.codigo,
      descricao: produto.descricao,
      departamentoId: produto.departamentoId,
      preco: produto.preco,
      status: produto.status
    });
  }

  public excluirProduto(id: number): void {
    this.abrirDialogoConfirmacao(id);
  }

  public cancelarEdicao(): void {
    this.resetarFormulario();
  }

  public getNomeDepartamento(departamentoId: number): string {
    const departamento = this.departamentos.find(d => d.id === departamentoId);
    return departamento ? departamento.nome : 'N/A';
  }

  public formatarPreco(preco: number): string {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(preco);
  }

  public formatarStatus(status: boolean): string {
    return status ? 'Ativo' : 'Inativo';
  }

  // Métodos privados
  private initializeForm(): void {
    this.produtoForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(3)]],
      descricao: ['', [Validators.required, Validators.minLength(5)]],
      departamentoId: ['', Validators.required],
      preco: ['', [Validators.required, Validators.min(0.01)]],
      status: [true]
    });
  }

  private loadInitialData(): void {
    this.carregarProdutos();
    this.carregarDepartamentos();
  }

  private carregarProdutos(): void {
    this.produtoService.getProdutos().subscribe({
      next: (produtos) => { 
        this.produtos = produtos; 
      },
      error: (error) => { 
        this.mostrarMensagem('Erro ao carregar produtos: ' + error.message, 'error'); 
      }
    });
  }

  private carregarDepartamentos(): void {
    this.departamentoService.getDepartamentos().subscribe({
      next: (departamentos) => { 
        this.departamentos = departamentos; 
      },
      error: (error) => { 
        this.mostrarMensagem('Erro ao carregar departamentos: ' + error.message, 'error'); 
      }
    });
  }

  private criarProduto(produto: Produto): void {
    this.produtoService.createProduto(produto).subscribe({
      next: () => { 
        this.mostrarMensagem('Produto criado com sucesso!', 'success'); 
        this.resetarFormulario(); 
        this.carregarProdutos(); 
      },
      error: (error) => { 
        this.mostrarMensagem('Erro ao criar produto: ' + error.message, 'error'); 
      }
    });
  }

  private atualizarProduto(produto: Produto): void {
    if (!this.editingId) return;
    
    this.produtoService.updateProduto(this.editingId, produto).subscribe({
      next: () => { 
        this.mostrarMensagem('Produto atualizado com sucesso!', 'success'); 
        this.resetarFormulario(); 
        this.carregarProdutos(); 
      },
      error: (error) => { 
        this.mostrarMensagem('Erro ao atualizar produto: ' + error.message, 'error'); 
      }
    });
  }

  private abrirDialogoConfirmacao(id: number): void {
    const dialogRef = this.dialog.open(ConfirmacaoDialogComponent, {
      width: '350px',
      data: { mensagem: 'Tem certeza que deseja excluir este produto?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.executarExclusao(id);
      }
    });
  }

  private executarExclusao(id: number): void {
    this.produtoService.deleteProduto(id).subscribe({
      next: () => { 
        this.mostrarMensagem('Produto excluído com sucesso!', 'success'); 
        this.carregarProdutos(); 
      },
      error: (error) => { 
        this.mostrarMensagem('Erro ao excluir produto: ' + error.message, 'error'); 
      }
    });
  }

  public resetarFormulario(): void {
    this.produtoForm.reset({ status: true });
    this.isEditing = false;
    this.editingId = null;
  }

  private mostrarMensagem(mensagem: string, tipo: 'success' | 'error' | 'warning'): void {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: SNACKBAR_DURATION,
      horizontalPosition: SNACKBAR_POSITIONS.horizontal,
      verticalPosition: SNACKBAR_POSITIONS.vertical,
      panelClass: this.getPanelClass(tipo)
    });
  }

  private getPanelClass(tipo: 'success' | 'error' | 'warning'): string {
    switch (tipo) {
      case 'error': return 'error-snackbar';
      case 'warning': return 'warning-snackbar';
      default: return 'success-snackbar';
    }
  }
}

@Component({
  selector: 'app-confirmacao-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Confirmação</h2>
    <mat-dialog-content>{{ data.mensagem }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-button [color]="'warn'" [mat-dialog-close]="true">Confirmar</button>
    </mat-dialog-actions>
  `
})
export class ConfirmacaoDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmacaoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mensagem: string }
  ) {}
}
