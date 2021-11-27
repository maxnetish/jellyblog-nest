import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IFormBuilder, IFormGroup } from '@rxweb/types';
import { FormBuilder, Validators } from '@angular/forms';
import { UserRole } from '@jellyblog-nest/utils/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@jellyblog-nest/auth/front';

interface CreateUserFormModel {
  username: string;
  role: UserRole;
  password: string;
}

@Component({
  selector: 'app-users-user-edit',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class UserCreateComponent implements OnInit {

  form: IFormGroup<CreateUserFormModel>;
  formBuilder: IFormBuilder;
  availableRoles: {code: UserRole }[] = [
    {
      code: UserRole.ADMIN,
    },
    {
      code: UserRole.READER,
    },
  ];

  constructor(
    private readonly modal: NgbActiveModal,
    private readonly authService: AuthService,
    fb: FormBuilder,
  ) {
    this.formBuilder = fb;
    this.form = this.formBuilder.group<CreateUserFormModel>({
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: [UserRole.READER, Validators.required],
      username: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
  }

  submitForm() {
    
  }

  cancelClick() {
    this.modal.dismiss('cancel');
  }
}
