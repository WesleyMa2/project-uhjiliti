# Uhjiliti REST API Documentation

### Authenticate

- description: signin with credentials
    returns a 401 status code if credentials don't match or username doesn't exist
- request: `POST /signin/`
    - content-type: `application/json`
    - body: object
      - username: (string) the signin username
      - password: (string) the password
- response: 200
    - content-type: `application/json`
    - body: user signed in
- response: 401
    - content-type: `application/json`
    - body: access denied
```
curl -H "Content-Type: application/json" -X POST -d '{"username":"alice","password":"alice"}' -c cookie.txt localhost:3000/signin/
```


- description: signup with credentials
    returns a 409 status code if credentials don't match or username doesn't exist
- request: `POST /signup/`
    - content-type: `application/json`
    - body: object
      - username: (string) the signin username
      - password: (string) the password
- response: 200
    - content-type: `application/json`
    - body: user signed up
- response: 409
    - content-type: `application/json`
    - body: username already exists
```
curl -H "Content-Type: application/json" -X POST -d '{"username":"alice","password":"alice"}' -c cookie.txt localhost:3000/signup/
```

- description: signout
    resets requestor's cookie
- request: `GET /signout/`
- response: 200
    - content-type: `application/json`
    - body: user signed out
```
curl -b cookie.txt -c cookie.txt http://localhost:3000/signout/
```