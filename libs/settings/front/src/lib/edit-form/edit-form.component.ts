import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { debounceTime, filter, Subscription } from 'rxjs';
import { SettingsFacade } from './../store/settings.facade';
import { CollapseTitleComponent, FormItemComponent } from '@jellyblog-nest/utils/front';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { CheckFileStoreComponent } from './check-file-store/check-file-store.component';
import { LetDirective } from '@ngrx/component';
import { applyDto, createForm } from './edit-form.form';

@Component({
    selector: 'app-settings-edit-form',
    templateUrl: './edit-form.component.html',
    styleUrls: ['./edit-form.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CollapseTitleComponent,
        NgbCollapse,
        CheckFileStoreComponent,
        ReactiveFormsModule,
        LetDirective,
        FormItemComponent,
    ]
})
export class EditFormComponent {

  protected readonly settingsFacade = inject(SettingsFacade);

  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  protected readonly checkFileStoreCollapsed = signal(true);

  protected readonly form = createForm();

  protected get formSettingsArray() {
    return this.form.controls.settings;
  }

  private trackSettingControlsSubscriptions = new Subscription();
  private trackSettingControlsChanges() {
    this.trackSettingControlsSubscriptions.unsubscribe();
    this.trackSettingControlsSubscriptions = new Subscription();
    this.formSettingsArray.controls.forEach((oneSettingControl) => {
      this.trackSettingControlsSubscriptions.add(oneSettingControl.valueChanges.pipe(
        debounceTime(2000),
        filter((settingFormValue) => !!settingFormValue),
      ).subscribe((settingFormValue) => {
        const {value, meta} = settingFormValue;
        if (meta) {
          this.settingsFacade.saveSetting({
            name: meta.name,
            label: meta.label,
            description: meta.description,
            value: value || undefined,
          });
        }
      }));
    });
  }

  constructor(
  ) {
    // update form after store changes
    effect(() => {
      const settings = this.settingsFacade.settingsSignal();
      applyDto(this.form, settings);
      this.trackSettingControlsChanges();
      // else template wont updates
      this.changeDetectorRef.markForCheck();
    });
  }

  protected checkFileStoreCollapseToggle() {
    this.checkFileStoreCollapsed.update((val) => !val);
  }
}
