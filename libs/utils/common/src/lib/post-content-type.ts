export enum PostContentType {
  HTML = 'HTML',
  MD = 'MD',
}

export const postContentTypeMap: Record<PostContentType, { label: string; description: string; }> = {
  [PostContentType.HTML]: {
    label: 'HTML',
    description: 'Text with html markup',
  },
  [PostContentType.MD]: {
    label: 'MD',
    description: 'Text with markdown markup',
  },
}
