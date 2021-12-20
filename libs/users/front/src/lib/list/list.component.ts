import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import * as ListStoreActions from './store/users-list.actions';
import * as ListStoreSelectors from './store/users-list.selectors';
import { Observable, of, switchMap, take, tap } from 'rxjs';
import { UserInfoDto } from '@jellyblog-nest/auth/model';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v4 } from 'uuid';

@Component({
  selector: 'app-users-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class UserListComponent implements OnInit {

  users$: Observable<UserInfoDto[]>;
  total$: Observable<number>;
  page$: Observable<number>;
  pageSize$: Observable<number>;

  trackUsers(_: unknown, item: UserInfoDto) {
    return item.uuid;
  }

  constructor(
    private readonly store: Store,
  ) {
    this.users$ = of(null).pipe(
      take(1),
      tap(() => {
        this.store.dispatch(ListStoreActions.init());
      }),
      switchMap(() => {
        return this.store.select(ListStoreSelectors.getUsersList);
      }),
    );
    this.total$ = this.store.select(ListStoreSelectors.getTotal);
    this.page$ = this.store.select(ListStoreSelectors.getPage);
    this.pageSize$ = this.store.select(ListStoreSelectors.getPageSize);
  }

  ngOnInit(): void {
    // this.store.dispatch(ListStoreActions.init());


  }

  handleAddUserButtonClick() {
    this.store.dispatch(ListStoreActions.createUser());
  }

  handlePageChange(newPage: number) {
    this.store.dispatch(ListStoreActions.goToPage({page: newPage}));
  }

  handleChangeRoleClick(user: UserInfoDto) {
    this.store.dispatch(ListStoreActions.updateUser({user}));
  }

  handleRemoveClick(user: UserInfoDto) {
    this.store.dispatch(ListStoreActions.removeUser({user}));
  }

  handleSetPasswordClick(user: UserInfoDto) {
    this.store.dispatch(ListStoreActions.setPassword({user}));
  }

  async handleSubmitFile(event: Event, inputElement: HTMLInputElement) {
    event.preventDefault();

    const s3Client = new S3Client({
      credentials: {
        accessKeyId: '',
        secretAccessKey: '',
      },
      region: 'eu-central-1',

    });
    const file = inputElement.files ? inputElement.files[0] : null;
    if (!file) {
      return;
    }
    const uploadCommand = new PutObjectCommand({
      Key: v4(),
      Body: file,
      Bucket: 'jbfs',
      ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ContentDisposition: `attachment; filename="${file.name}"`,
      Metadata: {
        originalName: file.name,
      },
    });
    try {
      const uploadResult = await s3Client.send(uploadCommand);
      console.log(uploadResult);
    } catch (e) {
      console.error(e);
    }
  }


}
