import { Component, OnInit } from '@angular/core';
import { Rental } from '../shared/rental.model';
import { RentalService } from '../shared/rental.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bwm-rental-create',
  templateUrl: './rental-create.component.html',
  styleUrls: ['./rental-create.component.scss']
})
export class RentalCreateComponent implements OnInit {

  newRental: Rental;
  rentalCategories = Rental.CATEGORIES;
  errors: any[] = [];

  constructor(private rentalService: RentalService) { }

  handleImageChange() {
    this.newRental.image = 'https://ds1.cityrealty.com/img/b57ad835236f5b5bf22e8d096dd14325a56d2d01+736++0+60/432-park-avenue-00.jpg';
  }

  ngOnInit() {
    this.newRental = new Rental();
    this.newRental.shared = false;
  }

  createRental() {
    this.rentalService.createRental(this.newRental).subscribe(
      () => {

      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors;
      });
  }

}
