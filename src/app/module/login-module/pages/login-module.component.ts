import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
    selector: 'app-login-module',
    templateUrl: './login-module.component.html',
    standalone:true,
    imports: [CommonModule, RouterOutlet]
})
export class LoginModuleComponent {
    // This component can be used to handle login-related functionality
    // such as displaying a login form, handling user input, etc.
}