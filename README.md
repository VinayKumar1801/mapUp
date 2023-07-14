# Express-NodeJS Application

This is a sample Express-NodeJS application that provides an API for calculating intersections.

## Features

- User authentication using JWT tokens
- Protected route for calculating intersections with authorization check
- Integration with turf.js library for intersection calculations
- Error handling for invalid linestring, missing/malformed request body, and authentication failures

## Requirements

- Node.js
- NPM

# API Documentation
## Authentication
- POST /login
- Login route for generating a JWT token.
- Request:
{
  "username": "admin",
  "password": "password"
}
- Response:
{
  "token": "your-generated-jwt-token"
}

## Intersections
- POST /intersections
- Protected route for calculating intersections. Requires authentication with a valid JWT token.
- Request:
{
  "linestring": {
    "type": "LineString",
    "coordinates": [
      [0, 0],
      [1, 1],
      [2, 2]
    ]
  }

- Response: (Success):
{
  "intersectingLines": [
    {
      "id": "L01",
      "start": [1, 1],
      "end": [2, 2]
    },
  ]
}
- Response: (No intersections):
{
  "intersectingLines": []
}
