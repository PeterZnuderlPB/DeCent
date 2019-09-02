# DeCent

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
* Navigate to `backend->core` folder, run `pip install -r "../requirements.txt"` in command line
* Download and install https://weasyprint.readthedocs.io/en/latest/install.html#windows
* Run `python manage.py makemigrations`, `python manage.py migrate` in command line
* Run `python manage.py createsuperuser` in command line, fill in the information
* Run `python manage.py runserver` to start the server
* Open up Chrome, navigate to `http://127.0.0.1:8000/admin` and login with your superuser
* Add new application to Django Oauth Toolkit, select your user, copy settings from the image below
![Application settings](https://i.imgur.com/M7frBEh.png)
* Copy the `client id` and `client secret` from application, open `frontend->src->apis->index.js`
* Replace your client id and client secret with 
```
export const django_client_id = "t5Atz5P7YfpN0Ul2cDUWbAwMwjQfCfza5GmagZZu";
export const django_client_secret =
  "FUTJYMX0xGp22rBHitfcL747Yypg3nf79azyyfITHjqueee6E6sBVeU4bwh8EBSDLPCbMKlTHTBasrvLw7tQxVullWYPY505OYI6qDMXNEM16gBp4GCcrlp5D5vb2T6N";
```
* Save the changed file, restart React app and login to the webapp with your superuser. 
If erver says that you are unauthorised at login and you know you've put in the corect credentials, theres something wrong with this information.
