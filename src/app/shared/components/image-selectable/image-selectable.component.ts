import { Component, Input, OnDestroy, OnInit, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

export const IMAGE_SELECTABLE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ImageSelectableComponent),
  multi: true
};

/**
 * Componente para seleccionar y gestionar imágenes
 * Implementa ControlValueAccessor para integrarse con formularios reactivos de Angular
 */
@Component({
  selector: 'app-image-selectable',
  templateUrl: './image-selectable.component.html',
  styleUrls: ['./image-selectable.component.scss'],
  providers:[IMAGE_SELECTABLE_VALUE_ACCESSOR]
})
export class ImageSelectableComponent  implements OnInit, ControlValueAccessor, OnDestroy {

  /** Subject que mantiene el valor actual de la imagen */
  private _image = new BehaviorSubject("");
  /** Observable público para la imagen seleccionada */
  public image$ = this._image.asObservable();
  /** Indica si el componente está deshabilitado */
  isDisabled:boolean = false;
  /** Indica si hay una imagen seleccionada */
  hasValue:boolean = false;
  constructor(
    private imageModal:ModalController
  ) { }

  /** Limpia los recursos al destruir el componente */
  ngOnDestroy(): void {
    this._image.complete();
  }

  ngOnInit() {}

  /** Función que propaga los cambios al formulario padre */
  propagateChange = (obj: any) => {
  }

  /**
   * Establece el valor del componente desde el formulario
   * @param obj Valor a establecer (URL de la imagen)
   */
  writeValue(obj: any): void {
    if(obj){
      this.hasValue = true;
      this._image.next(obj);
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  /**
   * Cambia la imagen actual y propaga el cambio
   * @param image Nueva URL de la imagen
   */
  changeImage(image:string){
    this.hasValue = image!='';
    this._image.next(image);
    this.propagateChange(image);
  }

  /**
   * Maneja el evento de cambio de imagen desde un input file
   * @param event Evento del DOM
   * @param fileLoader Elemento input file
   */
  onChangeImage(event:Event, fileLoader:HTMLInputElement){
    event.stopPropagation();
    fileLoader.onchange = ()=>{
      if(fileLoader.files && fileLoader.files?.length>0){
        var file = fileLoader.files[0];
        var reader = new FileReader();
        reader.onload = () => {
          this.changeImage(reader.result as string);
        };
        reader.onerror = (error) =>{
          console.log(error);
        }
        reader.readAsDataURL(file);
      }
    }
    fileLoader.click();
  }

  /**
   * Elimina la imagen actual
   * @param event Evento del DOM
   */
  onDeleteImage(event:Event){
    event.stopPropagation();
    this.changeImage('');
  }

  /** Cierra el modal de selección de imagen */
  close(){
    this.imageModal?.dismiss();
  }

}