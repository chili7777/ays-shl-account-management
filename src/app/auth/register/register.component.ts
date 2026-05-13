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
        style({ position: 'relative', overflow: 'hidden' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            opacity: 1
          })
        ], { optional: true }),
        query(':enter', [
          style({ left: '100%', opacity: 0 })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('400ms cubic-bezier(0.35, 0, 0.25, 1)', style({ left: '-100%', opacity: 0 }))
          ], { optional: true }),
          query(':enter', [
            animate('400ms cubic-bezier(0.35, 0, 0.25, 1)', style({ left: '0%', opacity: 1 }))
          ], { optional: true })
        ])
      ]),
      transition(':decrement', [
        style({ position: 'relative', overflow: 'hidden' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            opacity: 1
          })
        ], { optional: true }),
        query(':enter', [
          style({ left: '-100%', opacity: 0 })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('400ms cubic-bezier(0.35, 0, 0.25, 1)', style({ left: '100%', opacity: 0 }))
          ], { optional: true }),
          query(':enter', [
            animate('400ms cubic-bezier(0.35, 0, 0.25, 1)', style({ left: '0%', opacity: 1 }))
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
  currentStep = 1;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  fieldErrors: { [key: string]: string } = {};

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
      role: ['USER'],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Limpiar errores de servidor cuando el usuario modifique el campo
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.valueChanges.subscribe(() => {
        if (this.fieldErrors[key]) {
          delete this.fieldErrors[key];
          const control = this.registerForm.get(key);
          if (control?.hasError('serverError')) {
            control.setErrors(null);
            control.updateValueAndValidity({ emitEvent: false });
          }
        }
      });
    });
  }

  nextStep(): void {
    if (this.isStepValid()) {
      if (this.currentStep < 3) {
        this.currentStep++;
      }
    } else {
      this.markStepAsTouched();
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  isStepValid(): boolean {
    if (this.currentStep === 1) {
      return (
        (this.registerForm.get('name')?.valid ?? false) &&
        (this.registerForm.get('identification')?.valid ?? false) &&
        (this.registerForm.get('gender')?.valid ?? false) &&
        (this.registerForm.get('age')?.valid ?? false)
      );
    } else if (this.currentStep === 2) {
      return (
        (this.registerForm.get('email')?.valid ?? false) &&
        (this.registerForm.get('phone')?.valid ?? false) &&
        (this.registerForm.get('address')?.valid ?? false)
      );
    }
    return this.registerForm.valid;
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
    fields.forEach(field => this.registerForm.get(field)?.markAsTouched());
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.fieldErrors = {};

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.successMessage = 'Registro exitoso. Redirigiendo al login...';
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err: any) => {
        const errorData = err.error;
        this.errorMessage = errorData?.detail || 'Error al crear la cuenta. Intente nuevamente.';
        this.isLoading = false;

        if (errorData?.errors && Array.isArray(errorData.errors)) {
          errorData.errors.forEach((e: any) => {
            // El formato es "campo: descripción técnica"
            const parts = e.message.split(':');
            const field = parts[0].trim().toLowerCase();
            const message = e.businessMessage || parts[1]?.trim() || e.message;

            if (this.registerForm.contains(field)) {
              this.fieldErrors[field] = message;
              this.registerForm.get(field)?.setErrors({ serverError: true });
            }
          });
        }
      }
    });
  }
}
