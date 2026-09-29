import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  private readonly http = inject(HttpClient);

  getActiveAgentsCount(): Observable<number> {
    return this.http.get<number>(`${API_URL}/agents/active`);
  }
}
