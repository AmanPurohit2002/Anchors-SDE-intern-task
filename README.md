# Discussion Forum Web Application

Welcome to the Discussion Forum web application! This project is designed to provide users with a platform to engage in discussions by creating accounts, posting topics, commenting on posts, and replying to comments.

## Features

- **User Authentication:**
  - Users can create accounts and log in to the system.
  - OTP based verification

- **Post Management:**
  - Users can create new posts for discussion.
  - Each post can have multiple comments.

- **Commenting System:**
  - Users can comment on posts to express their opinions.
  - Replies to comments are supported for threaded discussions.

- **Viewing Posts:**
  - Users can view all posts along with the number of comments.
  - A dedicated section allows users to see their own posts and the corresponding comment counts and replies count.

## Tech Stack

- **Frontend:**
  - [React](https://reactjs.org/): JavaScript library for building user interfaces.
  - [React Router](https://reactrouter.com/): Declarative routing for React.js.

- **Backend:**
  - [Node.js](https://nodejs.org/): JavaScript runtime for server-side development.
  - [Express.js](https://expressjs.com/): Web application framework for Node.js.
  - [MongoDB](https://www.mongodb.com/): NoSQL database for data storage.

- **Email Notifications:**
  - [Nodemailer](https://nodemailer.com/): Send emails with Node.js.
  -The Discussion Forum web application includes an email notification system to keep users informed about various events. The application uses Nodemailer to send emails for the authentication,comments,replies:

- **OTP (One-Time Password) via Nodemailer:**
  - Securely send OTP for additional authentication.

## Email Notifications



## Getting Started

To get the project up and running on your local machine, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/AmanPurohit2002/Anchors-SDE-intern-task
   ```

2. Run the frontend
    ```
    cd frontend
    npm i 
    npm run start
    ```
3. Run the backend
    ```
    cd backend
    npm i 
    npm run dev
    ```
## Contributing
Feel free to contribute to the project by submitting bug reports, feature requests, or even pull requests. Your feedback is highly appreciated!

   

