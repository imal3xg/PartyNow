import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-price-input',
  templateUrl: './price-input.component.html',
  styleUrls: ['./price-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PriceInputComponent),
      multi: true,
    },
  ],
})
export class PriceInputComponent implements ControlValueAccessor {
  value: number | null = null; // Current value of the price input

  // Callbacks for the ControlValueAccessor interface
  private onChange: (value: number | null) => void = () => {};
  onTouched: () => void = () => {};

  /**
   * Write a new value to the input when the parent form sets it.
   */
  writeValue(value: number | null): void {
    this.value = value;
  }

  /**
   * Register a callback for when the value changes.
   */
  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  /**
   * Register a callback for when the input is touched.
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Handle user input and notify the form about the new value.
   */
  onInputChange(event: any): void {
    const inputValue = event.target.value ? parseFloat(event.target.value) : null;
    this.value = inputValue;
    this.onChange(inputValue);
  }
}
