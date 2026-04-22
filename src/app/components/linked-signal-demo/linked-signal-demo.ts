import { Component, computed, effect, linkedSignal, signal } from '@angular/core';
import { ShippingSelection } from "@components/shipping-selection/shipping-selection";

@Component({
  selector: 'app-linked-signal-demo',
  imports: [ShippingSelection],
  templateUrl: './linked-signal-demo.html',
  styleUrl: './linked-signal-demo.css',
})
export class LinkedSignalDemo {
  userStatus = signal<'online' | 'away' | 'offline'>('offline');

  notificationsPreference = signal<boolean>(this.userStatus() === 'online');

  // TODO: Add toggleNotifications method to manually set notificationsEnabled
  // toggleNotifications() {
  //   // This works with linkedSignal but would error with computed!
  //   this.notificationsPreference.update((prev) => !prev);
  // }

  toggleNotifications() {
    // 🔥 If offline → go online + enable notifications
    // if (this.userStatus() === 'offline') {
    //   this.userStatus.set('online');
    //   this.notificationsPreference.set(true);
    //   return;
    // }
    // otherwise normal toggle
    this.notificationsPreference.update((prev) => !prev);
  }
  tick = effect((cleanup) => {
    const interval = setInterval(() => {
      console.log('ticking...');
    }, 1000);
    cleanup(() => {
      clearInterval(interval);
    });
  });

  constructor() {
    effect(() => {
      if (this.userStatus() === 'online') {
        this.notificationsPreference.set(true);
      } else {
        this.notificationsPreference.set(false);
      }
    });
  }

  // notificationEffect = effect(() => {
  //   if (this.userStatus() === 'online') {
  //     this.notificationsPreference.set(true);
  //   } else {
  //     this.notificationsPreference.set(false);
  //   }
  // });
  // toggleNotifications() {

  //   this.notificationsEnabled.update((prev) => !prev);
  // } notificationsEnabled = computed(() => this.userStatus() === 'online');

  // notificationsEnabled = linkedSignal(() => this.userStatus() === 'online');

  statusMessage = computed(() => {
    const status = this.userStatus();
    switch (status) {
      case 'online':
        return 'Available for meetings and messages';
      case 'away':
        return 'Temporarily away, will respond soon';
      case 'offline':
        return 'Not available, check back later';
      default:
        return 'Status unknown';
    }
  });

  isWithinWorkingHours = computed(() => {
    const now = new Date();
    const hour = now.getHours();
    const isWeekday = now.getDay() > 0 && now.getDay() < 6;
    return isWeekday && hour >= 9 && hour < 17 && this.userStatus() !== 'offline';
  });

  //   goOnline() {
  //     this.userStatus.set('online');
  //   }

  //   goAway() {
  //     this.userStatus.set('away');
  //   }

  //   goOffline() {
  //     this.userStatus.set('offline');
  //   }

  //   toggleStatus() {
  //     const current = this.userStatus();
  //     switch (current) {
  //       case 'offline':
  //         this.userStatus.set('online');
  //         break;
  //       case 'online':
  //         this.userStatus.set('away');
  //         break;
  //       case 'away':
  //         this.userStatus.set('offline');
  //         break;
  //     }
  //   }
  // }
  goOnline() {
    this.userStatus.set('online');

    // optional: auto-enable when online
    this.notificationsPreference.set(true);
  }

  goAway() {
    this.userStatus.set('away');
    // keep notifications as is
  }

  goOffline() {
    this.userStatus.set('offline');

    // force disable when offline
    this.notificationsPreference.set(false);
  }

  toggleStatus() {
    const current = this.userStatus();

    switch (current) {
      case 'offline':
        this.userStatus.set('online');
        this.notificationsPreference.set(true); // optional
        break;

      case 'online':
        this.userStatus.set('away');
        break;

      case 'away':
        this.userStatus.set('offline');
        this.notificationsPreference.set(false);
        break;
    }
  }
}
