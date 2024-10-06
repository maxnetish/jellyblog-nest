import { ClassValidatorFormControl, ClassValidatorFormGroup } from 'ngx-reactive-form-class-validator';
import { PostDto, PostUpdateRequest, TagDto } from '@jellyblog-nest/post/model';
import { PostContentType, PostPermission } from '@jellyblog-nest/utils/common';

export type PostEditForm = ReturnType<typeof createForm>;

export function createForm() {
  return new ClassValidatorFormGroup(
    PostUpdateRequest,
    {
      allowRead: new ClassValidatorFormControl<PostPermission>(null),
      contentType: new ClassValidatorFormControl<PostContentType>(null),
      title: new ClassValidatorFormControl<string>(null),
      brief: new ClassValidatorFormControl<string>(null),
      content: new ClassValidatorFormControl<string>(null),
      tags: new ClassValidatorFormControl<TagDto[]>([]),
    },
  );
}

export function applyDtoToForm(form: PostEditForm, dto: PostDto | null) {

  if(!dto) {
    return form;
  }

  form.setValue({
    allowRead: dto.allowRead,
    contentType: dto.contentType,
    title: dto.title,
    brief: dto.brief,
    content: dto.content,
    tags: dto.tags || [],
  });

  form.markAsPristine();

  return form;
}

export function formToDto(form: PostEditForm, initialDto: PostUpdateRequest): PostUpdateRequest {
  const formValue = form.value;
  return {
    ...initialDto,
    allowRead: formValue.allowRead,
    contentType: formValue.contentType,
    title: formValue.title,
    brief: formValue.brief,
    content: formValue.content,
    tags: formValue.tags || [],
  };
}
