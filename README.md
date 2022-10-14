# ReserveIt

## A Restaurant Reservation System

### [ReserveIt](https://reserveit-eight.vercel.app/dashboard "ReserveIt")

---

### Set Up

## Fork and clone and then run npm install in the root. Copy the .env.sample file to set up environments.

---

### Testing

## To run test run the command npm run test from the root. This will first run all front-end test sequentially followed by all the backend test.

### Navigation Buttons

---

###Dashboard
![Dashboard](/screenshots/dashboard.png "Dashboard")
The Dashboard page shows all reservations for the selected day as well as all tables. Each reservation shows a status of either booked or seated. Each reservation card has the following buttons.

#### Reservation Cards

##### Seat

![Seating Form](/screenshots/seating_form.png "Seating Form")
The "Seat" button brings the user to the page pictured above. Here a table to seat the reservation can be select. Note that tables that are occupied or too small will be grayed out as seen in the following image.
![Table Not Available](/screenshots/seating_form_table_not_available.png "Table Not Available")

---

##### Edit

![Edit Form](/screenshots/edit_form.png "Edit Form")
The "Edit" button will bring the user to a form that will be filled with the selected reservations information. The user can then edit the reservation.

---

##### Cancel reservation

![Confirm Cancel](/screenshots/cancel_confirm.png "Confirm Cancel")  
The "Cancel" button will display the following confirmation and prompt the user that they would like to cancel the reservation.

---

#### Table Cards

![Confirm Finish](/screenshots/finished_confirm.png "Confirm Finish")

Each table card has a finished button this will prompt the user to confirm that the reservation has left and the table is now free.

---

### Search

![Search](/screenshots/search.png "Search")
The Search page allows the users to search for reservations via a phone number. Note that a full number is not needed to retrieve results. Also note that reservations with status of "booked", "seated", "finished", and "cancelled" will appear in the search results.

---

### New Reservation

![Reservation Form](/screenshots/reservation_form.png "Reservation Form")
This page allows a user to create a new reservation. The following errors are possible on this page.
![Error](/screenshots/tuesday_error.png "Error")
![Error](/screenshots/not_opened.png "Error")
![Error](/screenshots/close_to_closing.png "Error")

---

### New Table

![Table Form](/screenshots/table_form.png "Table Form")
This page allows a user to create a new table for seating.
