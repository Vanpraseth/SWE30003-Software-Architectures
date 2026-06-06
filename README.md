# Obejct Design Implementation

## SWE30003-Software-Architectures-and-Design



### Project Overview

This github repository contains an implementation of the design specified by our team in assignments one and two - Requirements Specification and Object Design.

The implementation was achieved through a locally run server written in the python.
This server performs operations upon a database through the user of HTTP queries called through our API.

A simple front-end has been developed with HTML and CSS to make HTTP requests via the API.



### Features

An index page to view all books with sorting, filtering, and searching functionality
Individual book pages to view more details about books and add them to the cart
A sign in / register page to establish a valid token for user information functionalities

A check-out page to review the cart details and make a payment (payment is un-implemented)
Cart is visible throuhgout index and book pages so that the user can always see the items they've added



### Project Structure

SWE30003-Software-Architecutres (Repository Root)/

├── README.md

└── Assignemnt 3/

&#x20;   ├── backend/

&#x20;   │   └── python scripts for backend and API

&#x20;   ├── database/

&#x20;   │   ├── bookstore.db (database)

&#x20;   │   └── .sql files

&#x20;   ├── frontend/

&#x20;   │   ├── assets/

&#x20;   │   │   └── images, etc.

&#x20;   │   ├── css/

&#x20;   │   │   └── .css files

&#x20;   │   ├── js/

&#x20;   │   │   └── .js files

&#x20;   │   └── .html files

&#x20;   └── run-dev.bat



### How to Run

Run SWE30003-Software-Architecutres/Assignment 3/run-dev.bat
If this doesn't work, try running as administrator

Ensure that you allow all permissions which the application requests



This should open the website in your browser



You won't be able to add to your cart without signing in. If you attempt to do so, you will be taken to the sign-in page.
Please use email van@example.com and pass password123 to sign in.



### Team Members

WILLIAM REEDIE, 104300597

NGY KEANG OEUNG, 104201881

VAN TUY, 104482107

ANH PHAN, 104480541

