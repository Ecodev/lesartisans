import {Pipe, PipeTransform} from '@angular/core';
import * as striptags from 'striptags';

@Pipe({
    name: 'stripTags',
    standalone: true,
})
export class StripTagsPipe implements PipeTransform {
    public transform(value: string): string {
        return striptags(value, ['strong', 'em', 'u']);
    }
}
