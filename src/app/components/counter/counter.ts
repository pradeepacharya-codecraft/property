import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  templateUrl: './counter.html',
  styleUrls: ['./counter.css'],
})
export class Counter {
  initialCount = input<number>(0);

  // output signal
  valueChange = output<number>();

  count = 0;

  ngOnInit() {
    this.count = this.initialCount();
  }

  increment() {
    this.count++;
    this.valueChange.emit(this.count);
  }

  decrement() {
    this.count--;
    this.valueChange.emit(this.count);
  }
}
