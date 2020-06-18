# Pesticide

A clean and feature-rich project-management and bug-tracking app.

Backend written in [Django](https://www.djangoproject.com), with [DjangoREST](https://www.django-rest-framework.org) for APIs.

Frontend written in [React](https://reactjs.org/) with [Material-UI](https://material-ui.com/) and [Redux](https://react-redux.js.org/)

Made for [IMG IIT Roorkee](https://img.channeli.in) Developers' Summer Project of 2020.

## Set Up The Codebase

### Set Up The Django Backend

#### Create a virtual environment with venv

```bash
user@system:~/pesticide/pesticide_backend$ python3 -m venv env
user@system:~/pesticide/pesticide_backend$ source env/bin/activate
```
#### Install required Python packages from requirements.txt

Use the Python package manager [PIP3](https://pip.pypa.io/en/stable/) to install all required python packages:

```bash
user@system:~/pesticide/pesticide_backend$ pip3 install -r requirements.txt
```
#### Set up the Django database
First set up your preferred database in settings.py. Default is SQLite. Then set up the database on your local system:

```bash
user@system:~/pesticide/pesticide_backend$ cd src/
user@system:~/pesticide/pesticide_backend/src python3 manage.py makemigrations
user@system:~/pesticide/pesticide_backend/src python3 manage.py migrate
user@system:~/pesticide/pesticide_backend/src python3 manage.py runserver
````
### Set Up The React Frontend

#### Install all required npm packages:

```bash
user@system:~/pesticide/pesticide_frontend$ npm install --save
```

## Usage

### Start the Django Server:
```bash
user@system:~/pesticide/pesticide_backend/src$ python3 manage.py runserver


### Start the React Frontend Server:
```bash
user@system:~/pesticide/pesticide_frontend$ npm start
```
Then head over to 127.0.0.1:3000 to start usinng the app.


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.