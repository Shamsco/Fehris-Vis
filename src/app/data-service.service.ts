import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { Identifiers } from '@angular/compiler';
@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  getNodesAndLinks() {
    return this.http.get<{id: string, group: number}>('/assets/miserables.json');
  }
  constructor(
    private http: HttpClient
    ) { }
}

class node {
  id: string;
  group: number;
}