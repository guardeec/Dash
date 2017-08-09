/**
 * Created by Guardeec on 11.07.17.
 */
let containersExamples = require('./ContainersExamples');
let parser = require('./DataParser');
let apis = [];

Meteor.setInterval(function () {
    let containersNames = Containers.find().map(item => {return item.name;});
    apis.forEach(api => {
        if (!containersNames.includes(api)) {
            apis.splice(apis.indexOf(api), 1);
        } else {
            containersNames.splice(containersNames.indexOf(api), 1);
        }
    });
    containersNames.forEach(container => {
        try {
            Router.route('/' + container, function () {
                let res = this.response;
                let query = this.params.query;

                if (!apis.includes(container)) {
                    res.end("this container was removed \ncreate new container");
                } else {
                    if (query.data === undefined) {
                        let containerType = Containers.find({name:container}).fetch()[0].type;
                        let example = containersExamples.containersExamplesByTypeRouter(containerType);
                        console.log(example);
                        res.end(example);
                    } else {
                        try {
                            let data = parser.parse(query.data, container);
                            let id = Containers.find({name: container}).fetch()[0]._id;
                            Containers.update({_id: id}, {$set: {data: data}});
                            res.end("done");
                        } catch (e) {
                            res.end("bad template\n"+e.message);
                        }
                    }
                }
            }, {where: 'server'});
        } catch (e) {}
        apis.push(container);
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