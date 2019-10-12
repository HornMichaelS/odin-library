# Odin Library

A small library application created for the [Odin Project](www.the).

[Live Preview](https://hornmichaels.github.io/odin-library/)

## Creation

I wanted to use this project as a way to practice clean code, and MVC in vanilla javascript. It turned out to be a failry challenging undertaking, but I'm happy with the result.

## Architecture

I implemented both the controller and the view as javascript modules, though I kept the model a plain array - I considered making the model a module as well, and implementing the observer pattern, with the view as observer; however, that method felt over-complex, even compared to the current implementation, so I decided not to do that.

The controller is instantiated first, then the view, to which the controller is passed. The view then sets itself as a delegate of the controller, so that it can receive update requests.

## Possible Improvements

A couple of ways I'd like to improve on this app:

1. Change the render method so that it only rerenders what's necessary, rather than updating the whole library.
2. Add persistent storage.
3. Add the ability to edit books.