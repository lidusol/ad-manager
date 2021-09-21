import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'convertToSpace'})
export class ConvertToSpacePipe implements PipeTransform {
  transform(name: string): string {
    return name.replace("_", " ")
  }
}
