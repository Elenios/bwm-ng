import { Injectable } from '@angular/core';
import { Booking } from '../../booking/shared/booking.model';
import * as moment from 'moment';

@Injectable()
export class HelperService {

  getRangeOfDates(startAt, endAt) {
    const tempDates = [];
    const mEndAt = moment(endAt);
    let mStartAt = moment(startAt);

    while (mStartAt < mEndAt) {
      tempDates.push(mStartAt.format(Booking.DATE_FORMAT));
      mStartAt = mStartAt.add(1, 'day');
    }
    tempDates.push(moment(startAt).format(Booking.DATE_FORMAT));
    tempDates.push(moment(endAt).format(Booking.DATE_FORMAT));

    return tempDates;
  }
}
