import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { UploadImageRespone } from '../models/upload.interface';

const API_URL = 'http://localhost:8000';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private http = inject(HttpClient);

  constructor() {}

  createImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('preset', 'task-manager');

    return this.http.post<UploadImageRespone>(`${API_URL}/api/upload`, formData);
  }

  updateImage(id: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('preset', 'task-manager');

    return this.http.put<UploadImageRespone>(`${API_URL}/api/upload/${id}`, formData);
  }

  deleteImage(id: string) {
    return this.http.delete<{ message: string }>(`${API_URL}/api/upload/${id}`, {
      body: { preset: 'task-manager' }
    });
  }
}
