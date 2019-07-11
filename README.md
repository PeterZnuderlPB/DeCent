# DjangoApp

## Dependncies
* NodeJS (ReactJS) - Frontend
* Python3, Django - Backend

## Installation & Setup
### Frontend
* Download and install NodeJS https://nodejs.org/en/download/
* Navigate to frontend folder, run `npm install`, `npm start` in command line
### Backend
* Download and install Python3 https://www.python.org/downloads/
* Install Django by running `pip install Django` in command line
* Navigate to backend -> core folder, run `pip install -r "../requirements.txt"` in command line
* Download and install https://weasyprint.readthedocs.io/en/latest/install.html#windows
* Run `python manage.py makemigrations`, `python manage.py migrate` in command line
* Run `python manage.py createsuperuser` in command line, fill in the information
* Run `python manage.py runserver` to start the server
* Open up Chrome, navigate to `http://127.0.0.1:8000/admin` and login with your superuser
* Add new application to Django Oauth Toolkit, select your user, copy settings from the image below
<details>
  <summary>Settings</summary>
  ![Application settings](https://i.imgur.com/M7frBEh.png)
</details>
