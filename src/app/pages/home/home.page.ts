import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AlertController, AnimationController, InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable, combineLatest, lastValueFrom } from 'rxjs';
import { map, startWith } from 'rxjs/operators';  // Importar map para el filtro
import { Party } from 'src/app/core/models/party.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { PartyService } from 'src/app/core/services/impl/party-service.service';
import { Countries } from 'src/app/core/models/countries.enum';
import { TranslationService } from 'src/app/core/services/impl/translate.service';
import { TranslateService } from '@ngx-translate/core';

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
  // Para filtros
  searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>(''); // Filtro de búsqueda
  selectedCountry: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null); // Filtro de país
  countries: string[] = Object.values(Countries);

  constructor(
    private partySvc: PartyService,
    private translationService: TranslationService,
    private translate: TranslateService
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
  

  ngOnInit(): void {}

  ionViewWillEnter() {
    // Forzamos la recarga de los datos al ingresar a la página
    this.refresh(); // O this.getMoreParty();
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

  changeLanguage(lang: string) {
    this.translationService.setLanguage(lang);
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
  
  async onShareParty(party: Party): Promise<void> {
    // Obtener los textos traducidos
    const dontMissPartyText = await this.translate.get('DONT_MISS_PARTY').toPromise();
    const minAgeText = party.minAge === 0 
      ? await this.translate.get('NO_REQUIRED_AGE').toPromise() 
      : party.minAge;

    const nameText = await this.translate.get('NAME').toPromise();
    const dateText = await this.translate.get('DATE').toPromise();
    const placeText = await this.translate.get('PLACE').toPromise();
    const priceText = await this.translate.get('PRICE').toPromise();
    const descriptionText = await this.translate.get('DESCRIPTION').toPromise();
    const moreDetailsText = await this.translate.get('MORE_DETAILS').toPromise();
    const shareErrorText = await this.translate.get('SHARE_ERROR').toPromise();

    // Crear un texto completo con todos los detalles de la fiesta
    const shareText = `
      🎉 ${dontMissPartyText} 🎉

      **${nameText}**: ${party.name}
      **${dateText}**: ${party.date}
      **${placeText}**: ${party.city}, ${party.country}
      **${await this.translate.get('MIN_AGE').toPromise()}**: ${minAgeText}
      **${priceText}**: ${party.price} €
      **${descriptionText}**: ${party.description ?? 'Sin descripción'}

      ${moreDetailsText}: https://partynow.netlify.app
    `;

    // Verificar si Web Share API está disponible
    if (navigator.share) {
      navigator.share({
        title: `${nameText}: ${party.name}`,
        text: shareText,
      })
      .then(() => console.log('Fiesta compartida exitosamente'))
      .catch((error) => console.error('Error al compartir:', error));
    } else {
      alert(shareErrorText);
    }
  }

  // Función para manejar la carga infinita de fiestas
  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    this.getMoreParty(ev.target);
  }
}