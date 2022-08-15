import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/interfaces/cliente';
import { Filter } from 'src/app/interfaces/filter';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public qtdClientes: number = 0;
  public clientes: Cliente[] = [];
  public filter: Filter = {};

  private ativo: boolean = true;
  private inativo: boolean = true;

  constructor(private service: ClienteService) { }

  ngOnInit(): void {
    this.service.getAll().subscribe(data => this.updateList(data));
    setInterval(() => {
      if (((this.filter.nome && this.filter.nome.length > 1) || (this.filter.active != null && this.filter.active != undefined))) {
        this.service.filter(this.filter).subscribe(data => this.updateList(data));
      }else {
        this.service.getAll().subscribe(data => this.updateList(data));
      }
    }, 5000);
  }

  private updateList(newList: Cliente[]): void {
    this.clientes = newList;
    this.qtdClientes = this.clientes.length;
  }

  public deleteItem(id: number): void {
    this.service.delete(id).subscribe(() => {
      this.service.getAll().subscribe(data => this.updateList(data));
    });
  }

  public filterByName(event: KeyboardEvent) {
    this.filter.nome = (<HTMLInputElement>event.target).value;
    this.service.filter(this.filter).subscribe(data => this.updateList(data));
  }

  public filterByActive(active: boolean, inative: boolean): void {
    if(active && !inative) {
      this.filter.active = true;
    }else if(!active && inative) {
      this.filter.active = false;
    }else {
      this.filter.active = undefined;
    }
    this.service.filter(this.filter).subscribe(data => this.updateList(data));
  }

  public onChangeCheckBox(event: Event): void {
    const target = event.target as HTMLInputElement;
    const name = target.name;
    if (name == 'ativo') {
      this.ativo = target.checked;
    }else if(name == 'inativo') {
      this.inativo = target.checked;
    }
    this.filterByActive(this.ativo, this.inativo);
  }
}
