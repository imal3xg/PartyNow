import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AlertController, AnimationController, InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable, combineLatest, lastValueFrom } from 'rxjs';
import { map, startWith } from 'rxjs/operators';  // Importar map para el filtro
import { Party } from 'src/app/core/models/party.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { Person } from 'src/app/core/models/person.model';
import { PartyService } from 'src/app/core/services/impl/party-service.service';
import { PeopleService } from 'src/app/core/services/impl/people-service.service';
import { Countries } from 'src/app/core/models/countries.enum';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  person?: Person | null;
  _party: BehaviorSubject<Party[]> = new BehaviorSubject<Party[]>([]); // Almacena las fiestas
  party$: Observable<Party[]> = this._party.asObservable(); // Observable de fiestas
  filteredParty$: Observable<Party[]>; // Observable para las fiestas filtradas
  likedParties: Set<string> = new Set(); // Conjunto local para almacenar las fiestas que le gustan al usuario
  totalParty: number = 0;
  hasMoreParty: boolean = true;
  hasMorePeople: boolean = true;
  // Para filtros
  searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>(''); // Filtro de búsqueda
  selectedCountry: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null); // Filtro de país
  countries: string[] = Object.values(Countries);

  constructor(
    private partySvc: PartyService,
    private authService: BaseAuthenticationService,
    private peopleService: PeopleService,
    private cdr:ChangeDetectorRef,
  ) {
    // Combinar filtros con la lista de fiestas
    this.filteredParty$ = combineLatest([
      this.party$, // Fuente de datos
      this.selectedCountry.pipe(startWith(null)), // Filtro de país
    ]).pipe(
      map(([parties, country]) => 
        parties.filter((party) => (!country || party.country === country)
        )
      )
    );
  
    // Actualizar el total dinámicamente después de cada cambio en los filtros
    this.filteredParty$.subscribe((parties) => {
      this.totalParty = parties.length;  // Actualiza el recuento con el resultado filtrado
    });
  }
  

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

  loadUserLikes() {
    if (this.person && this.person.id) {
      this.partySvc.getUserLikedParties(this.person.id).subscribe({
        next: (likedPartyIds) => {
          // Ahora likedPartyIds contiene los IDs de los likes
          this.likedParties = new Set(likedPartyIds);
          console.log('Likes del usuario:', this.likedParties);
        },
        error: (err) => {
          console.error('Error al obtener los likes:', err);
        }
      });
    } else {
      console.error('No se pudo cargar el ID del usuario');
    }
  }

  toggleLike(party: Party) {
    const isCurrentlyLiked = this.likedParties.has(party.id);
  
    // Llama al servicio para alternar el like
    this.partySvc.toggleLike(party.id).subscribe({
      next: (isLiked) => {
        // Actualiza el conjunto de likes local basado en la respuesta del backend
        if (isLiked) {
          this.likedParties.add(party.id);
        } else {
          this.likedParties.delete(party.id);
        }
        console.log(`Like actualizado para la fiesta ${party.id}. Ahora está ${isLiked ? 'gustando' : 'no gustando'}`);
      },
      error: (error) => {
        // En caso de error, revierte el cambio local
        console.error('Error al alternar like', error);
        if (isCurrentlyLiked) {
          this.likedParties.add(party.id);
        } else {
          this.likedParties.delete(party.id);
        }
      }
    });
  }
  
  isLiked(partyId: string): boolean {
    return this.likedParties.has(partyId); // Verifica si la fiesta está en el conjunto de "me gusta"
  }

  ionViewWillEnter() {
    // Forzamos la recarga de los datos al ingresar a la página
    this.refresh();
    this.loadUserLikes();
  }

  @ViewChildren('avatar') avatars!: QueryList<ElementRef>;
  @ViewChild('animatedAvatar') animatedAvatar!: ElementRef;
  @ViewChild('animatedAvatarContainer') animatedAvatarContainer!: ElementRef;

  selectedParty: any = null;
  isAnimating = false;
  page: number = 1;
  pageSize: number = 25;

  // Función para refrescar el listado de personas
  async refresh() {
    try {
      if (!this.person) return;
        // Obtener el usuario autenticado nuevamente
        const user = await this.authService.getCurrentUser();
        if (user) {
          // Volver a cargar la persona desde el servicio
          this.person = await lastValueFrom(this.peopleService.getByUserId(user.id));
          console.log('Perfil actualizado:', this.person);
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
          }
        );
      }
    } catch (error: any) {
      console.error('Error al refrescar los datos del perfil:', error.message || error);
    }
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

  onSaveParty(party: Party): void {
    // Lógica para guardar la fiesta
    console.log('Guardar fiesta:', party);
    // Aquí puedes llamar a un servicio o agregar lógica para marcar la fiesta como guardada
  }
  
  onShareParty(party: Party): void {
    // Verificar si la edad mínima es 0 y tratarla como nula
    const minAgeText = party.minAge === 0 ? 'No requerida' : party.minAge;
  
    // Crear un texto completo con todos los detalles de la fiesta
    const shareText = `
      🎉 ¡No te pierdas esta fiesta! 🎉
  
      **Nombre**: ${party.name}
      **Fecha**: ${party.date}
      **Lugar**: ${party.city}, ${party.country}
      **Edad Mínima**: ${minAgeText}
      **Precio**: ${party.price} €
      **Descripción**: ${party.description ?? 'Sin descripción'}
  
      Más detalles aquí: https://partynow.netlify.app
    `;
  
    // Verificar si Web Share API está disponible
    if (navigator.share) {
      navigator.share({
        title: `Fiesta: ${party.name}`,
        text: shareText,
      })
      .then(() => console.log('Fiesta compartida exitosamente'))
      .catch((error) => console.error('Error al compartir:', error));
    } else {
      alert('La función de compartir no está disponible en este dispositivo.');
    }
  }  

  // Función para manejar la carga infinita de fiestas
  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    this.getMoreParty(ev.target);
  }
}
