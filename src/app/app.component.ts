import { Component } from '@angular/core';
import { BaseAuthenticationService } from './core/services/impl/base-authentication.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { TranslationService } from './core/services/impl/translate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  selectedFlag: string = ''; // Bandera inicial, por defecto inglés

  constructor(
    public authSvc: BaseAuthenticationService,
    private router: Router,
    private menuCtrl: MenuController,
    private translate: TranslationService
  ) {}

  changeLanguage(lang: string) {
    this.selectedFlag = lang; // Actualiza la bandera seleccionada
    this.translate.setLanguage(lang); // Cambia el idioma en el servicio de traducción
  }

  closeMenu() {
    this.menuCtrl.close();
  }

  logout() {
    this.authSvc.signOut().subscribe(() => {
      this.router.navigate(['/frontpage']);
    });
  }
}
