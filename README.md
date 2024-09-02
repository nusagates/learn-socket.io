# Learning Socket.IO with Express and MySQL

This repository is dedicated to learning and experimenting with Socket.IO, Express, and MySQL. The project includes examples and exercises to help you understand the core concepts and features of these technologies, such as:

- Setting up a basic Socket.IO server and client
- Handling events and messages
- Broadcasting messages to multiple clients
- Integrating with Express.js
- Implementing real-time features in web applications
- Connecting to a MySQL database and performing queries

## Project Structure

- `index.js`: Main server file that sets up Express, Socket.IO, and MySQL connections.
- `functions.js`: Contains utility functions used across the project.
- `.gitignore`: Specifies files and directories to be ignored by Git.

## Getting Started

### Prerequisites

- Node.js
- npm (Node Package Manager)
- MySQL

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/nusagates/learn-socket.io.git
    ```
2. Navigate to the project directory:
    ```sh
    cd learn-socket.io
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```

### Configuration

1. Update the MySQL connection settings in `index.js` to match your database configuration:
    ```javascript
    const con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "your_database_name"
    });
    ```

### Running the Application

1. Start the server:
    ```sh
    node index.js
    ```
2. Open your browser and navigate to `http://localhost:3000` to see the application in action.

## Usage

- The server listens for HTTP requests and WebSocket connections.
- Use the `/` endpoint to query the MySQL database and retrieve user records.
- Use WebSocket events to send and receive real-time messages and queries.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.