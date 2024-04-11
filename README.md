# Project Title

The Fake Banking API project aims to build a backend API for a fictitious financial institution. This API is designed to provide basic banking features, including creating new bank accounts for customers, transferring funds between accounts, and querying account balances and transfer history.

# Technical

- framework: [Loopbak 4](https://loopback.io/)
- database: Postgresql

## Why Choose LoopBack for Building the API?

### Introduction

In the realm of backend development, choosing the right framework is pivotal. LoopBack, with its robust features and efficiency, stands out as an ideal choice for crafting the backend API.

### Advantages of LoopBack

- Rapid Development: Intuitive CLI tools and generators speed up development.
- Model-Driven Architecture: Facilitates structured data management.
- Built-in Security: Authentication and authorization mechanisms ensure secure endpoints.
- Scalability: Modular and extensible design allows seamless scaling.
- Community Support: Vibrant community and extensive ecosystem provide resources and plugins.

### Personal Experience

I have experience working with Loopback for a long time plus its great features so I decided to build an API with Loopback to get the best results this time, I know there can be many Other frameworks have better features but I think I should work with the one I have the most experience and confidence in

# DB structure

Customer

- id: A primary key unique field used to identify each customer, using the UUID data type.
- name: The name of the customer, cannot be null.
- email: The email address of the customer, cannot be null.
- phone: The phone number of the customer, cannot be null.
- status: The status of the customer, default is 'activated'.
- created_at: The date and time when the customer is - created, default is the current date and time.
- updated_at: The date and time when the customer is updated.
- deleted_at: The date and time when the customer is deleted.

account_id (Primary Key)
customer_id (Foreign Key to Customer)
balance
Transaction

transaction_id (Primary Key)
sender_account_id (Foreign Key to Account)
receiver_account_id (Foreign Key to Account)
amount
timestamp

# Project structure

# API documents

There are quite a lot of APIs so listing them here is too long, I will give you a json file to import it into postman on your personal environment and can test it more easily.

# Installing and running

## Prerequisites

- Required: Node.js version 18 and a PostgreSQL database.

## Cloning the Repository

- Clone the repository from GitHub:
  ```bash
  pip install foobar
  ```

## Installing Dependencies

- Navigate to the project directory:
  ```bash
  cd
  ```
- Install dependencies:
  ```bash
  yarn
  ```

## Setting up the Database

- Ensure PostgreSQL is installed and running on your system.
- Create a new PostgreSQL database for the project. \
  ```bash
  CREATE DATABASE fake_bank;
  ```
- Create user
  ```
  CREATE USER youruser WITH ENCRYPTED PASSWORD 'yourpass';
  ```
- Grant Privileges:
  ```
  GRANT ALL PRIVILEGES ON DATABASE yourdbname TO youruser;
  ```
- Enable pgcrypto Extension:
  ```
  CREATE EXTENSION pgcrypto;
  ```
- then in the project directory create a .env file copy the example in .env.example and replace your respective values

- in the terminal you run
  ```
  yarn migrate
  ```
  the command to perform the database migration
- Finally we can run the project with the
  `yarn start` in the command

You will see the program running at [localhost:3000](http://localhost:3000) and the api document at [localhost:3000/explorer](http://localhost:3000/explorer)
