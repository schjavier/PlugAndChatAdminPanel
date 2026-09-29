import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoomResponse } from '../../interfaces/room-response';
import { API_URL } from '../../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private readonly http = inject(HttpClient);

  getRooms(): Observable<RoomResponse[]> {
    return this.http.get<RoomResponse[]>(`${API_URL}/rooms`);
  }
}
