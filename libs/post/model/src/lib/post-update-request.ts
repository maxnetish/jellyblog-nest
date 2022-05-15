import { Post } from '@jellyblog-nest/entities';
import { IsOptional, IsUUID } from 'class-validator';

// export type PostUpdateRequest = Post | Omit<Post, 'uuid'>

// export class PostUpdateRequest extends Post {
//   @IsUUID()
//   @IsOptional()
//   uuid?: string;
// }
