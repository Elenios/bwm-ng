import { Component, OnInit, Input } from '@angular/core';
import { Booking } from '../../../booking/shared/booking.model';
import { HelperService } from '../../../common/service/helper.service';

@Component({
  selector: 'bwm-rental-detail-booking',
  templateUrl: './rental-detail-booking.component.html',
  styleUrls: ['./rental-detail-booking.component.scss']
})
export class RentalDetailBookingComponent implements OnInit {

  @Input() price: number;
  @Input() bookings: Booking[];

  daterange: any = {};
  bookedDates: any[] = [];
  options: any = {
    locale: { format: 'Y-MM-DD' },
    alwaysShowCalendars: false,
    opens: 'left'
  };

  constructor(private helper: HelperService) { }

  ngOnInit() {
    this.getBookedDates();
  }

  private getBookedDates() {
    if (this.bookings && this.bookings.length > 0) {
      this.bookings.forEach((booking: Booking) => {
      const dateRange = this.helper.getRangeOfDates(booking.startAt, booking.endAt);
      this.bookedDates.push(...dateRange);
    });
    }
  }

  selectedDate(value: any, datepicker?: any) {
    console.log(value);

    datepicker.start = value.start;
    datepicker.end = value.end;

    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.daterange.label = value.label;
  }

}
