import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Countries } from 'src/app/core/models/countries.enum';
import { Party } from 'src/app/core/models/party.model';
import { TranslationService } from 'src/app/core/services/impl/translate.service';

@Component({
  selector: 'app-party-modal',
  templateUrl: './party-modal.component.html',
  styleUrls: ['./party-modal.component.scss'],
})

export class PartyModalComponent implements OnInit {
  formGroup: FormGroup;
  mode: 'new' | 'edit' = 'new';
  countries: string[] = Object.values(Countries);

  @Input() personId: string = '';  // Recibimos el personId de la persona autenticada

  @Input() set party(_party: Party) {
    if (_party && _party.id) this.mode = 'edit';

    this.formGroup.controls['name'].setValue(_party.name);
    this.formGroup.controls['minAge'].setValue(_party.minAge);
    this.formGroup.controls['country'].setValue(_party.country);
    this.formGroup.controls['city'].setValue(_party.city);
    this.formGroup.controls['date'].setValue(_party.date);
    this.formGroup.controls['price'].setValue(_party.price);
    this.formGroup.controls['description'].setValue(_party.description);
  }

  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private modalCtrl: ModalController,
    private translate: TranslateService) {
    this.formGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      country: ['', Validators.required],
      city: ['', Validators.required],
      date: ['', Validators.required],
      minAge: [0, [Validators.required, Validators.min(0), this.integerValidator]],  // Added 'required' validator
      price: [0, [Validators.required, Validators.min(0)]],  // Added 'required' validator
      description: [''],
    });    
  }

  ngOnInit() {}
  // Getters for form controls
  get name() {
    return this.formGroup.controls['name'];
  }

  get minAge() {
    return this.formGroup.controls['minAge'];
  }

  get country() {
    return this.formGroup.controls['country'];
  }

  get city() {
    return this.formGroup.controls['city'];
  }

  get date() {
    return this.formGroup.controls['date'];
  }

  get price() {
    return this.formGroup.controls['price'];
  }

  get description() {
    return this.formGroup.controls['description'];
  }

  getDirtyValues(formGroup: FormGroup): any {
    const dirtyValues: any = {};
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control?.dirty) {
        dirtyValues[key] = control.value;
      }
    });
    return dirtyValues;
  }
  
  integerValidator(control: AbstractControl) {
    const value = control.value;
    if (value && !Number.isInteger(value)) {
      return { notInteger: true };
    }
    return null;
  }

  onCancel() {
    // Verifica si el formulario tiene campos modificados (sucios)
    if (this.formGroup.dirty) {
      // Si hay cambios, muestra un mensaje de confirmación
      this.showConfirmExitAlert();
    } else {
      // Si no hay cambios, cierra el modal sin preguntar
      this.modalCtrl.dismiss();
    }
  }

  // Función para mostrar el alert de confirmación
  async showConfirmExitAlert() {
    // Traducir los textos antes de mostrarlos
    const headerText = await this.translate.get('CONFIRM_EXIT_HEADER').toPromise();
    const messageText = await this.translate.get('CONFIRM_EXIT_MESSAGE').toPromise();
    const cancelButtonText = await this.translate.get('CANCEL').toPromise();
    const exitButtonText = await this.translate.get('EXIT').toPromise();

    const alert = await this.alertController.create({
      header: headerText, // Título traducido
      message: messageText, // Mensaje traducido
      buttons: [
        {
          text: cancelButtonText, // Botón de cancelar traducido
          role: 'cancel',
          handler: () => {
            console.log('Cancelado');
          },
        },
        {
          text: exitButtonText, // Botón de salir traducido
          handler: () => {
            // Si el usuario confirma, cierra el modal
            this.modalCtrl.dismiss();
          },
        },
      ],
    });

    await alert.present();
  }

  closeModal() {
    this.modalCtrl.dismiss(); // Cierra el modal actual.
  }

  onSubmit() {
    if (this.formGroup.valid) {
      if (!this.personId) {
        console.error("El personId no está definido.");
        return;
      }
  
      // Asegurar valores predeterminados
      const formValue = this.formGroup.value;
      formValue.minAge = this.ensureNonEmpty(formValue.minAge);
      formValue.price = this.ensureNonEmpty(formValue.price);
  
      const partyToSave: Party = {
        ...formValue,
        personId: this.personId, // Asociar el personId con la fiesta
      };
  
      this.modalCtrl.dismiss(
        this.mode === 'new' ? partyToSave : this.getDirtyValues(this.formGroup),
        this.mode
      );
    } else {
      console.log('Formulario inválido');
    }
  }
  
  ensureNonEmpty(value: any): number {
    return value === null || value === undefined || value === '' ? 0 : value;
  }
}
