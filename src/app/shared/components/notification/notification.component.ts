import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (notificationService.notification(); as n) {
      <div class="notification-container" [class]="n.type" @slideInOut>
        <div class="notification-content">
          <span class="material-icons">{{ getIcon(n.type) }}</span>
          <p>{{ n.message }}</p>
        </div>
        <button class="close-btn" (click)="notificationService.clear()">
          <span class="material-icons">close</span>
        </button>
      </div>
    }
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      min-width: 300px;
      max-width: 450px;
      padding: 16px;
      border-radius: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
      color: white;
    }

    .notification-content {
      display: flex;
      align-items: center;
      gap: 12px;

      p {
        margin: 0;
        font-size: 14px;
        font-weight: 500;
      }
    }

    .success { background-color: rgba(0, 192, 118, 0.9); }
    .error { background-color: rgba(212, 16, 32, 0.9); }
    .warning { background-color: rgba(255, 152, 0, 0.9); }
    .info { background-color: rgba(0, 92, 230, 0.9); }

    .close-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      opacity: 0.7;
      transition: opacity 0.2s;

      &:hover { opacity: 1; }
      .material-icons { font-size: 18px; }
    }
  `],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class NotificationComponent {
  notificationService = inject(NotificationService);

  getIcon(type: string): string {
    switch (type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      default: return 'info';
    }
  }
}
