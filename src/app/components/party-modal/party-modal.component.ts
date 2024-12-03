import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Countries } from 'src/app/core/models/countries.enum';
import { Party } from 'src/app/core/models/party.model';

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

  constructor(private fb: FormBuilder, private modalCtrl: ModalController) {
    this.formGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      country: ['', Validators.required],
      city: ['', Validators.required],
      date: ['', Validators.required],
      minAge: [0, [Validators.min(0), this.integerValidator]],
      price: [0, [Validators.min(0)]],
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

  onSubmit() {
    if (this.formGroup.valid) {
      if (!this.personId) {
        console.error("El personId no está definido.");
        return;
      }
      
      const formValue = this.formGroup.value;
      const partyToSave: Party = {
        ...formValue,
        personId: this.personId,  // Asociamos el personId con la fiesta
      };
      
      this.modalCtrl.dismiss(
        this.mode === 'new' ? partyToSave : this.getDirtyValues(this.formGroup),
        this.mode
      );      
    } else {
      console.log('Formulario inválido');
    }
  }
}
