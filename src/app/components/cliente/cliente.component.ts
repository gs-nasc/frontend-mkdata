import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from 'src/app/interfaces/cliente';
import { Telefone } from 'src/app/interfaces/telefone';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {

  public telefones: Telefone[] = [];
  public cliente: Cliente = {
    id: 0,
    nome: '',
    active: true,
    tipo: 'PF',
    document: '',
    ie: '',
    created_at: new Date()
  };

  constructor(private route: ActivatedRoute, private service: ClienteService, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.service.getById(+id).subscribe(cliente => {
          this.cliente = cliente[0];
          this.service.getTelefones(+id).subscribe(telefones => {
            this.telefones = telefones;
          });
        });
      }
    });
  }

  public addTelefone(): void {
    this.telefones.push({
      id: 0,
      area: '',
      number: ''
    });
  }

  public removeTelefone(index: number): void {
    const telefone = this.telefones[index];
    this.telefones.splice(index, 1);
    if(telefone.id!=0 && this.cliente.id != 0) {
      this.service.deleteTelefone(this.cliente.id, telefone.id).subscribe(() => {
        console.log("Telefone removido");
      });
    }
  }

  public onKeydown(event: Event): void {
    const elm = event.target;

    if (elm instanceof HTMLInputElement) {
      const input = elm as HTMLInputElement;
      let value = input.value;
      const name = input.name;

      switch (name) {
        case "nome":
          this.cliente.nome = value;
          break;
        case "document":
          if(value.length > 14) {
            this.cliente.tipo = 'PJ';
            value = this.formatCNPJ(value);
          }else {
            this.cliente.tipo = 'PF';
            value = this.cliente.document = this.formatCPF(value);
          }

          this.cliente.document = value;
          break;
        case "ie":
          this.cliente.ie = value;
          break;
      }
    } else if (elm instanceof HTMLSelectElement) {
      const select = elm as HTMLSelectElement;
      const value = select.value;
      const name = select.name;

      switch (name) {
        case "tipo":
          this.cliente.tipo = value as "PF" | "PJ";
          break;
        case "active":
          this.cliente.active = value === "ativo";
          break;
      }
    }
  }

  public onKeyDownTelefone(event: KeyboardEvent, index: number): void {
    const elm = event.target;

    console.log(this.telefones);

    if (elm instanceof HTMLInputElement) {
      const input = elm as HTMLInputElement;
      const value = input.value;
      const name = input.name;

      switch (name) {
        case "area":
          this.telefones[index].area = value;
          break;
        case "number":
          this.telefones[index].number = value;
          break;
      }
    }
  }

  public save(): void {
    this.cliente.document = this.cliente.document.replace(/\D/g, '');
    if(this.cliente.id != 0) {
      console.log(this.cliente);
      this.service.update(this.cliente).subscribe(() => {
        this.telefones.map(telefone => {
          if(telefone.id == 0) {
            this.service.createTelefone(this.cliente.id, telefone).subscribe(() => {
            });
          } else {
            this.service.updateTelefone(this.cliente.id, telefone).subscribe(() => {
            });
          }
        })
        this.router.navigate(['/']);
      });
    }else {
      this.service.create(this.cliente).subscribe(cliente => {
        this.cliente = cliente;
        this.telefones.forEach(telefone => {
          this.service.createTelefone(this.cliente.id, telefone).subscribe(telefone => {});
        });
        this.router.navigate(['/']);
      }, error => {
        if(error.error.document) {
          alert(error.error.document);
        }else {
          alert(error.error);
        }
      });
    }
  }

  private formatCPF(cpf: string): string {
    return cpf.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
  }

  private formatCNPJ(cnpj: string): string {
    return cnpj.replace(/\D/g, '').replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '$1.$2.$3/$4-$5');
  }

}
