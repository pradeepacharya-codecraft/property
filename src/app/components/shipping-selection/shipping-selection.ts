import { Component, linkedSignal, signal } from '@angular/core';

@Component({
  selector: 'app-shipping-selection',
  imports: [],
  templateUrl: './shipping-selection.html',
  styleUrl: './shipping-selection.css',
})
export class ShippingSelection {
  // shippingOptions = signal<ShippingMethod[]>([
  //   { id: 0, name: 'Ground' },
  //   { id: 1, name: 'Air' },
  //   { id: 2, name: 'Sea' },
  // ]);
  //userSelectedShippingOption = linkedSignal(() => this.shippingOptions()[0]);

  shippingOptions = signal<string[]>(['Ground', 'Air', 'Sea']);
  userSelectedShippingOption = linkedSignal<string[], string>({
    source: this.shippingOptions,
    computation: (newDependencyValue, myPreviousValue): string => {
      if (newDependencyValue.includes(myPreviousValue?.value as string)) {
        return myPreviousValue?.value ?? '';
      } else {
        return newDependencyValue[0];
      }
    },
  });

  changeShippingOptions() {
    this.shippingOptions.set(['Postal Service', 'Sea', 'Courier']);
  }
  handleUserInput(event: Event) {
    const userSelectedValue = (event.target as HTMLInputElement).value;
    console.log((event.target as HTMLInputElement).value);
    this.userSelectedShippingOption.set(userSelectedValue);
  }
}
