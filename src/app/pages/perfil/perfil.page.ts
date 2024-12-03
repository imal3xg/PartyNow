import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AlertController, InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { Person } from 'src/app/core/models/person.model';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';
import { PeopleService } from 'src/app/core/services/impl/people-service.service';
import { PersonModalComponent } from 'src/app/components/person-modal/person-modal.component';
import { BehaviorSubject, combineLatest, lastValueFrom, map, Observable, startWith } from 'rxjs';
import { PartyModalComponent } from 'src/app/components/party-modal/party-modal.component';
import { Party } from 'src/app/core/models/party.model';
import { PartyService } from 'src/app/core/services/impl/party-service.service';
import { Paginated } from 'src/app/core/models/paginated.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  person?: Person | null;
  _party: BehaviorSubject<Party[]> = new BehaviorSubject<Party[]>([]); // Almacena las fiestas
  party$: Observable<Party[]> = this._party.asObservable(); // Observable de fiestas
  filteredParty$: Observable<Party[]>; // Observable para las fiestas filtradas
  totalParty: number = 0;
  hasMoreParty: boolean = true;
  hasMorePeople: boolean = true;

  // Para filtros
  searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>(''); // Filtro de búsqueda

  constructor(
    private authService: BaseAuthenticationService,
    private peopleService: PeopleService,
    private modalCtrl: ModalController,
    private cdr:ChangeDetectorRef,
    private partySvc: PartyService,
    private alertCtrl: AlertController
  ) {
    // Combinar filtros con la lista de fiestas
    this.filteredParty$ = combineLatest([
      this.party$, // Fuente de datos
      this.searchTerm.pipe(startWith('')) // Filtro de búsqueda
    ]).pipe(
      map(([parties, search]) => 
        parties.filter((party) =>
          party.name.toLowerCase().includes(search.toLowerCase()) // Filtrar por nombre (búsqueda)
        )
      )
    );
  
    // Actualizar el total dinámicamente después de cada cambio en los filtros
    this.filteredParty$.subscribe((parties) => {
      this.totalParty = parties.length;  // Actualiza el recuento con el resultado filtrado
    });
  }

  selectedPerson: any = null;
  selectedParty: any = null;
  isAnimating = false;
  page: number = 1;
  pageSize: number = 25;

  async ngOnInit() {
    this.refresh();
    try {
      const user = await this.authService.getCurrentUser();
      console.log('Usuario autenticado:', user);
  
      if (user) {
        this.person = await lastValueFrom(this.peopleService.getByUserId(user.id));
        this.cdr.detectChanges();
        console.log('Persona obtenida:', this.person);
        this.getMoreParty(); // Llamar después de cargar la persona
      }
    } catch (error: any) {
      console.error('Error al cargar el perfil:', error.message || error);
    }
  }  

  getMoreParty(notify: HTMLIonInfiniteScrollElement | null = null) {
    if (!this.hasMoreParty || !this.person) {
      notify?.complete();
      return;
    }
  
    // Filtrar por personId
    const filters = { personId: this.person.id }; // Añadir filtro para obtener fiestas de la persona
  
    this.partySvc.getAll(this.page, this.pageSize, filters).subscribe({
      next: (response: Paginated<Party>) => {
        const newParty = response.data;
        this._party.next([...this._party.value, ...newParty]);
        this.page++;
  
        if (newParty.length < this.pageSize) {
          this.hasMoreParty = false;
        }
  
        notify?.complete();
      },
      error: (err) => {
        console.error('Error obteniendo más fiestas:', err);
        alert(`Error obteniendo más fiestas: ${err.message || err}`);
        notify?.complete();
      }
    });
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

        // Filtrar por personId
        const filters = { personId: this.person!.id }; // Añadir filtro para obtener fiestas de la persona
        this.page = 1;
        this.hasMoreParty = true;
        this.partySvc.getAll(this.page, this.pageSize, filters).subscribe({
          next: (response: Paginated<Party>) => {
            const party = response.data.map(party => ({
              ...party
            }));
            this._party.next([...party]);
            this.page++;
            if (response.data.length < this.pageSize) {
              this.hasMoreParty = false;
            }
          }
        });
      }
    } catch (error: any) {
      console.error('Error al refrescar los datos del perfil:', error.message || error);
    }
  }  

  // Función para abrir el modal de detalles de la fiesta
  async openUpdateParty(party: any, index: number) {
    await this.presentModalParty('edit', party);
    this.selectedParty = party;
  }

  // Función para eliminar a una persona
  async onDeleteParty(party: Party) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que quieres eliminar la fiesta con nombre ${party.name}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.partySvc.delete(party.id).subscribe({
              next: () => {
                const updatedParty = this._party.value.filter((p) => p.id !== party.id);
                this._party.next(updatedParty);
                this.totalParty = updatedParty.length;
              },
              error: (err) => {
                console.error('Error eliminando fiesta:', err);
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  // Función para manejar la carga infinita de fiestas
  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    this.getMoreParty(ev.target);
  }

  // Función para presentar el modal de agregar o editar una persona
  private async presentModalParty(mode: 'new' | 'edit', party: Party | undefined = undefined) {
    // Obtener el personId (suponiendo que tienes un servicio para obtener el usuario actual)
    const user = await this.authService.getCurrentUser(); // Obtener el usuario autenticado
    if (!user) {
      console.error("No hay usuario autenticado.");
      return;
    }

    const modal = await this.modalCtrl.create({
      component: PartyModalComponent,
      componentProps: mode === 'edit' 
        ? { party: party, personId: this.person?.id }  // Pasar el personId si estamos en modo edición
        : { personId: this.person?.id } // Pasar el personId si estamos creando una nueva fiesta
      });

    // Cuando el modal se cierre, manejar el resultado
    modal.onDidDismiss().then((response: any) => {
      switch (response.role) {
        case 'new':
          // Si el rol es 'new', agregar la nueva fiesta
          this.partySvc.add(response.data).subscribe({
            next: () => {
              this.refresh(); // Refrescar la lista de fiestas
            },
            error: (err) => {
              console.error('Error al agregar fiesta', err);
            }
          });
          break;

        case 'edit':
          // Si el rol es 'edit', actualizar la fiesta
          this.partySvc.update(party!.id, response.data).subscribe({
            next: () => {
              this.refresh(); // Refrescar la lista de fiestas
            },
            error: (err) => {
              console.error('Error al actualizar fiesta', err);
            }
          });
          break;
        default:
          break;
      }
    });

    // Presentar el modal
    await modal.present();
  }

  // Función para agregar una nueva fiesta
  async onAddParty() {
    await this.presentModalParty('new'); // Ahora pasamos el personId al modal
  }
}