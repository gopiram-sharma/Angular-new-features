import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api/tasks';

  tasks = signal<Task[]>([]);

  constructor() {
    this.fetchTasks();
  }

  fetchTasks() {
    this.http.get<Task[]>(this.baseUrl).subscribe((data) => {
      this.tasks.set(data);
    });
  }

  getTask(id: string) {
    return this.http.get<Task>(`${this.baseUrl}/${id}`);
  }

  createTask(task: Task) {
    return this.http.post<Task>(this.baseUrl, task);
  }

  updateTask(task: Task) {
    return this.http.put<Task>(`${this.baseUrl}/${task._id}`, task);
  }

  deleteTask(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
