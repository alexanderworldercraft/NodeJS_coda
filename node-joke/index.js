const giveMeAJoke = require('give-me-a-joke');

    giveMeAJoke.getRandomDadJoke(function(joke)
{
    console.log(joke);
});