## Installation
First you must generate an RS256 key, you can use the following snippet:

```
openssl genrsa -des3 -out private.pem 4096
// Enter and confirm password when prompted
openssl rsa -in private.pem -outform PEM -pubout -out public.pem
// Move public.pem file to ros/keys folder
mkdir ros/keys
mv public.pem ros/keys/public.pem
// Move private.pem to node/src folder
mv private.pem node/src/private.pem
```

After that, create a `docker-compose.override.yml` file on the project root folder and configure the enviroment variables:

```
version: '3.3'

services:
  ros:
    ports:
      - "9080:9080"
    environment:
      - FEATURE_TOKEN=<YOUR-REALM-FEATURE-TOKEN>
  node:
    ports:
      - "3000:3000"
    environment:
      - JWT_PASSPHRASE=<PASSPHRASE-USED-TO-GENERATE-PRIVATE.PEM>
      - PORT=3000
      - ROS_HOST=ros
      - ROS_PORT=9080
      - REALM_CONTENT_NAME=/content
```
Replace FEATURE_TOKEN and JWT_PASSPHRASE variables with real values,
and finally you can run `docker-compose up`

Go to `http://localhost:9080` in your browser to see if its working
