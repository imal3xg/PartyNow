import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AlertController, AnimationController, InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';  // Importar map para el filtro
import { PersonModalComponent } from 'src/app/components/person-modal/person-modal.component';
import { Party } from 'src/app/core/models/party.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { Person } from 'src/app/core/models/person.model';
import { PartyService } from 'src/app/core/services/impl/party-service.service';
import { PeopleService } from 'src/app/core/services/impl/people-service.service';
import { PartyModalComponent } from 'src/app/components/party-modal/party-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  _party: BehaviorSubject<Party[]> = new BehaviorSubject<Party[]>([]); // Almacena las fiestas
  party$: Observable<Party[]> = this._party.asObservable(); // Observable de fiestas
  filteredParty$: Observable<Party[]>;
  _people: BehaviorSubject<Person[]> = new BehaviorSubject<Person[]>([]); // Almacena las personas
  people$: Observable<Person[]> = this._people.asObservable(); // Observable de personas
  filteredPeople$: Observable<Person[]>;  // Observable para las personas filtradas
  totalParty: number = 0;
  hasMoreParty: boolean = true;
  hasMorePeople: boolean = true;

  constructor(
    private animationCtrl: AnimationController,
    private peopleSvc: PeopleService,
    private partySvc: PartyService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {
    // Inicializar el observable filtrado a todas las personas
    this.filteredPeople$ = this.people$;
    this.filteredParty$ = this.party$;
  }

  ngOnInit(): void {
    //this.getMorePeople();
    this.getMoreParty();
  }

  @ViewChildren('avatar') avatars!: QueryList<ElementRef>;
  @ViewChild('animatedAvatar') animatedAvatar!: ElementRef;
  @ViewChild('animatedAvatarContainer') animatedAvatarContainer!: ElementRef;

  selectedPerson: any = null;
  selectedParty: any = null;
  isAnimating = false;
  page: number = 1;
  pageSize: number = 25;

  // Función para refrescar el listado de personas
  refresh() {
    this.page = 1;
    this.hasMorePeople = true;
    this.hasMoreParty = true;

    this.partySvc.getAll(this.page, this.pageSize).subscribe({
      next: (response: Paginated<Party>) => {
        const party = response.data.map(party => ({
          ...party,
        }));
        this._party.next([...party]);
        this.totalParty = party.length;
        this.page++;
        if (response.data.length < this.pageSize) {
          this.hasMoreParty = false;
        }
      }
    });
  }

  getMoreParty(notify: HTMLIonInfiniteScrollElement | null = null) {
    if (!this.hasMoreParty) {
      notify?.complete();
      return;
    }
  
    this.partySvc.getAll(this.page, this.pageSize).subscribe({
      next: (response: Paginated<Party>) => {
        // Acceder a 'data' dentro de la respuesta Paginated<Party>
        const newParty = response.data; // `response.data` es el arreglo de fiestas
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
  

  // Función para filtrar personas por nombre o apellido
  onSearch(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredParty$ = this.party$.pipe(
      map((party) =>
        party.filter(
          (party) =>
            party.name.toLowerCase().includes(searchTerm)
        )
      )
    );
  }

  // Función para abrir el modal de detalles de la fiesta
  async openPartyDetail(party: any, index: number) {
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
  
    const modal = await this.modalCtrl.create({
      component: PartyModalComponent
    });
  
    // Cuando el modal se cierre, manejar el resultado
    modal.onDidDismiss().then((response: any) => {
      switch (response.role) {
        case 'new':
          // Si el rol es 'new', agregar la nueva fiesta
          this.partySvc.add(response.data).subscribe({
            next: () => {
              this.refresh(); // Refrescar la lista de fiestas
              this.totalParty++; // Aumentar el total de fiestas
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
              this.refresh(); // Refrescar la lista de fiesta
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
    await this.presentModalParty('new');
  }
}
