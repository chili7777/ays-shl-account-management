import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MicrofrontendConfig } from "../../../microfrontend.config";

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
}
