![Quote](https://github-readme-quotes.herokuapp.com/quote?theme=dark&animation=grow_out_in)

| Tests                                                                                                                                                                                                |                                                                                                                                                                                                     |                                                                                                                                                                                           |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dev                                                                                                                                                                                                  | QA                                                                                                                                                                                                  | Main                                                                                                                                                                                      |
| [![Python application](https://github.com/SKID-Fintech/mcro-backend/actions/workflows/backend.yml/badge.svg?branch=dev)](https://github.com/SKID-Fintech/mcro-backend/actions/workflows/backend.yml) | [![Python application](https://github.com/SKID-Fintech/mcro-backend/actions/workflows/backend.yml/badge.svg?branch=qa)](https://github.com/SKID-Fintech/mcro-backend/actions/workflows/backend.yml) | [![Python application](https://github.com/SKID-Fintech/mcro-backend/actions/workflows/backend.yml/badge.svg)](https://github.com/SKID-Fintech/mcro-backend/actions/workflows/backend.yml) |

## Setup Docker for Development Purposes Only

- Clone the repository <br/>
  `git clone https://github.com/SKID-Fintech/mcro-backend.git`

- Verify that your docker service is running and configured <br/>
  `docker-compose run hello-world`

- Start development server for all services <br/>
  `docker-compose up`

- Build the containers and processes required to start Docker (NOTE: This command should be used only once, when retrying to build the docker image/container please use `docker-compose up --build`)<br/>
  `docker-compose build`

## Using `docker-compose run` to issue one-off commands

If you want to run a one-off command, like installing dependencies, you can use the `docker-compose run <service_name> <cmd>`.

For example, to install a Javascript dependency and save that information to `package.json` we could run:
`docker-compose run --rm frontend npm install --save axios`

If you want to be on a shell for one of the Docker services, you can do something like:
`docker-compose run --rm frontend bash`

If you're not following these methods, then please don't forget to add the dependencies manually in package.json or requirements.txt. Thanks!

## Docker Compose Cheat Sheet

`docker run --rm -it --entrypoint=/bin/bash name-of-image` -> Enter the shell or OS of the 'name-of-image' to perform tasks. (For seasoned programmers only!) <br/>
`docker-compose start` -> Starts the containers in non-interactive mode <br/>
`docker-compose stop` -> Stop the containers <br/>
`docker-compose pause` -> Pause the containers execution <br/>
`docker-compose unpause` -> Resume the containers <br/>
`docker-compose ps` -> List all the containers and their info <br/>
`docker-compose up` -> Starts the container in interactive mode <br/>
`docker-compose down` -> Resets the containers and their data <br/>

`docker exec -ti docker-mslate_backend_1 /bin/bash` -> run this just because (after running docker-compose start)

``

##### The following commands need to taken very seriously

`docker system prune` -> Docker provides a single command that will clean up any resources — images, containers, volumes, and networks — that are dangling (not associated with a container) <br/>

`docker system prune -a` -> To additionally remove any stopped containers and all unused images (not just dangling images), add the -a flag to the command <br/>

![Quote](https://github-readme-quotes.herokuapp.com/quote?quoteCategory=programming)

# srifintech CMS Base

159.89.164.119

## Setup and installation

- [ ] Clone the repository <br/>
      `git clone git@github.com:SKID-Fintech/mcro-backend.git`

- [ ] Install required libraries and dependencies <br/>
      `sudo apt-get update -y && sudo apt-get install python3-pip python3-dev libpq-dev postgresql postgresql-contrib python3-venv nginx -y`

- [ ] Create Virtual Env <br/>
      `cd srifintech && python3 -m venv env`

- [ ] Activate Virtual Env <br/>
      `source env/bin/activate`

- [ ] Install dependencies <br/>
      `pip install wheel && pip install -r requirements.txt`

sudo chown -R ishant:ishant /var/lib/jenkins
sudo chown -R ishant:ishant /var/cache/jenkins
sudo chown -R ishant:ishant /var/log/jenkins

adduser username
usermod -aG sudo username

send db:

sudo scp -i /home/ishant/brand.pem /home/ishant/ishant_linux/srifintech/srifintech/db.sqlite3 sriraj@52.172.35.186:/home/sriraj/srifintech

sudo scp -i /home/ishant/brand.pem /home/ishant/ishant_linux/srifintech/srifintech/media.zip sriraj@52.172.35.186:/home/sriraj/srifintech

sudo scp -i /home/ishant/brand.pem sriraj@52.172.35.186:/home/sriraj/srifintech/db.sqlite3 /home/ishant/ishant_linux/srifintech/srifintech

scp /home/ishant/ishant_linux/sriraj/srifintech/srifintech/email.json sriraj@128.199.28.207:/home/sriraj/srifintech/srifintech

#### Production Branch

Setup gunicorn :

sudo nano /etc/systemd/system/main.service

[Unit]
Description=gunicorn daemon
After=network.target

[Service]
User=ishant
Group=www-data
WorkingDirectory=/home/ishant/builds/main
ExecStart=/home/ishant/builds/main/env/bin/gunicorn --access-logfile - --workers 3 --bind unix:/home/ishant/builds/main.sock backendapi.wsgi:application

[Install]
WantedBy=multi-user.target

> > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > nginx Setup:

sudo nano /etc/nginx/sites-available/main

server {
listen 80;
server_name api.skidfintech.com;

    location = /favicon.ico { access_log off; log_not_found off; }
    location /static/ {
        root /home/ishant/builds/main;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/home/ishant/builds/main.sock;
    }

    location /media/ {
        alias /home/ishant/builds/main/media/;
    }

}

sudo ln -s /etc/nginx/sites-available/main /etc/nginx/sites-enabled

#### QA Branch

Setup gunicorn :

sudo nano /etc/systemd/system/qa.service

[Unit]
Description=gunicorn daemon
After=network.target

[Service]
User=ishant
Group=www-data
WorkingDirectory=/home/ishant/builds/qa
ExecStart=/home/ishant/builds/qa/env/bin/gunicorn --access-logfile - --workers 3 --bind unix:/home/ishant/builds/qa.sock backendapi.wsgi:application

[Install]
WantedBy=multi-user.target

> > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > nginx Setup:

sudo nano /etc/nginx/sites-available/qa

server {
listen 80;
server_name qa-api.skidfintech.com;

    location = /favicon.ico { access_log off; log_not_found off; }
    location /static/ {
        root /home/ishant/build/qa;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/home/ishant/build/qa.sock;
    }

    location /media/ {
        alias /home/ishant/build/qa/media/;
    }

}

sudo ln -s /etc/nginx/sites-available/qa /etc/nginx/sites-enabled

#### DEV Branch

Setup gunicorn :

sudo nano /etc/systemd/system/dev.service

[Unit]
Description=gunicorn daemon
After=network.target

[Service]
User=ishant
Group=www-data
WorkingDirectory=/home/ishant/builds/dev
ExecStart=/home/ishant/builds/dev/env/bin/gunicorn --access-logfile - --workers 3 --bind unix:/home/ishant/builds/dev.sock backendapi.wsgi:application

[Install]
WantedBy=multi-user.target

> > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > nginx Setup:

sudo nano /etc/nginx/sites-available/dev

server {
listen 80;
server_name dev-api.skidfintech.com;

    location = /favicon.ico { access_log off; log_not_found off; }
    location /static/ {
        root /home/ishant/builds/dev;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/home/ishant/builds/dev.sock;
    }

    location /media/ {
        alias /home/ishant/builds/dev/media/;
    }

}

sudo ln -s /etc/nginx/sites-available/dev /etc/nginx/sites-enabled

#### To restart server

sudo pkill gunicorn
sudo systemctl daemon-reload
sudo systemctl start dev
sudo systemctl start qa
sudo systemctl restart dev.service

Test changes

sudo systemctl restart qa.service
sudo systemctl restart dev.service
sudo systemctl restart main.service
sudo systemctl restart nginx

sudo python3 manage.py collectstatic --no-input

> > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > >

CMS PANEL :

Products - Lexotique , kitchenji, etc - list of products - product x ( with the related fields , buy link )
Blogs - Lexotique , kitchenji, etc - list of blogs - blogs x ( with the related fields )
settings - Users - Name , Site ownership , username and email/pass ( create general admin , create executive ) - Lexotique - kitchenji - Madhuram

Settings - Site owners will have multiple selection of

Presentations:

Fresheys:
Web = https://docs.google.com/presentation/d/1lP4BtFX4kIW2gxr7FwuXHpxCKIaDnVkuIizkh-RHpc8/edit#slide=id.g966a22fd74_0_0
Mobile = https://docs.google.com/presentation/d/1jtG1jdyI6lg916VUsZMgMWnFDCgJquBZH0xYZiREY4I/edit

Lexotique:
Web = https://docs.google.com/presentation/d/1FRT00VIZJ7xr8YCDvPrVDcoSHlG9zcKeCezC2vNHHwk/edit?usp=sharing
Mobile = https://docs.google.com/presentation/d/1c0EECcwOZbK2mWitnevRsZa0wpzm1n0RJYg1Omr34cw/edit?usp=sharing

Cron command for emails

- - - - - /home/sriraj/srifintech/env/bin/python /home/sriraj/srifintech/manage.py send_queued_mail >> /home/sriraj/srifintech/send_mail.log 2>&1
