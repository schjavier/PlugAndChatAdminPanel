import { computed, inject, Service, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { TenantResponse } from '../../interfaces/tenant-response';
import { API_URL } from '../../config/api.config';
import { LoginAdminResponse } from '../../interfaces/login-admin-response';
import { AuthenticatedUser } from '../../interfaces/authenticated-user';

@Service()
export class AuthService {
  private httpClient = inject(HttpClient);

  readonly currentUser = signal<String | null>(null);
  readonly tenantId = signal<String | null>(localStorage.getItem('admin_tenant_id'));
  readonly tenantName = signal<String | null>(localStorage.getItem('admin_tenant_name'));

  readonly isInitializing = signal<boolean>(true);
  readonly isAuthenticated = computed(() => !!this.currentUser());

  lookupTenant(name: string): Observable<TenantResponse> {
    return this.httpClient.get<TenantResponse>(`${API_URL}/tenant/lookup`, {
      params: { name },
    });
  }

  login(tenantName: string, email: string, password: string): Observable<LoginAdminResponse> {
    return this.lookupTenant(tenantName).pipe(
      switchMap((tenant) => {
        const headers = new HttpHeaders({ 'X-Tenant-ID': tenant.uuid });

        return this.httpClient
          .post<LoginAdminResponse>(`${API_URL}/login/admin`, { email, password }, { headers })
          .pipe(
            tap((res) => {
              localStorage.setItem('admin_tenant_id', tenant.uuid);
              localStorage.setItem('admin_tenant_name', tenant.name);

              this.currentUser.set(res.email);
              this.tenantId.set(tenant.uuid);
              this.tenantName.set(tenant.name);
            }),
          );
      }),
    );
  }

  checkSession(): Observable<AuthenticatedUser | null> {
    this.isInitializing.set(true);
    return this.httpClient.get<AuthenticatedUser>(`${API_URL}/auth/me`).pipe(
      tap((user) => {
        this.currentUser.set(user.email);
        this.isInitializing.set(false);
      }),
      catchError(() => {
        this.logoutLocal();
        this.isInitializing.set(false);
        return of(null);
      }),
    );
  }

  logout(): Observable<void> {
    return this.httpClient.post<void>(`${API_URL}/logout`, {}).pipe(
      tap(() => this.logoutLocal()),
      catchError((err) => {
        this.logoutLocal(); // Asegura limpieza en caso de fallos de red
        throw err;
      }),
    );
  }

  private logoutLocal(): void {
    localStorage.removeItem('admin_tenant_id');
    localStorage.removeItem('admin_tenant_name');
    this.currentUser.set(null);
    this.tenantId.set(null);
    this.tenantName.set(null);
  }
}
