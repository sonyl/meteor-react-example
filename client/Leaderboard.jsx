Meteor.startup(
    () => React.render(<Leaderboard/>, document.getElementById('outer'))
);

Meteor.subscribe("players");

var Leaderboard = React.createClass({
    mixins: [ReactMeteor.Mixin],


    getMeteorState() {
        var selectedPlayer = Players.findOne(Session.get("selected_player"));
        return {
            players: Players.find({}, {sort: {score: -1, name: 1}}).fetch(),
            selectedPlayer: selectedPlayer,
            selectedName: selectedPlayer && selectedPlayer.name
        };
    },

    addFivePoints() {
        Players.update(Session.get("selected_player"), {$inc: {score: 5}});
    },
    removeFivePoints() {
        var oldScore = this.state.selectedPlayer && this.state.selectedPlayer.score || 0;
        Players.update(Session.get("selected_player"), {$set: {score: Math.max(0, oldScore - 5)}});
    },

    selectPlayer(id) {
        Session.set("selected_player", id);
    },

    renderPlayer(model) {
        var _id = this.state.selectedPlayer && this.state.selectedPlayer._id;
        return (
            <Player
                key={model._id}
                name={model.name}
                score={model.score}
                className={model._id === _id ? "selected" : ""}
                onClick={this.selectPlayer.bind(this, model._id)}
                />
        )
    },

    render() {
        if (!this.state.players.length) {
            return <span/>;
        }
        var children = [
            <div className="leaderboard" key="leaderboard">
                { this.state.players.map(this.renderPlayer) }
            </div>
        ];

        if (this.state.selectedName) {
            children.push(
                <div className="details" key="details">
                    <div className="name">{this.state.selectedName}</div>
                    <input
                        type="button"
                        value="Give 5 points"
                        onClick={this.addFivePoints}
                        />
                    <input
                        type="button"
                        value="Remove 5 points"
                        onClick={this.removeFivePoints}
                        />
                </div>
            );

        } else {
            children.push(
                <div className="none" key="notice">Click a player to select</div>
            );
        }

        return <div>{ children }</div>;
    }
});

Player = React.createClass({
    render() {
        return (
            <div onClick={this.props.onClick} className={"player " + this.props.className}>
                <span className="name">{this.props.name}</span>
                <span className="score">{this.props.score}</span>
            </div>
        );
    }
});

