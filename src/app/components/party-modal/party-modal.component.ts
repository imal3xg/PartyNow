import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  @Input() set party(_party: Party) {
    if (_party && _party.id) this.mode = 'edit';

    this.formGroup.controls['name'].setValue(_party.name);
    this.formGroup.controls['minAge'].setValue(_party.minAge);
    this.formGroup.controls['country'].setValue(_party.country); // Set birthdate
    this.formGroup.controls['date'].setValue(_party.date);
  }

  constructor(private fb: FormBuilder, private modalCtrl: ModalController) {
    this.formGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      minAge: ['', [Validators.required]],
      country: ['', [Validators.required]],
      date: ['', [Validators.required]],
    });
  }

  ngOnInit() {}

  get name() {
    return this.formGroup.controls['name'];
  }

  get minAge() {
    return this.formGroup.controls['minAge'];
  }

  get country() {
    return this.formGroup.controls['country'];
  }

  get date() {
    return this.formGroup.controls['date'];
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

  onSubmit() {
    if (this.formGroup.valid) {
      this.modalCtrl.dismiss(
        this.mode == 'new' ? this.formGroup.value : this.getDirtyValues(this.formGroup),
        this.mode
      );
    } else {
      console.log('Formulario inválido');
    }
  }
}
