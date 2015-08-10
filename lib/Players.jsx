Players = new Meteor.Collection('players');

if(Meteor.isServer){
    Players.allow({
        update: () =>  true
    })
}