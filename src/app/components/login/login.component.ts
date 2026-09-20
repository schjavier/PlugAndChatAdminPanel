import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loginForm = this.fb.group({
    tenantName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { tenantName, email, password } = this.loginForm.value;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(tenantName!, email!, password!).subscribe({
      next: () => {
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 404) {
          this.errorMessage.set(`El inquilino "${tenantName}" no está registrado.`);
        } else if (err.status === 401 || err.status === 403) {
          this.errorMessage.set('Credenciales incorrectas para este inquilino.');
        } else {
          this.errorMessage.set('Error al conectar con el servidor.');
        }
      },
    });
  }
}
