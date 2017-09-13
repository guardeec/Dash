Meteor.setInterval(function () {
    updateAgentsStatus();
    makeOneNet();
    //Agents.find().map(item => {return item.name;});
    //let agentsData = Agents.find().map(item => {return item.name;});

}, 5000);

function updateAgentsStatus() {
    Agents.find().forEach(item => {
        if(new Date().getTime()-item.lastSeen>1800000 || isNaN(item.lastSeen)){
            Agents.update({_id: item._id}, {$set: {status: false}});
        }else {
            Agents.update({_id: item._id}, {$set: {status: true}});
        }
    });
}

function makeOneNet() {



    let net = [];

    Agents.find().forEach(item => {
        if (item.data!==undefined){
            let router = item.data.hosts.find(host=>{
                return host.ip===item.data.router;
            });

            item.data.hosts.forEach(host=>{
                if(router!==host){
                    host.parentRouter = router;
                    net.push({
                        from: host,
                        to: router
                    });
                }
            });
            net.push({
                from: router,
                to: "out"
            })
        }
    });
    RawData.update({_id: RawData.findOne({name: "network"})._id}, {$set: {data: net}});
}

function test() {
    exec = Npm.require('child_process').exec;
    cmd = Meteor.wrapAsync(exec);
    let res = cmd("traceroute 8.8.8.8");
    console.log(res);
}