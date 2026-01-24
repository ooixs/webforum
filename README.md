# Webforum for CVWO Assignment

## By Ooi Xuan Shan

## Getting Started

### Running the app

1. Fork this repo and clone it.
2. Open a terminal and navigate to the directory containing the cloned project.
3. Install dependencies for the project by running this command:

```cmd
npm install
```

4. Go to [commands.sql](/commands.sql) and execute all of the SQL commands in your PostgreSQL server to set up the database.

5. Create a `.env` file in the project root and enter the following environment variable:

```
DATABASE_URL=postgres://(username):(password)@localhost:5432/forum
```

Replace `username` and `password` with the username and password to your PostgreSQL database.

6. Start the frontend server using the same terminal by running this command:

```cmd
npm run dev
```

7. Open another terminal in the same directory and start the backend server by running this command:

```cmd
go run cmd/server/main.go
```

## AI Usage

More details of the usage of AI can be found under AI_usage.docx, for better formatting.
