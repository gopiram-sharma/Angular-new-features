import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container mt-4">
      <h2>Task List</h2>

      <form class="mb-3" (ngSubmit)="addTask()">
        <div class="input-group">
          <input class="form-control" [(ngModel)]="newTask.title" name="title" placeholder="Title" required />
          <input class="form-control" [(ngModel)]="newTask.description" name="description" placeholder="Description" required />
          <button class="btn btn-primary" type="submit">Add</button>
        </div>
      </form>

      <ul class="list-group">
        <li *ngFor="let task of tasks()" class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <input type="checkbox" [(ngModel)]="task.completed" (change)="toggle(task)" class="form-check-input me-2" />
            <a [routerLink]="['/task', task._id]">{{ task.title }}</a>
            <br /><small class="text-muted">{{ task.description }}</small>
          </div>
          <button class="btn btn-danger btn-sm" (click)="remove(task._id!)">Delete</button>
        </li>
      </ul>
    </div>
  `
})
export class TaskListComponent {
  private taskService = inject(TaskService);
  tasks = this.taskService.tasks;

  newTask: Task = { title: '', description: '', completed: false };

  addTask() {
    this.taskService.createTask(this.newTask).subscribe(() => {
      this.newTask = { title: '', description: '', completed: false };
      this.taskService.fetchTasks();
    });
  }

  toggle(task: Task) {
    this.taskService.updateTask(task).subscribe();
  }

  remove(id: string) {
    this.taskService.deleteTask(id).subscribe(() => {
      this.taskService.fetchTasks();
    });
  }
}
