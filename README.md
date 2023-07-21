# Chat-Nat (formerly E2EE with ECDH)
An implementation of E2EE (End-to-End Encryption) using the ECDH (Elliptic Curve Diffie Hellman) key exchange
 
This is the E2EE used in a webapp built using the MERN stack.

## Installation
- Navigate to the backend folder using `cd backend`
- Install the node packages required for backend using `npm i`  
- Either install MongoDB locally, or use MongoDB Atlas, and create a database on it  
- Open another terminal
- Navigate to the frontend folder using `cd frontend`
- Install the node packages required for frontend using `npm i`

## Configuration
Create a file named `.env` in the backend directory as follows:
```
DB_URL="<URL to the database>"
LOGIN_KEY="<a random string>"
```

## Running the program
- While still in the backend directory, run the `index.js` file using `node index.js`
- In the other terminal, while in the frontend directory, run `npm start` to start React
- Now, the backend should be running at http://localhost:5000/, and the frontend at http://localhost:3000