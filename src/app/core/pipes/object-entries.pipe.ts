import { Pipe, PipeTransform } from '@angular/core';
import { Colors } from '../models/board.interface';

@Pipe({
  name: 'objectEntries',
  standalone: true,
})
export class ObjectEntriesPipe implements PipeTransform {
  transform(value: { [key: string]: Colors }): [string, Colors][] | null {
    if (value) {
      return Object.entries(value);
    }

    return null;
  }
}
