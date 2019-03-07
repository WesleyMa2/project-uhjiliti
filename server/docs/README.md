# Uhjiliti REST API Documentation

### Authenticate

- description: signin with credentials
    returns a 404 if request is missing parameters
    returns a 401 status code if credentials don't match or username doesn't exist
- request: `POST /api/auth/signin/`
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
- response: 404
    - content-type: `application/json`
```
curl -H "Content-Type: application/json" -X POST -d '{"username":"alice","password":"alice"}' -c cookie.txt localhost:4000/api/auth/signin/
```


- description: signup with credentials
    returns a 404 if request is missing parameters
    returns a 409 already someone with that username
- request: `POST /api/auth/signup/`
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
- response: 404
    - content-type: `application/json`
```
curl -H "Content-Type: application/json" -X POST -d '{"username":"alice","password":"alice"}' -c cookie.txt localhost:4000/api/auth/signup/
```

- description: signout
    resets requestor's cookie
- request: `GET /api/auth/signout/`
- response: 200
    - content-type: `application/json`
    - body: user signed out
```
curl -b cookie.txt -c cookie.txt http://localhost:4000/api/auth/signout/
```

### Projects

- description: make a new project 
    returns a 422 if invalid parameters
    returns a 401 if you don't have permission
- request: `POST /api/projects`
- TODO: finish
```
curl -d '{"name":"cool ass project", "description":"my first project"}' -H "Content-Type: application/json" -b cookie.txt -X POST http://localhost:4000/api/projects/
```

### Tickets

- description: adds a new ticket to the specified project
    returns a 422 if invalid parameters
    returns a 401 if you don't have permission
- request: `POST /api/projects/PROJECTID/tickets`
- TODO: finish
```
curl -d '{"title":"ticket1", "description":"my first ticket"}' -H "Content-Type: application/json" -b cookie.txt -X POST http://localhost:4000/api/projects/cool%20ass%20project2/tickets
```