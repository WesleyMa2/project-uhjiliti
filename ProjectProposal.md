
# Project Proposal 
## Project Name: Uhjiliti
## Members
Edgar Sarkisian, Joey Sokolon, Wesley Ma
## Description
A Project management app that combines a ticketing system, video chat, messaging, and other features commonly used in development projects (scrum poker, project board, etc).

## Features:
### To be completed by Beta version:
- Projects setup and user invites
    - allow users to make new project, invite other users to the project by email
    - tickets will be associated with projects
- Ticket management system 
    - like trello board
    - an item in a list can be classified as a story, task or bug
    - items can refer to other items (eg. stories can refer to 3 tasks)
- Video chat 
    - Any user can create a team meeting which calls everyone in project (multi video call)
    - Supports video and audio, using WebRTC and p2p connections. 
- Messaging with multiple channels
    - Each project will have multiple text channels where users can coordinate work or plan new features for the project. The text channels will support embedded code, images and emoticons. 
### To be completed by Final version:
- Tickets have deadlines
    - Tickets can have target completion dates.
    - If ticket isn't complete by the deadline, it becomes overdue.
    - Overdue tickets change in appearance and appear at the top of the chart.  
- Scrum poker
    - everyone is given a set time to choose a number
    - after time runs out, everyone sees the results
- Video Chat
    - calls everyone involved with ticket

### Nice to have features
- Electron conversion (Desktop App)
- Burndown charts
- Notifications for users watching tasks

## Technologies
- MongoDB
- React frontend
- Express backend
- Web RTC (for chat and video)
- Electron (potentially)
- ChartJS (potentially)

## Technical Challenges
1. Converting from web app to electron app
2. Video Chat using WebRTC, supporting multiple users
3. Implementing complex UI
4. Organizing and storing our data
5. Support for different datatypes (embedded code, images, emoticons) in chat and tickets
