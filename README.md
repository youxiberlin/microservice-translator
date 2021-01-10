# Lengoo Coding challenge

**Requirement**　

NodeJS newer than v12.14.1

## How to run the application

1. Clone this repository locally
2. Install all the dependencies at root directory
```
$ yarn install:all

# or 

$ npm run install:all
```
**NOTE:** `yarn install` or `npm run install` does not install all the dependencies of micro servicies. Please make sure to use `install:all`

3. Set environment variables

To run the application, please sent the following environment variables at root directory.
```
AMQP_URL='' // required: to connect AMQP Ex.) 'amqps://xxxxx'
MAIL_HOST='' // required: to send email Ex.) smtp.mailtra.io
MAIL_PORT='' // required
MAIL_USER='' // required
MAIL_PASS='' // required
GATEWAY_PORT='' // optional: default is set to 3000
TRANSLATOR_PORT='' // optional: default is set to 3001
MAILER_PORT='' // optional: default is set to 3002
TMS_PORT='' // optional: default is set to 3003
DEV_MAILSENDER='' // Please set an email address to use as a sender of email
DEV_MAILRECIPIENT='' // optional: recipient email address to send the test email to
```

3. Run all the micro services
I used PM2 to manage the process. If you have not installed PM2, [please install it](https://pm2.keymetrics.io/docs/usage/quick-start/).
```
$ yarn start

# or 

$ npm run start
```

4. Stop all the processes
```
$ yarn stop

# or 

$ npm run stop
```

**NOTE:** Alternatively, you can run each micro service by running `yarn start` or `npm run start` under the directory of each service. 

Example:
To run only `gateway` service
```
cd ./gatweay
yarn start or npm run start
```

## Usage for client

### To upload a text file for translation
To upload a file which you want to be translated, please send `POST` request to a following endpoint. 

**Endpoint** 

`http://localhost:${GATEWAY_PORT}/data/upload`

**Required keys** 

`email` : your email address - This will be the destination to send the translation result to 

`subtitle-text`: The text file that you want to be translated

Content-type: multipart/form-data

Example of a `POST` request:
```
curl -X POST \
  -H "Content-Type: multipart/form-data" \
  -F "email=yuki@mail.com" \
  -F "subtitle-text=@/Users/yukisato/Desktop/lengoo.txt" \
  http://localhost:3000/data/upload
```

or with Postman: 

![postman](./assets/posman-example1.png)

**NOTE:** The file must to be a text file and the content must follow the following format.

Example of a text file `lengoo.txt`
```
1 [00:00:12.00 - 00:01:20.00] Hello World
2 [00:03:55.00 - 00:04:20.00] Hello guys.
3 [00:04:59.00 - 00:05:30.00] I walk to the supermarket.
```

After you send the `POST` request, you should receive an email with the text file that has the result of the translation.

### To import a dictionary data
To import a dictoinary data which you want to add to TMS, please send `POST` request to a following endpoint. 

**Endpoint** 

`http://localhost:${TMS_PORT}/data`

**Requirement** 

Data: The data needs to be a JSON object that has all of these keys: `source`, `target`, `sourceLanguage`, `targetLanguage` 

Content-type: application/json

Example of a dictionary data:
```
  {
    "source": "I walk to the supermarket",
    "target": "Ich gehe zum Supermarkt.",
		"sourceLanguage": "en",
		"targetLanguage": "de"
  }
```

Example of a `POST` request
```
curl --header "Content-Type: application/json" \
--request POST \
--data '{"source": "I walk to the supermarket", "target": "Ich gehe zum Supermarkt.","sourceLanguage": "en", "targetLanguage": "de"}' \
http://localhost:3003/data
```

## How to run tests



If you have any questions, please drop me a line at sato.youxi@gmail.com

Yuki 
