// On server startup, create some players if the database is empty.
Meteor.startup(function() {
    if (!Players.find().count()) {
        var names = [
            'Ada Lovelace',
            'Grace Hopper',
            'Marie Curie',
            'Carl Friedrich Gauss',
            'Nikola Tesla',
            'Claude Shannon'
        ];
        names.forEach(function(name)  {
            Players.insert({name: name, score: Math.floor(Random.fraction() * 10) * 5});
        });
    }
});


Meteor.publish('players', function() {
    return Players.find();
});