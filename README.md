# Playzala App

## Game Name :- Speed Typing Game

## Hackathon Name :- Code Brewers ( By : Tally Solutions )

## Instructions :-

1. Download the zip folder or clone the git repo.
   a. Create a .env file in the backend folder.
   b. Populate it with variables
   1. DB_URI = "Your MongoDB URL"
   2. PORT = 4000 , make it 4000 as frontend will be running on 3000
2. cd into backend and run -- npm i
3. Then run -- npm start to start the Server
4. cd into fronted and run -- npm i
5. Then run -- npm run dev to start the App
6. Now you need to add Challenges to the the App, Open Postman, use JSON
   Eg :-
   {
   "text": "Write Sentence here",
   "difficulty": "easy",
   }

   Send it as a POST request to the URL :- http://localhost:4000/api/challenge on your computer.

7. Now you can go to localhost:3000 and use the Game.
