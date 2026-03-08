import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService, Notification } from '../../../../core/services/notification.service';

interface ToastNotification extends Notification {
  id: number;
  show: boolean;
}

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit, OnDestroy {
  notifications: ToastNotification[] = [];
  private subscription?: Subscription;
  private notificationId = 0;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.notification$.subscribe(
      (notification: Notification) => {
        this.addNotification(notification);
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private addNotification(notification: Notification): void {
    const toast: ToastNotification = {
      ...notification,
      id: this.notificationId++,
      show: true
    };

    this.notifications.push(toast);

    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
      this.removeNotification(toast.id);
    }, 5000);
  }

  removeNotification(id: number): void {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      this.notifications[index].show = false;
      // Esperar a que termine la animación antes de eliminar
      setTimeout(() => {
        this.notifications = this.notifications.filter(n => n.id !== id);
      }, 300);
    }
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return 'ℹ';
    }
  }
}
