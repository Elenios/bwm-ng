import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rental } from './rental.model';

@Injectable()
export class RentalService {

  private rentals: Rental[] = [{
    id: '1',
    title: 'Central Apartment',
    city: 'New York',
    street: 'Times Square',
    category: 'apartment',
    image: 'http://via.placeholder.com/350x250',
    bedrooms: 3,
    description: 'Very nice apartment',
    dailyRate: 34,
    shared: false,
    createdAt: '24/12/2017'
  },
  {
    id: '2',
    title: 'Central Condo',
    city: 'San Francisco',
    street: 'Main street',
    category: 'condo',
    image: 'http://via.placeholder.com/350x250',
    bedrooms: 2,
    description: 'Very nice condo',
    dailyRate: 40,
    shared: true,
    createdAt: '24/12/2017'
  },
  {
    id: '3',
    title: 'Central Condo 2',
    city: 'Bratislava',
    street: 'Hlavna',
    category: 'condo',
    image: 'http://via.placeholder.com/350x250',
    bedrooms: 2,
    description: 'Very nice condo',
    dailyRate: 24,
    shared: true,
    createdAt: '24/12/2017'
  },
  {
    id: '4',
    title: 'Central House',
    city: 'Berlin',
    street: 'Haupt strasse',
    category: 'house',
    image: 'http://via.placeholder.com/350x250',
    bedrooms: 9,
    description: 'Very nice house',
    dailyRate: 33,
    shared: true,
    createdAt: '24/12/2017'
  }];
  
  public getRentals(): Observable<Rental[]> {
    const rentalObservable: Observable<Rental[]> = new Observable((observer) => {

      setTimeout(() => {
        observer.next(this.rentals);
      }, 1000);
      setTimeout(() => {
        observer.error('error');
      }, 2000);
      setTimeout(() => {
        observer.complete();
      }, 3000);
    });
    return rentalObservable;
  }

}