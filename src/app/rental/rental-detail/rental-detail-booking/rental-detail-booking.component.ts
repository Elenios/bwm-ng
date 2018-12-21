import { Component, OnInit, Input, ViewContainerRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Booking } from '../../../booking/shared/booking.model';
import { Rental } from '../../shared/rental.model';
import { HelperService } from '../../../common/service/helper.service';
import { BookingService } from '../../../booking/shared/booking.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { DaterangePickerComponent } from 'ng2-daterangepicker';
import * as moment from 'moment';
import { AuthService } from '../../../auth/shared/auth.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'bwm-rental-detail-booking',
  templateUrl: './rental-detail-booking.component.html',
  styleUrls: ['./rental-detail-booking.component.scss']
})
export class RentalDetailBookingComponent implements OnInit {

  @Input() rental: Rental;
  @ViewChild(DaterangePickerComponent)
  private picker: DaterangePickerComponent;

  newBooking: Booking;
  modalRef: any;

  daterange: any = {};
  bookedDates: any[] = [];
  errors: any[] = [];
  options: any = {
    locale: { format: Booking.DATE_FORMAT },
    alwaysShowCalendars: false,
    opens: 'left',
    autoUpdateInput: false,
    isInvalidDate: this.checkForInvalidDates.bind(this)
  };

  constructor(private helper: HelperService,
              private bookingService: BookingService,
              private modalService: NgbModal,
              private toastr: ToastsManager,
              private vcr: ViewContainerRef,
              public auth: AuthService) {
    this.toastr.setRootViewContainerRef(vcr);
              }

  ngOnInit() {
    this.newBooking = new Booking();
    this.getBookedDates();
  }

  private checkForInvalidDates(date) {
    return this.bookedDates.includes(this.helper.formatBookingDate(date)) || date.diff(moment(), 'days') < 0;
  }

  private getBookedDates() {
    const bookings: Booking[] = this.rental.bookings;
    if (bookings && bookings.length > 0) {
      bookings.forEach((booking: Booking) => {
        this.addNewBookedDates(booking);
    });
    }
  }

  private addNewBookedDates(bookingData) {
    this.bookedDates.push(...this.helper.getBookingRangeOfDates(bookingData.startAt, bookingData.endAt));
  }

  private resetDatePicker() {
    this.picker.datePicker.setStartDate(moment());
    this.picker.datePicker.setEndDate(moment());
    this.picker.datePicker.element.val('');
  }

  openConfirmModal(content) {
    this.errors = [];
    this.modalRef = this.modalService.open(content);
    this.resetDatePicker();

  }

  createBooking() {
    this.newBooking.rental = this.rental;
    this.bookingService.saveBooking(this.newBooking).subscribe(
      (bookingData: any) => {
        this.addNewBookedDates(bookingData);
        this.newBooking = new Booking();
        this.modalRef.close();
        this.toastr.success('Your booking has been successfully created!', 'Success!');
      },
      (errorResponse: any) => {
        this.errors = errorResponse.error.errors;
      });
  }

  selectedDate(value: any, datepicker?: any) {
    this.options.autoUpdateInput = true;
    this.newBooking.startAt = this.helper.formatBookingDate(value.start);
    this.newBooking.endAt = this.helper.formatBookingDate(value.end);
    this.newBooking.days = value.end.diff(value.start, 'days');
    this.newBooking.totalPrice = this.newBooking.days * this.rental.dailyRate;
  }

}
