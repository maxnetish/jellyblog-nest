import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { SettingDto } from '@jellyblog-nest/settings/model';
import { IFormArray, IFormBuilder, IFormGroup } from '@rxweb/types';
import { FormBuilder } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SettingsFacade } from './../store/settings.facade';

interface SettingsFormModel {
  settings: SettingFormModel[];
}

type SettingFormModel = SettingDto;

@Component({
  selector: 'app-settings-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class EditFormComponent implements OnInit, OnDestroy {

  form: IFormGroup<SettingsFormModel>;
  formSettingsArray: IFormArray<SettingFormModel>;
  formBuilder: IFormBuilder;

  private readonly unsubscribe$ = new Subject();

  constructor(
    public readonly settingsFacade: SettingsFacade,
    fb: FormBuilder,
  ) {
    this.formBuilder = fb;

    this.form = this.formBuilder.group<SettingsFormModel>({
      settings: this.formBuilder.array<SettingFormModel>([]),
    });

    this.formSettingsArray = this.form.controls.settings as IFormArray<SettingFormModel>;

    this.settingsFacade.settings$.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe((settings) => {
      this.formSettingsArray.clear();
      settings.forEach((setting) => {
       this.formSettingsArray.push(this.formBuilder.group<SettingFormModel>({
         name: [setting.name],
         value: [setting.value],
         label: [setting.label],
         description: [setting.description],
       }));
      });
    });

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
  }

}
