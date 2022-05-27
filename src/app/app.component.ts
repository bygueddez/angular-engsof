import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Item } from "./item";
import { ItemComponent } from './item/item.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'todo';
  constructor(private http: HttpClient) {
    this.letodosRegistros();
  }

  logado = false;
  tokenJWT = '{ "token":""}';

  filter: 'all' | 'active' | 'done' = 'all';

  /*
  allItems = [
    { description: 'eat', done: true },
    { description: 'sleep', done: false },
    { description: 'play', done: false },
    { description: 'laugh', done: false },
  ];
  */

  allItems: any[] = [];

  letodosRegistros() {
    const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
    this.http.get<Item[]>(`/api/getAll`, { 'headers': idToken }).subscribe(
      (resultado) => { this.allItems = resultado;this.logado=true },
      (error) => { this.logado = false }
    )
  }

  get items() {
    if (this.filter === 'all') {
      return this.allItems;
    }
    return this.allItems.filter(item => this.filter === 'done' ? item.done : !item.done);
  }
  addItem(description: string) {
    /*this.allItems.unshift({
      description,
      done: false
    });
    */
    var produto = new Item();
    produto.description = description;
    produto.done = false;
    const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
    this.http.post<Item>(`/api/post`, produto, { 'headers': idToken }).subscribe(
      resultado => { console.log(resultado); this.letodosRegistros() },
      (error) => { this.logado = false }
    )
  }
  updateItem(item) {
    var indice = this.allItems.indexOf(item);
    var id = this.allItems[indice]._id;
    const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
    this.http.patch<Item>(`/api/update/${id}`, item,{ 'headers': idToken }).subscribe(
      resultado => { console.log(resultado); this.letodosRegistros() },
      (error) => { this.logado = false }
    )
  }
  remove(item) {
    //this.allItems.splice(this.allItems.indexOf(item), 1);
    var indice = this.allItems.indexOf(item);
    var id = this.allItems[indice]._id;
    const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
    this.http.delete<Item>(`/api/delete/${id}`,{ 'headers': idToken }).subscribe(
      resultado => { console.log(resultado); this.letodosRegistros() },
      (error) => { this.logado = false }
    )
  }
  removeAllDone() {
    for (let index = this.allItems.length - 1; index >= 0; index--) {
      const element = this.allItems[index];
      if (element.done == true) {
        this.remove(element);
      }
    }
  }
  login(username: string, password: string) {
    var credenciais = { "nome": username, "senha": password }
    this.http.post(`/api/login`, credenciais).subscribe(resultado => { this.tokenJWT = JSON.stringify(resultado); this.letodosRegistros(); });

  }
}