# BankAppServer API

### This document provides an overview of the API endpoints for the BankAppServer, including descriptions, request methods, expected payloads, and responses.

## 📖 **Table of Contents**
1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [API Endpoints](#api-endpoints)
    - [GET Endpoints](#get-endpoints)
    - [POST Endpoints](#post-endpoints)
4. [Setup and Run](#setup-and-run)
5. [Testing](#testing)

## 📝 **Overview**
The **BankAppServer API** provides the backend functionality for a banking application, including deposit, withdrawal, transfer, and account history operations. Built using **Node.js** and **Prisma**, it supports a clean, modular structure for easy scalability.

## 💻 **Tech Stack**
- **Backend Framework**: Node.js with TypeScript
- **Database**: PostgreSQL (via Prisma ORM)
- **Validation**: Custom validation logic
- **Testing**: Jest for unit tests
- **Containerization**: Docker with `docker-compose`

### 📥 **GET Endpoints**

| Endpoint                              | Description                                    | Parameters |
|---------------------------------------|------------------------------------------------|------------|
| `/bank/dash/totalamount`              | Retrieves the total account balance.          | None       |
| `/bank/dash/totalinout`               | Retrieves the total inflows and outflows.     | None       |
| `/bank/dash/withdraw`                 | Retrieves total withdrawal details.           | None       |
| `/bank/dash/history`                  | Retrieves transaction history (most recent).  | None       |
| `/bank/history`                       | Retrieves detailed account transaction history.| None       |


### 📤 **POST Endpoints**

| Endpoint                              | Description                                    | Request Body                             |
|---------------------------------------|------------------------------------------------|------------------------------------------|
| `/bank/deposit`                       | Deposits a specified amount into the account. | `{ "amount": number }`                   |
| `/bank/withdraw`                      | Withdraws a specified amount from the account.| `{ "amount": number }`                   |
| `/bank/transfer`                      | Transfers funds to another IBAN account.      | `{ "amount": number, "iban": string }`   |

## 🛠️ **Setup and Run**

### Prerequisites
- **Node.js** (v16+)
- **Docker** and **Docker Compose**
- **PostgreSQL** (optional if not using Docker)

### Steps to Run Locally
1. Clone the repository:
    ```bash
    git clone https://github.com/coder-artisan0719/bank-app-server
    cd bankAppServer
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Run the database:
    ```bash
    docker-compose up -d
    ```

4. Apply Prisma migrations:
    ```bash
    npx prisma migrate dev
    ```

5. Start the server in development mode:
    ```bash
    npm run dev
    ```

## 🧪 **Testing**
Run unit tests:
```bash
npm run test
```
