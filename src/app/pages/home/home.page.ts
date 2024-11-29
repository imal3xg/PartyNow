import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AlertController, AnimationController, InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable, combineLatest, lastValueFrom } from 'rxjs';
import { map, startWith } from 'rxjs/operators';  // Importar map para el filtro
import { PersonModalComponent } from 'src/app/components/person-modal/person-modal.component';
import { Party } from 'src/app/core/models/party.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { Person } from 'src/app/core/models/person.model';
import { PartyService } from 'src/app/core/services/impl/party-service.service';
import { PeopleService } from 'src/app/core/services/impl/people-service.service';
import { PartyModalComponent } from 'src/app/components/party-modal/party-modal.component';
import { Countries } from 'src/app/core/models/countries.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  _party: BehaviorSubject<Party[]> = new BehaviorSubject<Party[]>([]); // Almacena las fiestas
  party$: Observable<Party[]> = this._party.asObservable(); // Observable de fiestas
  filteredParty$: Observable<Party[]>; // Observable para las fiestas filtradas
  totalParty: number = 0;
  hasMoreParty: boolean = true;
  hasMorePeople: boolean = true;
  // Para gestionar los detalles visibles de cada fiesta
  partyDetailsVisibility: { [key: string]: boolean } = {}; // Diccionario para almacenar el estado de visibilidad de cada fiesta
  
  // Para filtros
  searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>(''); // Filtro de búsqueda
  selectedCountry: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null); // Filtro de país
  countries: string[] = Object.values(Countries);

  constructor(
    private animationCtrl: AnimationController,
    private peopleSvc: PeopleService,
    private partySvc: PartyService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {
    // Combinar filtros con la lista de fiestas
    this.filteredParty$ = combineLatest([
      this.party$, // Fuente de datos
      this.searchTerm.pipe(startWith('')), // Filtro de búsqueda
      this.selectedCountry.pipe(startWith(null)), // Filtro de país
    ]).pipe(
      map(([parties, search, country]) => 
        parties.filter((party) =>
          party.name.toLowerCase().includes(search.toLowerCase()) && // Filtrar por nombre (búsqueda)
          (!country || party.country === country) // Filtrar por país si está seleccionado
        )
      )
    );
  
    // Actualizar el total dinámicamente después de cada cambio en los filtros
    this.filteredParty$.subscribe((parties) => {
      this.totalParty = parties.length;  // Actualiza el recuento con el resultado filtrado
    });
  }
  

  ngOnInit(): void {
    this.getMoreParty();
  }

  @ViewChildren('avatar') avatars!: QueryList<ElementRef>;
  @ViewChild('animatedAvatar') animatedAvatar!: ElementRef;
  @ViewChild('animatedAvatarContainer') animatedAvatarContainer!: ElementRef;

  selectedParty: any = null;
  isAnimating = false;
  page: number = 1;
  pageSize: number = 25;

  // Función para refrescar el listado de personas
  refresh() {
    this.page = 1;
    this.hasMoreParty = true;
    this.partySvc.getAll(this.page, this.pageSize).subscribe({
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

  // Función para manejar el cambio de país
  onCountryChange(event: any) {
    const country = event.target.value || null;
    if (country === 'all') {
      this.selectedCountry.next(null);
    } else {
      this.selectedCountry.next(country);
    }
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

  // Función para alternar la visibilidad de los detalles de la fiesta
  toggleDetails(party: Party): void {
    const partyId = party.id; // Usamos el ID de la fiesta para asegurar que la visibilidad sea única por fiesta
    this.partyDetailsVisibility[partyId] = !this.partyDetailsVisibility[partyId]; // Alternamos la visibilidad
  }

  // Función para verificar si los detalles de una fiesta están visibles
  isDetailsVisible(party: Party): boolean {
    return !!this.partyDetailsVisibility[party.id];
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
  
    const modal = await this.modalCtrl.create({
      component: PartyModalComponent,
      componentProps: mode === 'edit' ? { party: party } : {}
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
