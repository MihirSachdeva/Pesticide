# Pesticide

## A clean and feature-rich project-management and bug-tracking app.

Backend written in [Django](https://www.djangoproject.com), with [DjangoREST](https://www.django-rest-framework.org) for APIs.

Frontend written in [React](https://reactjs.org/), with [Material-UI](https://material-ui.com/) and [Redux](https://react-redux.js.org/)

Made for [IMG IIT Roorkee](https://img.channeli.in) Developers' Summer Project of 2020.

## Make Pesticide Your Own!

### Clone this repository
Open your terminal in a folder of your choice (where you would want to store your repository.) For example, if you want to clone this project in the Home (~) directory, enter the following command:

```bash
user@system:~$ git clone https://github.com/mihirsachdeva/pesticide.git
```

Then move to the newly formed directory called `pesticide`
```base
user@system:~$ cd pesticide
```

## Set Up The Codebase

### Set Up The Django Backend

#### Create a virtual environment inside [pesticide_backend](pesticide_backend) directory with venv and activate it

```bash
user@system:~/pesticide$ cd pesticide_backend
user@system:~/pesticide/pesticide_backend$ python3 -m venv env
user@system:~/pesticide/pesticide_backend$ source env/bin/activate
```
#### Install required Python packages from [requirements.txt](pesticide_backend/requirements.txt)

Use the Python package manager [PIP3](https://pip.pypa.io/en/stable/) to install all required python packages from [requirements.txt](pesticide_backend/requirements.txt):

```bash
(env) user@system:~/pesticide/pesticide_backend$ pip3 install -r requirements.txt
```
The `(env)` in the command line indicates that our virtual environment `env` is active.

#### Set up the Django database
First set up your preferred database in [settings.py](pesticide_backend/src/pesticide/settings.py) (like MySQL, PostgreSQL, etc.) Default is SQLite3. After that, to set up the database on your local system:

```bash
(env) user@system:~/pesticide/pesticide_backend$ cd src/
(env) user@system:~/pesticide/pesticide_backend/src$ python3 manage.py makemigrations
(env) user@system:~/pesticide/pesticide_backend/src$ python3 manage.py migrate
```

#### Start a Redis server
We will use a channel layer that uses Redis as its backing store. You must have [Docker](https://docs.docker.com/engine/install/) installed in your system. To start a Redis server on port 6379, run the following command:

```bash
(env) user@system:~/pesticide/pesticide_backend$ docker run -p 6379:6379 -d redis:5
```

### Set Up The React Frontend

#### Install all required npm packages:

```bash
user@system:~/pesticide/pesticide_frontend$ npm install --save
```

## Configuration

Fill up the required fields in pesticide in the file [base_template.yml](pesticide_backend/src/config/base_template.yml) and then change the file's name from `base_template_yml` to `base.yml`.

### **keys**
| key | meaning |
|-----|---------|
| secret_key | Secret key required in [settings.py](pesticide_backend/src/pesticide/settings.py) (50 characters) |
| client_id | Client ID you obtained from the  Omniport Channel i dashboard |
| client_secret | Client secret key you obtained from Omniport Channel i dashboard |
| redirect_uri | One of the redirect URIs you have registered on the Omniport Channel i dashboard  |
| desired_state | Any string that you want the `REDIRECT_URI` to receive on success  |

### services > **email**

| key | meaning |
|-----|---------|
| email_host | Your emailing service host (like Google's `smtp.gmail.com`)  |
| email_port | Your emailing service port (like `587`) |
| email_host_user | Your emailing service email id  |
| email_host_password | Your emailing service account password  |

### services > **database**

| key | meaning |
|-----|---------|
| host | Your database host  |
| port | Your database port  |
| user | Your database user's username  |
| password | Your database user's password  |
| name | Database name  |

## Usage

### Start the Django Server:
```bash
(env) user@system:~/pesticide/pesticide_backend/src$ python3 manage.py runserver
```

### Start the React Frontend Server:
```bash
user@system:~/pesticide/pesticide_frontend$ npm start
```
Then head over to 127.0.0.1:3000 to start using the app!


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.