# E2EE with ECDH
An implementation of E2EE (End-to-End Encryption) using the ECDH (Elliptic Curve Diffie Hellman) key exchange
 
This is the E2EE entirely on the server side.  
I acknowledge that realistically, this is impractical. In this implementation, we need to assume total trust that the server won't store our private keys, be it storage or database. This helps us understand how the messages would be stored on an actual database.  
In reality, private keys should never be shared with the server.  

Looking ahead, I'll create a webapp implementing the E2EE, in the branch 'webapp', which could take a decent amount of time.

## API Documentation
My public Postman workspace - https://www.postman.com/bitorsic/workspace/bitorsic  
Read the API documentation at https://documenter.getpostman.com/view/25770153/2s946h8sHJ

## Installation
- Install the required node packages using `npm i`  
- Either install MongoDB locally, or use MongoDB Atlas, and create a database on it  

## Configuration
Create a file named `.env` in the directory as follows:
```
DB_URL="<URL to the database>"
LOGIN_KEY="<a random string>"
```

## Running the program
- Run the `index.js` file using `node index.js`  
- Access the endpoints by sending HTTP requests to http://localhost:3000/