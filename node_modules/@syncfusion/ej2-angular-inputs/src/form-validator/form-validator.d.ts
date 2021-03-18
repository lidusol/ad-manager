import { AbstractControl, ValidatorFn } from '@angular/forms';
export declare class FormValidators {
    static max(number: number | Date): ValidatorFn;
    static min(number: number | Date): ValidatorFn;
    static creditcard(control: AbstractControl): {
        [key: string]: boolean;
    } | null;
    static date(control: AbstractControl): {
        [key: string]: boolean;
    } | null;
    static dateIso(control: AbstractControl): {
        [key: string]: boolean;
    } | null;
    static digits(control: AbstractControl): {
        [key: string]: boolean;
    } | null;
    static email(control: AbstractControl): {
        [key: string]: boolean;
    } | null;
    static maxLength(number: number): ValidatorFn;
    static minLength(number: number): ValidatorFn;
    static number(control: AbstractControl): {
        [key: string]: boolean;
    } | null;
    static required(control: AbstractControl): {
        [key: string]: boolean;
    } | null;
    static tel(control: AbstractControl): {
        [key: string]: boolean;
    } | null;
    static url(control: AbstractControl): {
        [key: string]: boolean;
    } | null;
    static rangeLength(number1: number, number2: number): ValidatorFn;
    static range(number1: number, number2: number): ValidatorFn;
}
