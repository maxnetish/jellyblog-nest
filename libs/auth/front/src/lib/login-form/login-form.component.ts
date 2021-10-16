import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { IFormBuilder, IFormGroup } from '@rxweb/types';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

interface LoginFormModel {
  username: string;
  password: string;
}

@Component({
  selector: 'app-auth-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent implements OnInit {

  private fb: IFormBuilder;
  form: IFormGroup<LoginFormModel>;

  constructor(
    formBuilder: FormBuilder,
    private readonly modal: NgbActiveModal
  ) {
    this.fb = formBuilder;

    this.form = this.fb.group<LoginFormModel>({
      username: [null],
      password: [null]
    });
  }

  ngOnInit(): void {

  }

  cancelClick() {
    this.modal.dismiss('cancel');
  }

  submitForm() {
    this.modal.close(this.form.value);
  }

}
