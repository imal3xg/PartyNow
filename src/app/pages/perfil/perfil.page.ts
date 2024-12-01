import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
    private modalCtrl: ModalController,
    private cdr:ChangeDetectorRef
  ) {}

  selectedPerson: any = null;

  async ngOnInit() {
    this.refresh();
    try {
      const user = await this.authService.getCurrentUser();
      console.log('Usuario autenticado:', user);
  
      if (user) {
        this.person = await lastValueFrom(this.peopleService.getByUserId(user.id));
        this.cdr.detectChanges();
        console.log('Persona obtenida:', this.person);
      }
    } catch (error: any) {
      console.error('Error al cargar el perfil:', error.message || error);
    }
  }

  // Función para abrir el modal de detalles de la persona
  async openPersonDetail(person: Person) {
    await this.presentModalPerson('edit', person);
    this.selectedPerson = person;
  }

  // Función para presentar el modal de agregar o editar una persona
  private async presentModalPerson(mode:'edit', person: Person | undefined = undefined) {
    // Crear el modal con los grupos incluidos en las propiedades del componente
    const modal = await this.modalCtrl.create({
      component: PersonModalComponent,
      componentProps: mode === 'edit' ? { person: person } : {}
    });
  
    // Cuando el modal se cierre, manejar el resultado
    modal.onDidDismiss().then((response: any) => {
      switch (response.role) {
        case 'edit':
          // Si el rol es 'edit', actualizar la persona
          this.peopleService.update(person!.id, response.data).subscribe({
            next: () => {
              this.refresh(); // Refrescar los datos del perfil
            },
            error: (err) => {
              console.error('Error al actualizar persona', err);
            },
          });
          break;
        default:
          break;
      }
    });
    // Presentar el modal
    await modal.present();
  }

  // Función para refrescar los datos del perfil y lista de personas
  async refresh() {
    try {
      if (!this.person) return;

      // Obtener el usuario autenticado nuevamente
      const user = await this.authService.getCurrentUser();
      if (user) {
        // Volver a cargar la persona desde el servicio
        this.person = await lastValueFrom(this.peopleService.getByUserId(user.id));
        console.log('Perfil actualizado:', this.person);
      }
    } catch (error: any) {
      console.error('Error al refrescar los datos del perfil:', error.message || error);
    }
  }  
}