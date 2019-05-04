import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Task } from './../interfaces/task';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private api = 'http://localhost:9198';

  constructor(
    private http: HttpClient
  ) { }

  getAllTasks() {
    const path = `${this.api}/task/getTask`;
    return this.http.get<Task[]>(path);
  }

  getTask(id: string) {
    const path = `${this.api}/task/getTask${id}`;
    return this.http.get<Task>(path);
  }

  createTask(task: Task) {
    const path = `${this.api}/task/createTask`;
    return this.http.post<Task>(path, task);
  }

  updateTask(task: Task) {
    const path = `${this.api}/task/updateTask/${task.id}`;
    return this.http.put<Task>(path, task);
  }

  deleteTask(id: string) {
    const path = `${this.api}/task/deleteTask/${id}`;
    return this.http.delete(path);
  }
}
