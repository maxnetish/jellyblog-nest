import { Position } from './position';

export interface ImageState extends Position {
  width?: number;
  height?: number;
  resource?: HTMLImageElement;
}
