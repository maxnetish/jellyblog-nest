export enum PostStatus {
  DRAFT = 'DRAFT',
  PUB = 'PUB',
}

export const postStatusMap: Record<PostStatus, { label: string, badgeClass: string }> = {
  [PostStatus.DRAFT]: {
    label: 'Черновик',
    badgeClass: 'text-bg-info',
  },
  [PostStatus.PUB]: {
    label: 'Опубликован',
    badgeClass: 'text-bg-success',
  },
}
