import { Component, inject, EventEmitter, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
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

  username: string = this.authService.getClientId() || "Usuario";
  @Output() toggleSidebar = new EventEmitter<void>();

  logoutAccount() {
    this.authService.logout();
    window.location.reload();
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
}
