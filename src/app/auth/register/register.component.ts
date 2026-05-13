import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { trigger, transition, style, animate, query, group } from '@angular/animations';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [
    trigger('stepAnimation', [
      transition(':increment', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            opacity: 0
          })
        ], { optional: true }),
        query(':enter', [
          style({ transform: 'translateX(100%)', opacity: 0 })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('300ms ease-out', style({ transform: 'translateX(-100%)', opacity: 0 }))
          ], { optional: true }),
          query(':enter', [
            animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
          ], { optional: true })
        ])
      ]),
      transition(':decrement', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            opacity: 0
          })
        ], { optional: true }),
        query(':enter', [
          style({ transform: 'translateX(-100%)', opacity: 0 })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('300ms ease-out', style({ transform: 'translateX(100%)', opacity: 0 }))
          ], { optional: true }),
          query(':enter', [
            animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
          ], { optional: true })
        ])
      ])
    ])
  ]
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  registerForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  currentStep = 1;
  totalSteps = 3;

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      identification: ['', [Validators.required, Validators.pattern('^[0-9]{10,13}$')]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      gender: ['MALE', [Validators.required]],
      age: [18, [Validators.required, Validators.min(18), Validators.max(120)]],
      status: [true],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  nextStep(): void {
    if (this.canGoNext()) {
      this.currentStep++;
    } else {
      this.markStepAsTouched();
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  canGoNext(): boolean {
    if (this.currentStep === 1) {
      return this.registerForm.get('name')!.valid &&
             this.registerForm.get('identification')!.valid &&
             this.registerForm.get('gender')!.valid &&
             this.registerForm.get('age')!.valid;
    }
    if (this.currentStep === 2) {
      return this.registerForm.get('email')!.valid &&
             this.registerForm.get('phone')!.valid &&
             this.registerForm.get('address')!.valid;
    }
    return true;
  }

  markStepAsTouched(): void {
    let fields: string[] = [];
    if (this.currentStep === 1) {
      fields = ['name', 'identification', 'gender', 'age'];
    } else if (this.currentStep === 2) {
      fields = ['email', 'phone', 'address'];
    } else if (this.currentStep === 3) {
      fields = ['password'];
    }

    fields.forEach(field => {
      this.registerForm.get(field)?.markAsTouched();
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.successMessage = 'Registro exitoso. Redirigiendo al login...';
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Error al crear la cuenta. Intente nuevamente.';
        this.isLoading = false;
      }
    });
  }
}
