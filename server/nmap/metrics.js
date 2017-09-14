Meteor.setInterval(function () {
    let net = RawData.findOne({"name": "network"});
    makeGraph(net);

}, 5000);

function makeGraph(net) {
    let nodes = [];
    let links = [];
    net.data.hosts.forEach((host, i)=>{
        net.data.hosts[i].id =
            "ip: " + host.ip + "\n" +
            "mac: " + host.mac + "\n" +
           "up: " + host.up + "\n" +
            "deviceType: " + host.deviceType + "\n" +
            "key: " + host.key;
        let r = 5;
        let color = "5f97ef";
        if(host.deviceType==="routed host"){
            color="aaaaaa";
        }
        if(host.deviceType==="root"){
            r=10;
            color="ea6354";
        }
        nodes.push({
            id: net.data.hosts[i].id,
            s: r,
            color: color,
            opacity: 1
       });
    });
    net.data.links.forEach(link=>{
        let from = net.data.hosts[link.from].id;
        let to = net.data.hosts[link.to].id;
       links.push({
           source: from,
           target: to,
           w: 4,
           color: "afafaf",
           opacity: 1
       });
    });

    if(Containers.find({name:"NmapGraph"}).count()===0){
        Containers.insert({
                type: "Graph",
                name: "NmapGraph",
                data: {nodes: [], links: []}
            });
    }

    let graph = {nodes: nodes, links: links};

    let url = "http://localhost:3000/NmapGraph?data="+JSON.stringify(graph);
    HTTP.call('GET', url, {}, (error, result) => {});

}
