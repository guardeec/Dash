/**
 * Created by Guardeec on 11.07.17.
 */
let apis = [];

Meteor.setInterval(function () {
    let agentNames = Agents.find().map(item => {return item.name;});
    apis.forEach(api => {
        if (!agentNames.includes(api)) {
            apis.splice(apis.indexOf(api), 1);
        } else {
            agentNames.splice(agentNames.indexOf(api), 1);
        }
    });

    agentNames.forEach(agent => {
        try {
            Router.route('/' + agent, function () {
                let res = this.response;
                let query = this.params.query;

                if (!apis.includes(agent)) {
                    res.end("this agent was removed \ncreate new agent");
                } else {
                    if (query.data === undefined) {
                        res.end("");
                    } else {
                        try {
                            let data = JSON.parse(query.data);
                            let id = Agents.find({name: agent}).fetch()[0]._id;
                            Agents.update({_id: id}, {$set: {data: data, lastSeen: new Date().getTime()}});
                            res.end("done");
                        } catch (e) {
                            res.end("bad template\n"+e.message);
                        }
                    }
                }
            }, {where: 'server'});
        } catch (e) {}
        apis.push(agent);
    });
}, 5000);
