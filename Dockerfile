# init a base image (Alpine is small Linux distro)
FROM python:3.10-alpine
# update pip to minimize dependency errors 
RUN pip install --upgrade pip
# define the present working directory
WORKDIR /docker-flask-test
# copy the contents into the working dir
ADD . /docker-flask-test
# run pip to install the dependencies of the flask app
RUN pip install -r requirements.txt

WORKDIR flask_server

EXPOSE 5000
# define the command to start the container
CMD ["python","app.py"]
