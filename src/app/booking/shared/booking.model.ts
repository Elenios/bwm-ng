import { Rental } from '../../rental/shared/rental.model';

export class Booking {
  _id: string;
  startAt: string;
  endAt: string;
  totalPrice: number;
  guest: number;
  days: number;
  createdAt: string;
  rental: Rental;
}
