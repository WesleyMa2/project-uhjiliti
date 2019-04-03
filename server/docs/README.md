# Uhjiliti REST API Documentation

[Sign In](#sign-in)  
[Sign Up](#sign-up)  
[Sign Out](#sign-Out)  
[New Project](#new-project)  
[Add User to Project](#add-user-to-project)  
[Add User to Project](#add-user-to-project)  
[Add Column](#add-column)  
[Create a New Ticket](#create-a-new-ticket)  


## Authenticate
### Sign in
- description: sign in with credentials  
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
    curl -d '{"username":"Test Username", "password":"123"}' -H "Content-Type: application/json" -X POST https://www.uhjiliti.me/api/auth/signin/
    ```

### Sign Up
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
    curl -d '{"username":"Test Username", "password":"123", "name":"Test Name"}' -H "Content-Type: application/json" -X POST https://www.uhjiliti.me/api/auth/signup/
    ```

### Sign Out
- description: signout
    resets requestor's cookie
- request: `GET /api/auth/signout/`
- response: 200
    - content-type: `application/json`
    - body: user signed out
    ```
    curl -b cookie.txt -c cookie.txt https://www.uhjiliti.me/api/auth/signout/
    ```

## Projects

### New Project
- description: make a new project   
    returns a 422 if invalid parameters  
    returns a 409 if there is a name conflict with another project  
- request: `POST /api/projects`
    - content-type: `application/json`
    - body: object
        - name: (string) the name of the project to create
        - description: (string) a small description of the project
- response: 200
    - content-type: `application/json`
    - body: object
        - \_id: (string) the provided name of created project
        - members: (list of usernames) list of members that are a part of the project (will contain only the creator of the project initially)
        - description: (string) the provided description of the created project
        - columns: (list of strings) the names of the columns in the project into which tickets are organized (initially empty)
        - tickets: (list of ticket ids) the ids of the tickets that the project contains (initially empty)
-response: 409
    - another project with that name already exists
- response: 500
    - internal server error
    ```
    curl -d '{"name":"cool ass project", "description":"my first project"}' -H "Content-Type: application/json" -b cookie.txt -X POST https://www.uhjiliti.me/api/projects/
    ```

### Add User to Project
- description: add a user to a project by username  
    returns a 401 if you're not a member of the speficied project  
    returns a 422 if invalid parameters  
    returns a 404 if project or user cannot be found  
    returns a 409 if user is already a member of the project  
- request: `POST /api/projects/PROJECTID/user`
    - content-type: `application/json`
    - body: object
        - username: (string) the username of the user to add to the project
- response: 200
    - content-type: `application/json`
    - body: updated `project` object
        - \_id: (string) the provided name of the project
        - members: (list of usernames) updated list of members that are a part of the project
        - description: (string) the provided description of the created project
        - columns: (list of strings) the names of the columns in the project into which tickets are organized
        - tickets: (list of ticket ids) the ids of the tickets that the project contains
- response: 422
    - content-type: `application/json`
    - body: list of `error` objects
        - location: (string) where the invalid parameters is in the http request (will always be `body`)
        - param: (string) which key in the request body had an invalid value
        - msg: (string) error message describing invalid reason for invalid parameter
- response: 404
    - provided username doesn't exist
- response: 409
    - provided username is already a member of the project
- response: 401
    - requesting user is not a part of the provided project
- response: 500
    - internal server error
    ```
    curl -d '{"username":"alice"}' -H "Content-Type: application/json" -b cookie.txt -X POST https://www.uhjiliti.me/api/projects/cool%20ass%20project/user
    ```

### Add Column
- description: add a column to a project board  
    returns a 404 if project doesn't exist  
    returns a 422 if invalid parameters  
- request: `POST /api/projects/PROJECTID/columns`
    - content-type: `application/json`
    - body: object
        - columnName: (string) name of the column to add
- response: 200
    - content-type: `application/json`
    - body: updated `project` object that the column was added to
        - \_id: (string) the provided name of the project
        - members: (list of usernames) updated list of members that are a part of the project
        - description: (string) the provided description of the created project
        - columns: (list of strings) the names of the columns in the project into which tickets are organized
        - tickets: (list of ticket ids) the ids of the tickets that the project contains
- response: 404
    - url-specified project name doesn't exist
- response: 422
    - content-type: `application/json`
    - body: list of `error` objects
        - location: (string) where the invalid parameters is in the http request (will always be `body`)
        - param: (string) which key in the request body had an invalid value
        - msg: (string) error message describing invalid reason for invalid parameter
```
curl -d '{"columnName":"ToDo"}' -H "Content-Type: application/json" -b cookie.txt -X POST https://www.uhjiliti.me/api/projects/cool%20ass%20project/columns
```

## Tickets

### Create a New Ticket
- description: add a ticket to a project  
    returns a 422 if invalid parameters  
    returns a 404 if project can't be found  
    returns a 409 if requesting user or assignee or any watcher not a member of the project  
- request: `POST /api/projects/PROJECTID/columns/COLUMNID/tickets`
    - content-type: `application/json`
    - body: object
        - title: (string) title of the ticket
        - description: (string) description of the ticket
        - dueDate: (Date) date the ticket is due
        - assignee: (string) username of the member this ticket should be assigned to
        - watchers: (list of strings) list of usernames of members watching this ticket
- response: 200
    - content-type: `application/json`
    - body: `ticket` object that was created
        - \_id: (string) id of the ticket
        - dueDate: (Date) date the ticket is due
        - watchers: (list of strings) list of usernames of members watching this ticket
        - title: (string) title of the ticket
        - description: (string) description of the ticket
        - column: (string) the column that the ticket belongs to
        - project: (string) the project that the ticket belongs to
        - assignee: (string) username of the member this ticket is assigned to
- response: 422
    - content-type: `application/json`
    - body: list of `error` objects
        - location: (string) where the invalid parameters is in the http request (will always be `body`)
        - param: (string) which key in the request body had an invalid value
        - msg: (string) error message describing invalid reason for invalid parameter
- response: 404
    - project can't be found
- response: 409
    - one or more of requesting user, assignee or watchers is not a member of the project 
- response: 500
    - internal server error
    ```
    curl -d '{"title":"ticket1", "description":"my first ticket", "dueDate": "2019-04-03", "assignee": "alice", "watchers": ["Bob"]}' -H "Content-Type: application/json" -b cookie.txt -X POST https://www.uhjiliti.me/api/projects/cool%20ass%20project2/columns/TODO/tickets
    ```

