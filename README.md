# NearChat

Web app for chatting with people near you.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.


### Prerequisites

You are going to need **Node.js**, **npm** and **MongoDB** installed on your machine.

```
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt install -y nodejs
For mongodb visit - https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/
```

### Installing

How to properly install and configure NearChat to work on your machine.

Cloning the repository

```
git clone ...
```

Enter NearChat directory

```
cd NearChat/
```
Enter Backend directory and do npm install

```
cd NearChat/Backend && npm install --save
```
Enter Frontend directory and do npm install

```
cd NearChat/Frontend/frontend && npm install --save
```

## Starting NearChat on your machine

You will need to run Backend & Frontend seperately, ports are already configured, make sure you don't conflict them if you change anything.

Enter Frontend directory and do npm start

```
cd NearChat/Frontend/frontend && npm start
```
Enter Backend directory and do npm run dev

```
cd NearChat/Backend && npm run dev
```

Now you can load localhost:3000 in your browser and use the app.

## Built With

* [React](https://reactjs.org/) - Frontend javascript library 
* [Redux](http://redux.js.org/) - Javascript library used to manage state
* [Socket.io](https://socket.io/) - Javascript Real-time engine used to send and receive messages
* [Node](https://nodejs.org/en/) - Backend framework
* [Express](https://expressjs.com/) - Node.js web application framework

## Authors

* **Antonio Erdeljac** - *Initial work* - [NearChat](https://github.com/AntonioErdeljac)

See also the list of [contributors](https://github.com/AntonioErdeljac/NearChat/graphs/contributors) who participated in this project.

## Acknowledgments

* NearChat is a practice for my upcoming project using the same technologies


