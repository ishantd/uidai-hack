
## Setup and installation for Dev Branch
![Quote](https://github-readme-quotes.herokuapp.com/quote?theme=dark&animation=grow_out_in&quoteCategory=fun)

- [ ] Clone the repository <br/>
      `git@github.com:Mslate-ai/docker-mslate.git`

- [ ] Install required libraries and dependencies  [ONLY FOR LINUX] <br>
        `sudo apt-get update -y && sudo apt-get install python3-pip python3-dev libpq-dev postgresql postgresql-contrib python3-venv nginx npm -y`


- [ ] Create Virtual Env <br/>
      `cd mslate && python3 -m venv env`

- [ ] Activate Virtual Env <br/>
      `source env/bin/activate`

- [ ] Install dependencies <br/>
      `pip3 install wheel && pip3 install -r requirements.txt`

- [ ] Install dependencies [NPM] <br/>
      `cd frontendjs && npm install`

- [ ] Build Frontend <br/>
      `npm run build`

- [ ] Setup Postgres Database on your OS, create a new db under postgres user and name it mslate_dev<br/>

- [ ] Return to project Root Directory <br/>
      `cd ..`

- [ ] Run django migrations <br/>
      `python3 manage.py makemigrations`

- [ ] Migrate changes to Database <br/>
      `python3 manage.py migrate`

- [ ] Create Default db<br/>
      `python manage.py init_db`

- [ ] Finally ask for the credential file from one of the team members
      and save it inside backendapi/settings/creds/[SECRET_KEY_FILE]
<br/>

pg_dumpall > pg_backup.bak
psql -f pg_backup.bak postgres


Setup gunicorn :

sudo nano /etc/systemd/system/dev.service


[Unit]
Description=gunicorn daemon
After=network.target

[Service]
User=mslate
Group=www-data
WorkingDirectory=/home/mslate/builds/dev/mslate/mslate-backend
ExecStart=/home/mslate/builds/dev/mslate/mslate-backend/env/bin/gunicorn --access-logfile - --workers 3 --bind unix:/home/mslate/builds/dev/dev.sock backendapi.wsgi:application

[Install]
WantedBy=multi-user.target

>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
nginx Setup:

sudo nano /etc/nginx/sites-available/dev


server {
    listen 80;
    server_name dev.mslate.ai;

    location = /favicon.ico { access_log off; log_not_found off; }
    location /static/ {
        root /home/mslate/builds/dev/mslate/mslate-backend;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/home/mslate/builds/dev/dev.sock;
    }

    location /media/ {
        alias /home/mslate/builds/dev/mslate/mslate-backend/media/;
    }
}

sudo ln -s /etc/nginx/sites-available/dev /etc/nginx/sites-enabled

Setup gunicorn :

sudo nano /etc/systemd/system/qa.service


[Unit]
Description=gunicorn daemon
After=network.target

[Service]
User=mslate
Group=www-data
WorkingDirectory=/home/mslate/builds/qa/mslate/mslate-backend
ExecStart=/home/mslate/builds/qa/mslate/mslate-backend/env/bin/gunicorn --access-logfile - --workers 3 --bind unix:/home/mslate/builds/qa/qa.sock backendapi.wsgi:application

[Install]
WantedBy=multi-user.target

>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
nginx Setup:

sudo nano /etc/nginx/sites-available/qa


server {
    listen 80;
    server_name qa.mslate.ai;

    location = /favicon.ico { access_log off; log_not_found off; }
    location /static/ {
        root /home/mslate/builds/qa/mslate/mslate-backend;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/home/mslate/builds/qa/qa.sock;
    }

    location /media/ {
        alias /home/mslate/builds/qa/mslate/mslate-backend/media/;
    }
}

sudo ln -s /etc/nginx/sites-available/qa /etc/nginx/sites-enabled

Setup gunicorn :

sudo nano /etc/systemd/system/main.service


[Unit]
Description=gunicorn daemon
After=network.target

[Service]
User=mslate
Group=www-data
WorkingDirectory=/home/mslate/builds/main/mslate/mslate-backend
ExecStart=/home/mslate/builds/main/mslate/mslate-backend/env/bin/gunicorn --access-logfile - --workers 3 --bind unix:/home/mslate/builds/main/main.sock backendapi.wsgi:application

[Install]
WantedBy=multi-user.target

>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
nginx Setup:

sudo nano /etc/nginx/sites-available/main


server {
    listen 80;
    server_name mslate.ai www.mslate.ai;

    location = /favicon.ico { access_log off; log_not_found off; }
    
    location /static/ {
        root /home/mslate/builds/main/mslate/mslate-backend;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/home/mslate/builds/main/main.sock;
    }

    location /media/ {
        alias /home/mslate/builds/main/mslate/mslate-backend/media/;
    }
}

sudo ln -s /etc/nginx/sites-available/main /etc/nginx/sites-enabled

cd mslate/mslate-backend

sudo chown -R mslate:mslate /var/lib/jenkins
sudo chown -R mslate:mslate /var/cache/jenkins
sudo chown -R mslate:mslate /var/log/jenkins

check github

#### To restart server
sudo pkill gunicorn
sudo systemctl daemon-reload
sudo systemctl start dev
sudo systemctl start qa
sudo systemctl start main
sudo systemctl restart qa.service
sudo systemctl restart main.service
sudo systemctl restart dev.service
sudo systemctl restart nginx


sudo systemctl restart main.service
sudo systemctl restart qa.service
sudo systemctl restart dev.service
sudo systemctl restart nginx

sudo python3 manage.py collectstatic --no-input


#### Crontabs

To remove pending appointments: 

Every Day at 01:00 AM

0 01 * * * python3 /home/mslate/builds/main/mslate/mslate-backend/manage.py close_orphan_appointments >> /home/mslate/logs/close_appointments.log 2>&1

aws s3 rm s3://mslatelogs/django/debug.log && aws s3 cp /home/mslate/builds/main/logs/debug.log s3://mslatelogs/django/ >> /home/mslate/logs/s3.log 2>&1
