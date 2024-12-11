import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';
import { TranslationService } from 'src/app/core/services/impl/translate.service';

@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.page.html',
  styleUrls: ['./frontpage.page.scss'],
})
export class FrontpagePage implements OnInit {

  // Observable para verificar si el usuario está autenticado
  isAuthenticated$: Observable<boolean>;

  constructor(
    private navCtrl: NavController,
    private authSvc: BaseAuthenticationService,
    private translationService: TranslationService
  ) {
    // Se obtiene el observable de autenticación
    this.isAuthenticated$ = this.authSvc.authenticated$;
  }

  // Navega a la página de login
  navigateToLogin() {
    const isAuthenticated = this.authSvc.isLoggedIn(); // Verifica si el usuario está logeado

    if (isAuthenticated) {
      // Redirigir a 'home' si está autenticado
      this.navCtrl.navigateRoot('/home');
    } else {
      // Redirigir a 'login' si no está autenticado
      this.navCtrl.navigateForward('/login');
    }
  }

  changeLanguage(lang: string) {
    this.translationService.setLanguage(lang);
  }

  // Navega a la página de registro
  navigateToRegister() {
    this.navCtrl.navigateForward('/register');
  }

  // Función para desplazarse hacia abajo
  goDown() {
    const aboutSection = document.getElementById('about-me');
    if (aboutSection) {
      aboutSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }

  ngOnInit() {
  }
}
