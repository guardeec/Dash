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

//
// function removeRouteByName(routeName) {
//     let routes = Router.routes;
//     console.log(routes[0].getName());
//     let route = routes[routeName];
//     if (!route) return false;  // Returns false if route is not found
//
//     // Remove route from Router
//     delete routes[routeName];
//     delete routes._byPath[route.path()];
//     let routeIndex = routes.indexOf(route);
//     if (routeIndex >= 0) routes.splice(routeIndex, 1);
//
//     // Remove route handler from MiddleWareStack
//     delete Router._stack._stack[routeName];
//     Router._stack.length -= 1;
//
//     return true;  // Returns true when route is removed
// }