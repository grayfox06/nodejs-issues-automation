# nodejs-issues-automation

**Description:**<br>
Application to assign newly created issues to available agents. New issues will be automatically assigned to a free support agent. Support agents can only handle one issue at a time. Once the support agents resolves issue, issue is marked as resolved and the support
agent becomes available to get new issue. The system assigns unassigned issues automatically when a support agent becomes available.

**Tech Stack:**<br>
- Node.js
- SQLite
- Docker
- Postman

**How to run with Node.js:**<br>
- Clone the code to your hard drive from the repo
- Start the app from the project folder with: _'npm start'_
- Use Postman to test routes

**How to run with Docker:**<br>
- Clone the code to your hard drive from the repo
- Install and configure Docker
- Build the container from the project folder with: _'docker build -t nodejs-issues-automation .'_
- Run the image with: _'docker run -p 3000:3000 -d nodejs-issues-automation'_
- Use Postman to test routes

**How to use in Postman:**<br>
- Use Post New Issue route to create a new issue and assign it to free agent
- Use Get All Agents route to get a collection of all agents
- Use Get All Issues route to get a collection of all issues
- Use Resolve Issue By Id route to resolve a specific issue
- Use delete All Issues route to clear all issues from the DB

**Postman collection**:<br> 
- https://documenter.getpostman.com/view/14588037/2s9YC5wrzK
- Use Run in Postman button to use defined routes
