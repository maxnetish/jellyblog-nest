import { ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { SettingDto } from '@jellyblog-nest/settings/model';
import { IFormArray, IFormBuilder, IFormGroup } from '@rxweb/types';
import { FormBuilder } from '@angular/forms';
import { combineLatest, debounceTime, filter, Subject, take, takeUntil } from 'rxjs';
import { SettingsFacade } from './../store/settings.facade';
import { Store } from '@ngrx/store';

interface SettingsFormModel {
  settings: SettingFormModel[];
}

type SettingFormModel = SettingDto;

@Component({
  selector: 'app-settings-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  // We cannot use OnPush. Form controls will not update bound elements after change dirty status
  changeDetection: ChangeDetectionStrategy.Default,
})
export class EditFormComponent implements OnDestroy {

  form: IFormGroup<SettingsFormModel>;
  formSettingsArray: IFormArray<SettingFormModel>;
  formBuilder: IFormBuilder;

  private readonly unsubscribe$ = new Subject();

  private updateSetting(updateSettingDto: SettingDto | null) {
    if (updateSettingDto) {
      this.settingsFacade.saveSetting(updateSettingDto);
    }
  }

  constructor(
    private readonly store: Store,
    public readonly settingsFacade: SettingsFacade,
    fb: FormBuilder,
  ) {
    this.formBuilder = fb;

    this.form = this.formBuilder.group<SettingsFormModel>({
      settings: this.formBuilder.array<SettingFormModel>([]),
    });

    this.formSettingsArray = this.form.controls.settings as IFormArray<SettingFormModel>;

    this.settingsFacade.settings$.pipe(
      take(1),
    ).subscribe((settings) => {
      this.formSettingsArray.clear();
      settings.forEach((setting) => {
        const oneSettingControl = this.formBuilder.group<SettingFormModel>({
          name: [setting.name],
          value: [setting.value],
          label: [setting.label],
          description: [setting.description],
        });
        this.formSettingsArray.push(oneSettingControl);
        oneSettingControl.valueChanges.pipe(
          takeUntil(this.unsubscribe$),
          debounceTime(2000),
          filter((settingDtoOrNull) => !!settingDtoOrNull),
        ).subscribe((settingDto) => {
          this.updateSetting(settingDto);
        });
      });
    });

    // mark as pristine after save complete
    combineLatest([
      this.settingsFacade.settings$,
      this.formSettingsArray.valueChanges,
    ]).pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(([persistedSettings, formSettingsValue]) => {
      formSettingsValue.forEach((formSetting) => {
        const persistedSetting = persistedSettings.find(item => item.name === formSetting.name);
        if (persistedSetting && (persistedSetting.value === formSetting.value)) {
          const formControl = this.formSettingsArray.controls.find((control) => control.value && (control.value.name === formSetting.name));
          if (formControl) {
            formControl.markAsPristine();
          }
        }
      })
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

}
