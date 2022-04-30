# Description
This app was developed as a part of BANKSapi Coding Challenge

## Install
1. Clone this repo
`git clone https://github.com/dalyonushkin/BANKSApi-coding-challenge-server.git`
or
`git clone git@github.com:dalyonushkin/BANKSApi-coding-challenge-server.git`
2. Change current folder to app
`cd BANKSApi-coding-challenge-server`
3. Install dependencies
`npm install`
4. Run app
`npm start`
5. You can reach app at http://localhost:3003

## Testing
Run unit test
`npm test`
You can found code coverage report at  `coverage/lcov-report/index.html`

## Endpoints

### Get all records
`GET` request to `/transfers`
Example:
```curl -X GET \

'http://localhost:3003/transfers' \

--header 'Accept: application/json' \

--header 'User-Agent: Thunder Client (https://www.thunderclient.com)'

```

### Add new record
`POST` request to `/transfers` with JSON object containing  `transferId` and `transfer`
Example:
```curl -X POST \

'http://localhost:3003/transfers' \

--header 'Accept: application/json' \

--header 'User-Agent: Thunder Client (https://www.thunderclient.com)' \

--header 'Content-Type: application/json' \

--data-raw '{

"transferId":"3b",

"transfer":{

"amount": 18000,

"date": "2020-12-15",

"iban": "DE12500105170648489890",

"accountHolder": "George Doe (backend)",

"note": "Contrary to popular belief, Lorem Ipsum is not simply random text."

}

}'

```

### Update record
`PUT` request to `/transfers` with JSON object containing  `transferId` and `transfer`
Example:
```curl -X PUT \

'http://localhost:3003/transfers' \

--header 'User-Agent: Thunder Client (https://www.thunderclient.com)' \

--header 'Accept: application/json' \

--header 'Content-Type: application/json' \

--data-raw '{

"transferId":"3b",

"transfer":{

"amount": 18,

"date": "2020-12-15",

"iban": "DE12500105170648489890",

"accountHolder": "George Doe (backend)",

"note": "Contrary to popular belief, Lorem Ipsum is not simply random text."

}

}'

```

### Delete record
`DELETE` request to `/transfers` with JSON object containing  `transferId` 
Example:
```curl -X DELETE \

'http://localhost:3003/transfers' \

--header 'User-Agent: Thunder Client (https://www.thunderclient.com)' \

--header 'Accept: application/json' \

--header 'Content-Type: application/json' \

--data-raw '{

"transferId":"3b"

}'

```