import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth.service';
import { RoomService } from '../../services/room-service/room.service';
import { AgentService } from '../../services/agent-service/agent.service';
import { RoomResponse } from '../../interfaces/room-response';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  readonly authService = inject(AuthService);
  private readonly roomService = inject(RoomService);
  private readonly agentService = inject(AgentService);

  // Estado de salas cargadas de la API REST
  readonly rooms = signal<RoomResponse[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  // Computados reactivos basados en las salas reales
  readonly activeRoomsCount = computed(() =>
      this.rooms().filter(r => r.status === 'WAITING' || r.status === 'ACTIVE').length
  );
  readonly openRoomsCount = computed(() =>
    this.rooms().filter(r => r.status === 'WAITING').length
  );
  readonly assignedRoomsCount = computed(() =>
    this.rooms().filter(r => r.status === 'ACTIVE').length
  );

  // Valores reales y auxiliares
  readonly onlineAgentsCount = signal<number>(0);
  readonly avgResponseTime = signal('1.4 min');

  ngOnInit(): void {
    this.loadRooms();
    this.loadActiveAgents();
  }

  loadRooms(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.roomService.getRooms().subscribe({
      next: (data) => {
        this.rooms.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Error al cargar las salas de chat.');
        console.error('Error al obtener salas:', err);
      },
    });
  }

  loadActiveAgents(): void {
    this.agentService.getActiveAgentsCount().subscribe({
      next: (count) => {
        this.onlineAgentsCount.set(count);
      },
      error: (err) => {
        console.error('Error al obtener agentes activos:', err);
      },
    });
  }
}
