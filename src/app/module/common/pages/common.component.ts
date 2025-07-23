import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { NavigationComponent } from "../components/navigation/navigation.component";
import { FooterComponent } from "../components/footer/footer.component";
import { NavigationEnd, Router, RouterModule } from "@angular/router";

@Component({
    selector:"app-common",
    templateUrl:"./common.component.html",
    standalone:true,
    imports: [CommonModule,NavigationComponent,FooterComponent,RouterModule]
})
export class CommonComponent {
     constructor(private readonly router: Router,
         @Inject(PLATFORM_ID) private platformId: Object
      ) {
       router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          if (isPlatformBrowser(this.platformId)) {
            window.scrollTo(0, 0);
          }
        }
        
      });
      }
public scrollToSections(sectionId: string) {
  const el = document.getElementById(sectionId);
  if (el) {
    const yOffset = -120; // Negative offset to adjust for fixed navbar height
    const y = el.getBoundingClientRect().top + window.pageYOffset - yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}
}