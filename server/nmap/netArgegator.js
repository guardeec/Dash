Meteor.setInterval(function () {
    updateAgentsStatus();
    //makeOneNet();
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
    let agents = Agents.find();

    let hostsToAgregate = [];
    agents.forEach(agent => {
        if (agent.data!==undefined){
            let hosts = agent.data.hosts;
            hosts.forEach(host=>{
                host.key = hosts[0].mac+" "+host.ip;
                if (!hostsToAgregate.some(item=>{return item.key===host.key;})){
                    hostsToAgregate.push(host);
                }
            });
        }
    });
    let linksToAgregate = [];
    agents.forEach(agent=>{
        if (agent.data!==undefined){
            let links = agent.data.links;
            let hosts = agent.data.hosts;
            links.forEach(link=>{
                let from = hosts[link.from];
                let to = hosts[link.to];
                from = getIndexByHostKey(from, hostsToAgregate);
                to = getIndexByHostKey(to, hostsToAgregate);
                linksToAgregate.push({from:from,to:to});
            });
        }
    });

    function getIndexByHostKey(host, hosts) {
        for (let i=0; i<hosts.length; i++){
            if (hosts[i].key===host.key){
                return i;
            }
        }
    }



    RawData.update({_id: RawData.findOne({name: "network"})._id}, {$set: {data: {
        hosts: hostsToAgregate,
        links: linksToAgregate
    }}});
}

function test() {
    exec = Npm.require('child_process').exec;
    cmd = Meteor.wrapAsync(exec);
    let res = cmd("traceroute 8.8.8.8");
    console.log(res);
}