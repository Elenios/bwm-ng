import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bwm-rental-list',
  templateUrl: './rental-list.component.html',
  styleUrls: ['./rental-list.component.scss']
})
export class RentalListComponent implements OnInit {

  rentals: any[] = [{
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
  },
]

  constructor() { }

  ngOnInit() {
  }

}
