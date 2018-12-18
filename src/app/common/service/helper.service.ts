import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class HelperService {

  getRangeOfDates(startAt, endAt) {
    const tempDates = [];
    const mEndAt = moment(endAt);
    let mStartAt = moment(startAt);

    while (mStartAt < mEndAt) {
      tempDates.push(mStartAt.format('Y-MM-DD'));
      mStartAt = mStartAt.add(1, 'day');
    }
    tempDates.push(moment(startAt).format('Y-MM-DD'));
    tempDates.push(moment(endAt).format('Y-MM-DD'));

    return tempDates;
  }
}
