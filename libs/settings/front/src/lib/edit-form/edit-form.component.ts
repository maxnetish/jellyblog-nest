import { ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { SettingDto } from '@jellyblog-nest/settings/model';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { combineLatest, debounceTime, filter, Subject, takeUntil } from 'rxjs';
import { SettingsFacade } from './../store/settings.facade';
import { Store } from '@ngrx/store';
import { SettingName } from '@jellyblog-nest/utils/common';

type SettingsForm = FormGroup<{
  settings: FormArray<FormGroup<{
    name: FormControl<SettingName | null>;
    value: FormControl<string | null>;
    description: FormControl<string | null>;
    label: FormControl<string | null>;
  }>>;
}>;

function createForm(): SettingsForm {
  return new FormGroup({
    settings: new FormArray<FormGroup>([]),
  });
}

function applyDto(form: SettingsForm, settingsDto: SettingDto[] = []) {

  const settingsControl = form.controls.settings;
  settingsControl.clear();

  settingsDto.forEach((settingDto) => {
    settingsControl.push(new FormGroup({
      name: new FormControl<SettingName | null>(null),
      description: new FormControl<string | null>(null),
      label: new FormControl<string | null>(null),
      value: new FormControl<string | null>(null)
    }), {emitEvent: false});
  })

  settingsControl.patchValue(settingsDto);

  return form;
}

@Component({
  selector: 'app-settings-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  // We cannot use OnPush. Form controls will not update bound elements after change dirty status
  changeDetection: ChangeDetectionStrategy.Default,
})
export class EditFormComponent implements OnDestroy {

  form = createForm();
  formSettingsArray = this.form.controls.settings;

  private readonly unsubscribe$ = new Subject();

  private updateSetting(updateSettingDto: SettingDto | null) {
    if (updateSettingDto) {
      this.settingsFacade.saveSetting(updateSettingDto);
    }
  }

  constructor(
    private readonly store: Store,
    public readonly settingsFacade: SettingsFacade,
  ) {
    this.settingsFacade.settings$.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe((settings) => {
      applyDto(this.form, settings);
      settings.forEach((setting, settingIndex) => {
        const oneSettingControl = this.formSettingsArray.at(settingIndex);
        oneSettingControl.valueChanges.pipe(
          takeUntil(this.unsubscribe$),
          debounceTime(2000),
          filter((settingDtoOrNull) => !!settingDtoOrNull),
        ).subscribe((settingDto) => {
          this.updateSetting({
            name: settingDto.name!,
            value: settingDto.value!,
            label: settingDto.label!,
            description: settingDto.description!,
          });
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
