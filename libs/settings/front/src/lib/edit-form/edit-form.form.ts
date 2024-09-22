import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { SettingName } from '@jellyblog-nest/utils/common';
import { SettingDto } from '@jellyblog-nest/settings/model';

export type SettingsForm = ReturnType<typeof createForm>;

export function createForm() {
  return new FormGroup({
    settings: new FormArray<FormGroup<{
      meta: FormControl<{ name: SettingName; description: string; label: string } | null>;
      value: FormControl<string | null>;
    }>>([]),
  });
}

export function applyDto(form: SettingsForm, settingsDto: SettingDto[] = []) {
  const settingsControl = form.controls.settings;

  /**
   * 1. Find existing control in form array corresponding dto
   *   If found then update it.
   *   Else create new control and add to form array.
   * 2. Remove controls in form array that not have corresponding dto (in case of removing one in dto)
   *
   * So we will sync form array with dto
   */
  settingsDto.forEach((settingDto) => {
    const {value, ...meta} = settingDto;
    const correspondingControl = settingsControl.controls.find(c => c.value.meta?.name === settingDto.name);
    if (correspondingControl) {
      correspondingControl.patchValue({
        value,
      }, {
        // dont emit event, else there will be endless updates
        emitEvent: false,
      });
      // control now become pristine
      correspondingControl.markAsPristine();
    } else {
      settingsControl.push(new FormGroup({
        meta: new FormControl(meta),
        value: new FormControl(value || null),
      }));
    }
  });
  // and remove superfluous controls from form array
  settingsControl.controls.forEach((control, ind) => {
    const correspondingSettingDto = settingsDto.find(s => s.name === control.value.meta?.name);
    if (!correspondingSettingDto) {
      settingsControl.removeAt(ind);
    }
  });

  return form;
}
