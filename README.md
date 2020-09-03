# Northcoders News API

Welcome to my Northcoders News API, the backend for a Reddit-style app.

You can find the hosted verson here: https://nc-news-ab.herokuapp.com/api/

This project was built as one of the projects on the [Northcoders coding bootcamp] (https://northcoders.com/). It uses the following technologies:

- Node.js
- Postgres
- Express
- Knex

It was built following the test-driven development (TDD) process using Jest and Supertest.

## Endpoints

Go to _/api_ for detailed infomation about each endpoint.

```
GET /api

GET /api/topics

GET /api/users/:username

GET /api/articles/:article_id
PATCH /api/articles/:article_id

POST /api/articles/:article_id/comments
GET /api/articles/:article_id/comments

GET /api/articles

PATCH /api/comments/:comment_id
DELETE /api/comments/:comment_id
```

## Getting started & Installation

### Prerequisites

To run this API on your machine, you will need Node.js and Postgres installed on your machine.

To install Postgres, go to: https://www.postgresql.org/download/
The version required is a minimum of v. 12.1

To install Node, go to: https://nodejs.org/en/download/
The version required is a minimum of v. 13.8.0

### Installation

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

1. Clone a copy of the repository on your machine using the below command:

```javascript
git clone https://github.com/austinbooth/nc-news-backend.git
```

2. Install the required dependencies:

```javascript
npm install
```

### How to create your user.info.js file (required for Linux users)

Knex requires your username and password in order to access Postgres.

You should create a _user.info.js_ file in the project root and add this file to the _.gitignore_ file (along with the _node_modules_ folder.) An example setup of the file is below:

```javascript
const userInfo = {
  username: "your-postgres-username",
  password: "your-postgres-password",
};

module.exports = userInfo;
```

**Note:** If you are using Mac OS you will not need this file as your machine will remember your PSQL username and password.

### Setting up database

This API uses two databases, a test database and a development database.

To create both databases and seed them, run the following scripts in your terminal:

```
npm run setup-dbs
npm run seed
```
