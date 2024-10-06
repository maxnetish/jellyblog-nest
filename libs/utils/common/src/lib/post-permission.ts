export enum PostPermission {
  FOR_ALL = 'FOR_ALL',
  FOR_REGISTERED = 'FOR_REGISTERED',
  FOR_ME = 'FOR_ME',
}

export const postPermissionMap: Record<PostPermission, { label: string; badgeClass: string; description: string; }> = {
  [PostPermission.FOR_ALL]: {
    label: 'Для всех',
    badgeClass: 'text-bg-success',
    description: 'После публикации все могут читать',
  },
  [PostPermission.FOR_ME]: {
    label: 'Только мне',
    badgeClass: 'text-bg-secondary',
    description: 'После публикации может читать только автор',
  },
  [PostPermission.FOR_REGISTERED]: {
    label: 'Для зарегистрированных',
    badgeClass: 'text-bg-warning',
    description: 'После публикации могут читать те, кто залогинился, то есть зарегистрированные',
  },
}
