import { Component, Input, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MicrofrontendConfig } from "../../../microfrontend.config";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
})
export class FooterComponent {
  @Input() mfes: MicrofrontendConfig[] = [];
  now: Date = new Date();
  private authService = inject(AuthService);

  getQueryParams(mfe: MicrofrontendConfig) {
    const role = (this.authService.getUserRole() || 'USER').toString().toUpperCase();
    if (role !== 'ADMIN') {
      const clientId = this.authService.getClientId();
      if (mfe.routePath === 'accounts' || mfe.routePath === 'clients' || mfe.routePath === 'movements') {
        return { clientId: clientId };
      }
    }
    return {};
  }
}
