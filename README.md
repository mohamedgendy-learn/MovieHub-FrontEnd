# MoviesHub API

This document describes the API for the MoviesHub application, which provides functionality for managing and accessing movie data.

## Base URL

[`http://localhost:8080/api/movies`]

## Authentication

The API uses .

-   **Login:**
    -   Endpoint: `[POST /login]`
    -   Description: Authenticates a user and returns a token and user information.
    -   Request:
        ```json
        {
            "userName": "[username]",
            "password": "[password]"
        }
        ```
    -   Response:
        ```json
        {
            "token": "[access_token]",
            "role": "[user_role, e.g., ROLE_USER, ROLE_ADMIN]",
             "userId": 123
        }
        ```
    -   Error Codes:
        -   `[e.g., 401 Unauthorized]`

## Endpoints

### Movies

-   **Get all movies:**
    -   Endpoint: `[GET /movies]`
    -   Description: Retrieves a list of movies from the database.
    -   Authentication: Required for all users.
    -   Response:
        ```json
        [
            {
                "imdbID": "[imdbID]",
                "title": "[title]",
                "year": "[year]",
                "poster": "[poster]"
            },
            ...
        ]
        ```
    -   Error Codes:
        -   `[e.g., 500 Internal Server Error]`
-   **Get movie details:**
    -   Endpoint: `[GET /movies/{imdbID}]`
    -   Description: Retrieves detailed information for a specific movie.
    -   Authentication: Required for all users.
    -   Path Parameters:
        -   `imdbID`: The IMDb ID of the movie.
    -   Response:
        ```json
        {
            "Title": "[title]",
            "Year": "[year]",
            "imdbID": "[imdbID]",
            "Type": "[type]",
            "Poster": "[poster]",
            
        }
        ```
     -    Error Codes:
        -   `[e.g., 404 Not Found]`
-   **Search movies from OMDb:**
    -   Endpoint: `[GET /movies/searchOMDB]`
    -   Description: Searches for movies in the OMDb database.
    -   Authentication: Required for admins.
    -   Query Parameters:
        -   `title`: The title of the movie to search for.
    -   Response:
        ```json
        {
            "Search": [
                {
                    "Title": "[title]",
                    "Year": "[year]",
                    "imdbID": "[imdbID]",
                    "Type": "[type]",
                    "Poster": "[poster]"
                },
                ...
            ],
            "totalResults": "[number]",
            "Response": "True" or "False",
            "Error": "[error message, if Response is False]"
        }
        ```
    -   Error Codes:
        -   `[e.g., 200 OK, but with Response: "False"]`
-   **Search movies in database:**
     -   Endpoint: `[GET /movies/search]`
     -   Description: Searches for movies in the application's database.
     -   Authentication: Required for all users.
     -    Query Parameters:
        -   `title`: The title of the movie to search for.
     -   Response:
        ```json
        [
            {
                "imdbID": "[imdbID]",
                "title": "[title]",
                "year": "[year]",
                "poster": "[poster]"
            },
            ...
        ]
        ```
     -   Error Codes:
        -  `[e.g., 200 OK, empty array if no results]`
-   **Add movie to database:**
    -   Endpoint: `[POST /movies]`
    -   Description: Adds a movie to the database.
    -   Authentication: Required for admins.
    -   Request:
        ```json
        {
            "imdbID": "[imdbID]",
            "title": "[title]",
            "year": "[year]",
            "poster": "[poster]"
        }
        ```
    -   Response:
        ```json
        {
            "message": "Movie added successfully"
        }
        ```
    -   Error Codes:
        -   `[e.g., 400 Bad Request, if movie already exists]`
-  **Add multiple movies to database:**
    -  Endpoint: `[POST /movies/batch`
    -  Description: Adds multiple movies to the database
    -  Authentication: Required for admins
    -  Request:
        ```json
        [
            {
                "imdbID": "[imdbID1]",
                "title": "[title1]",
                "year": "[year1]",
                "poster": "[poster1]"
            },
            {
                "imdbID": "[imdbID2]",
                "title": "[title2]",
                "year": "[year2]",
                "poster": "[poster2]"
            },
            ...
        ]
        ```
     -  Response:
        ```json
        {
            "message": "Movies added successfully"
        }
        ```
    -   Error Codes:
        -   `[e.g., 400 Bad Request]`
-   **Remove movie from database:**
    -   Endpoint: `[DELETE /movies/{imdbID}]`
    -   Description: Removes a movie from the database.
    -   Authentication: Required for admins.
    -   Path Parameters:
        -   `imdbID`: The IMDb ID of the movie to remove.
    -   Response:
        ```json
        {
            "message": "Movie removed successfully"
        }
        ```
    -   Error Codes:
        -   `[e.g., 404 Not Found]`
-  **Remove multiple movies from database:**
    -  Endpoint: `[DELETE /movies/batch]`
    -  Description: Removes multiple movies from the database.
    -  Authentication: Required for admins.
     -  Request Body:
        ```json
        {
            "imdbIDs": ["tt1234567", "tt2345678", ...]
        }
        ```
    -  Response:
        ```json
        {
            "message": "Movies removed successfully"
        }
        ```
    -   Error Codes:
        -   `[e.g., 400 Bad Request]`

###  Ratings
-   **Add rating for a movie:**
    -   Endpoint: `[POST /ratings]`
    -   Description: Adds a user's rating for a movie.
    -   Authentication: Required for users.
    -   Request:
        ```json
        {
            "movieId": "[movie_id]", 
            "rating": "[rating]"  
        }
        ```
    -   Response:
        ```json
        {
            "message": "Rating added successfully"
        }
        ```
    -   Error Codes:
        -   `[e.g., 400 Bad Request, if rating is invalid or user already rated]`
-  **Get average rating for a movie:**
    -  Endpoint: `[GET /ratings/{movieId}]`
    -  Description: Retrieves the average rating for a movie.
    -  Authentication: Required for all users
     -  Path Parameter
         - `movieId`: the id of the movie in your database
     -  Response:
        ```json
        {
            "averageRating": 4.5
        }
        ```
     -  Error Codes:
        -  `[e.g 404 Not Found]`

##  Pagination
For endpoints that return a list of movies (e.g., `/movies`, `/movies/search`), the following query parameters can be used for pagination:
-   `page`: The page number to retrieve (default: 1).
-   `limit`: The number of items per page (default: 10, max: 100).

## Error Handling
The API returns standard HTTP status codes to indicate the success or failure of a request.  Errors are typically returned in JSON format with a message property.

##  Notes
-  All data is returned in JSON format.
-  Endpoints may require specific HTTP methods (e.g., GET, POST, DELETE).
-   Authorization headers are required for authenticated routes.
