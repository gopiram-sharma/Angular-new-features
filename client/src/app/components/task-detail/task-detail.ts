import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container mt-4" *ngIf="task()">
      <h2>Edit Task</h2>
      <form (ngSubmit)="save()">
        <div class="mb-3">
          <label class="form-label">Title</label>
          <input class="form-control" [(ngModel)]="task().title" name="title" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Description</label>
          <textarea class="form-control" [(ngModel)]="task().description" name="description"></textarea>
        </div>
        <div class="form-check mb-3">
          <input class="form-check-input" type="checkbox" [(ngModel)]="task().completed" name="completed" />
          <label class="form-check-label">Completed</label>
        </div>
        <button class="btn btn-success" type="submit">Save</button>
        <button class="btn btn-secondary ms-2" (click)="cancel()">Cancel</button>
      </form>
    </div>
  `
})
export class TaskDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskService);

  task = signal<Task>({ title: '', description: '', completed: false });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.taskService.getTask(id).subscribe(task => this.task.set(task));
  }

  save() {
    if (this.task()) {
      this.taskService.updateTask(this.task()!).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
