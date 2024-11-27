import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Person } from 'src/app/core/models/person.model';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';
import { PeopleService } from 'src/app/core/services/impl/people-service.service';
import { PersonModalComponent } from 'src/app/components/person-modal/person-modal.component';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  person?: Person | null;

  constructor(
    private authService: BaseAuthenticationService,
    private peopleService: PeopleService,
    private modalCtrl: ModalController
  ) {}

  async ngOnInit() {
    try {
      const user = await this.authService.getCurrentUser();
      console.log('Usuario autenticado:', user);
  
      if (user) {
        this.person = await lastValueFrom(this.peopleService.getByUserId(user.id));
        console.log('Persona obtenida:', this.person);
      }
    } catch (error: any) {
      console.error('Error al cargar el perfil:', error.message || error);
    }
  }

  // Abrir modal para editar el perfil
  async openEditProfile() {
    if (!this.person) return;

    const modal = await this.modalCtrl.create({
      component: PersonModalComponent,
      componentProps: {
        person: this.person, // Pasar la persona al modal
      },
    });

    const { data, role } = await modal.onDidDismiss();
    if (role === 'updated' && data) {
      // Actualizar los datos del perfil tras la edición
      this.person = data;
    }
  }
}
