import { Injectable, Inject } from '@angular/core';
import { BaseService } from './base-service.service';
import { IPartyService } from '../interfaces/party-service.interface';
import { Party } from '../../models/party.model';
import { IPartyRepository } from '../../repositories/interfaces/party-repository.interface';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PARTY_API_URL_TOKEN, PARTY_REPOSITORY_TOKEN, PEOPLE_API_URL_TOKEN } from '../../repositories/repository.tokens';  // Importa los tokens de las URLs
import { Like } from '../../models/like.model';

@Injectable({
  providedIn: 'root'
})
export class PartyService extends BaseService<Party> implements IPartyService {
  
  constructor(
    @Inject(PARTY_REPOSITORY_TOKEN) repository: IPartyRepository,
    private http: HttpClient,
    @Inject(PARTY_API_URL_TOKEN) private partyApiUrl: string,  // Inyecta el endpoint de las fiestas
    @Inject(PEOPLE_API_URL_TOKEN) private peopleApiUrl: string   // Inyecta el endpoint de las personas
  ) {
    super(repository);
  }
// En tu servicio de fiestas (party service)
toggleLike(partyId: string): Observable<boolean> {
  // Asume que tienes un endpoint específico para manejar likes
  return this.http.post<LikeResponse>(`${this.partyApiUrl}/parties/${partyId}/toggle-like`, {}).pipe(
    map(response => {
      // Devuelve si el like está activo o no
      return response.success;
    }),
    catchError(error => {
      // Manejo de errores
      console.error('Error al alternar like', error);
      // Relanza el error para que el componente pueda manejarlo
      return throwError(error);
    })
  );
}

  // Método para obtener las fiestas que le gustan al usuario
  getUserLikedParties(userId: string): Observable<string[]> {
    return this.http.get<any>(`${this.peopleApiUrl}/people/${userId}?populate=likes`).pipe(
      map(response => {
        // Now explicitly type the map function parameter
        const likeIds = response.data.attributes.likes.data.map((like: Like) => like.id.toString());
        return likeIds;
      })
    );
  }
}

// Interfaz para representar la respuesta del backend al dar/quitar like
interface LikeResponse {
  success: boolean;
}
  
