export enum PostPermission {
  FOR_ALL = 'FOR_ALL',
  FOR_REGISTERED = 'FOR_REGISTERED',
  FOR_ME = 'FOR_ME',
}

export const postPermissionMap: Record<PostPermission, { label: string; badgeClass: string; }> = {
  [PostPermission.FOR_ALL]: {
    label: 'Для всех',
    badgeClass: 'text-bg-success',
  },
  [PostPermission.FOR_ME]: {
    label: 'Только мне',
    badgeClass: 'text-bg-secondary',
  },
  [PostPermission.FOR_REGISTERED]: {
    label: 'Для зарегистрированных',
    badgeClass: 'text-bg-warning',
  },
}
