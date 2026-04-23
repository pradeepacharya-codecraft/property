import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-forms',
  imports: [ReactiveFormsModule],
  templateUrl: './forms.html',
  styleUrl: './forms.css',
})
export class Forms {
  formBuilder = inject(FormBuilder);
  name = new FormControl('');
  // profileForm = new FormGroup({
  //   firstName: new FormControl(''),
  //   lastName: new FormControl(''),
  //   address: new FormGroup({
  //     street: new FormControl(''),
  //     city: new FormControl(''),
  //     state: new FormControl(''),
  //     zip: new FormControl(''),
  //   }),
  // });

  profileForm = this.formBuilder.group({
    firstName: ['', Validators.required, Validators.minLength(6)],
    lastName: ['',],
    address: this.formBuilder.group({
      street: [''],
      city: [''],
      state: [''],
      zip: [''],
    }),
  });
  handleChange() {
    console.log(this.name.value);
  }
  updateName() {
    this.name.setValue('nancy');
  }

  onSubmit() {
    console.warn(this.profileForm.value);
  }
  updateForm() {
    this.profileForm.patchValue({ lastName: 'Acharya', address: { street: 'shirva' } });
  }
}
