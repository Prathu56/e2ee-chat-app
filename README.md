# E2EE with ECDH
An implementation of E2EE (End-to-End Encryption) using the ECDH (Elliptic Curve Diffie Hellman) key exchange
 
This is the E2EE entirely on the server side.  
I acknowledge that realistically, this is impractical. In this implementation, we need to assume total trust that the server won't store our private keys, be it memory, storage, or database.  

I'll create an API documentation for this branch when the development is complete.

## Installation
- Install the required node packages using `npm i`  
- Either install MongoDB locally, or use MongoDB Atlas, and create a database on it  

## Configuration
Create a file named `.env` in the directory as follows:
```
DB_URL="<URL to the database>"
```

## Running the program
- Run the `index.js` file using `node index.js`  
- Access the endpoints by sending HTTP requests to http://localhost:3000/