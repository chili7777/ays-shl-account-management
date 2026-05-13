import { Component, inject, EventEmitter, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  standalone: true,
  imports: [CommonModule],
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  username: string = this.authService.getUserName() || "Usuario";
  userRole: string = this.authService.userRole() || "USER";
  @Output() toggleSidebar = new EventEmitter<void>();

  goToProfile() {
    this.router.navigate(['/clients']);
  }

  logoutAccount() {
    this.authService.logout();
    window.location.reload();
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
}
