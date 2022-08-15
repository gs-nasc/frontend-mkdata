import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../interfaces/cliente';
import { Filter } from '../interfaces/filter';
import { Telefone } from '../interfaces/telefone';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  readonly apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = 'https://mkdatapi.herokuapp.com/clientes';
  }

  getAll(): Observable<Cliente[]> {
      return this.http.get(this.apiUrl) as Observable<Cliente[]>;
  }

  getById(id: number): Observable<Cliente[]> {
    return this.http.get(this.apiUrl + '/' + id) as Observable<Cliente[]>;
  }

  filter(filter: Filter): Observable<Cliente[]> {
    let query = '';
    if(filter.active != null && filter.active !== undefined) {
      query += 'active=' + filter.active;
    }
    if(filter.nome) {
      if(query) {
        query += '&';
      }
      query += 'name=' + filter.nome;
    }

    return this.http.get(this.apiUrl + '?' + query) as Observable<Cliente[]>;
  }

  create(cliente: Cliente): Observable<Cliente> {
    console.log(cliente);
    return this.http.post(this.apiUrl, cliente) as Observable<Cliente>;
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.apiUrl + '/' + cliente.id, cliente) as Observable<Cliente>;
  }

  delete(id: number) {
    return this.http.delete(this.apiUrl + '/' + id);
  }

  getTelefones(id: number): Observable<Telefone[]> {
    return this.http.get(this.apiUrl + '/' + id + '/telefone') as Observable<Telefone[]>;
  }

  createTelefone(id: number, telefone: Telefone): Observable<Telefone[]> {
    return this.http.post(this.apiUrl + '/' + id + '/telefone', telefone) as Observable<Telefone[]>;
  }

  updateTelefone(id: number, telefone: Telefone): Observable<Telefone[]> {
    return this.http.post(this.apiUrl + '/' + id + '/telefone/' + telefone.id, telefone) as Observable<Telefone[]>;
  }

  deleteTelefone(id: number, telefoneId: number) {
    return this.http.delete(this.apiUrl + '/' + id + '/telefone/' + telefoneId);
  }

  getTelefoneById(id: number, telefoneId: number): Observable<Telefone[]> {
    return this.http.get(this.apiUrl + '/' + id + '/telefone/' + telefoneId) as Observable<Telefone[]>;
  }
}
