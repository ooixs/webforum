# Webforum for CVWO Assignment

### By Ooi Xuan Shan

The online version of the app can be found on [https://webforum-frontend.onrender.com](https://webforum-frontend.onrender.com).

(Note that the backend may take up to 50 seconds to start up due to Render web hosting limitations, hence it will take some time to login or register)

## Running the app

1. Fork this repo and clone it.
2. Open a terminal and navigate to the directory containing the cloned project.
3. Install dependencies for the project by running this command:

```cmd
npm install
```

4. Go to [commands.sql](/commands.sql) and execute all of the SQL commands in your PostgreSQL server to set up the database.

5. Create a `.env` file in the project root and enter the following environment variable:

```
DATABASE_URL=postgres://username:password@localhost:5432/forum
```

&emsp;Replace `username` and `password` with the username and password to your PostgreSQL database.

6. Start the frontend server using the same terminal by running this command:

```cmd
npm run dev
```

7. Open another terminal in the same directory and start the backend server by running this command:

```cmd
go run cmd/server/main.go
```

8. Open [http://localhost:5173](http://localhost:5173) to view the webforum in the browser.

## AI Usage

The following is a summary of my AI usage, with all prompts given to Gemini unless otherwise specified:

- GitHub Copilot is used only for repetitive tasks, such as writing code for a reply item that mirrors the structure of a post. I only use it when I already have the full logic and code mapped out in my head.
  - Copilot is turned off when I am writing unfamiliar code, such as when creating my first async functions in the frontend and Go queries to PostgreSQL in the backend.
- Searching for guides on Go, React, and integration between frontend and backend.
- Learning more about pgx and pgxpool for database connections.
- Understanding communication with backend using the ‘/api’ proxy.
- Understanding the backend directory structure.
- Learning how useEffect controls when data updates and components render.
- Finding UI and UX recommendations for the posts and replies pages.
- Learning more about the behaviour of React Link component when moving between different pages.
- Learning how to fix CORS issues so the frontend and backend can communicate securely on Render.
- Understanding how to make timestamps sync to local time.

More details of the usage of AI can be found under [AI_usage.docx](/AI_usage.docx), for better formatting.
