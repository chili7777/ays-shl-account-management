import { Component, Input, EventEmitter, Output } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  standalone: true,
  imports: [CommonModule],
})
export class HeaderComponent {
  @Input() username: string = "Usuario Genérico";
  @Output() toggleSidebar = new EventEmitter<void>();

  logoutAccount() {
    console.log("Cerrar sesión clickeado");
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
}
