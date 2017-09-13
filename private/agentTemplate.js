var asyncblock = require('asyncblock');
var exec = require('child_process').exec;
var url = "HERE MUST BE URL";
var agentName = "HERE MUST BE AGENT NAME";
var pipeline = {
    current: 1,
    max: 1,
    show: function () {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        var i = 0;
        var line = "";
        while (i / this.max < this.current / this.max) {
            line += '\u2593';
            i += this.max / 40
        }
        while (i < this.max) {
            line += '\u2592';
            i += this.max / 40
        }
        line = line + " " + (this.current / this.max * 100).toString().substring(0, 4) + "%";
        process.stdout.write(line);
        this.current++
    },
    setMax: function (max) {
        this.max = max
    },
    make: function () {
        this.current = 1;
        this.max = 1
    }
};

function sendData(data) {
    var request = require('request');
    request(url + agentName + "?data=" + JSON.stringify(data), function (error, response, body) {
        if (error) {
            console.log("Can not sent data to " + url)
        } else {
            console.log("Success")
        }
    })
}

function scan() {
    pipeline.make();
    asyncblock(function (flow) {
        function getRouter() {
            exec("ip route show | grep -i 'default via'| awk '{print $3 }'", flow.add());
            return flow.wait().slice(0, -1)
        }

        function getHosts(routerIp) {
            var hosts = [];
            exec("nmap -n -sn " + routerIp + "/24 -oG - | awk '/Up$/{print $2}'", flow.add());
            hosts = flow.wait().split("\n").filter(ip => {
                return ip !== ''
            }).map(host => {
                return {
                    ip: host
                }
            });
            pipeline.setMax(hosts.length * 2 + 1);
            return hosts
        }

        function hostsInfo(hosts) {
            hosts.forEach(host => {
                exec("nmap " + host.ip, flow.add());
                var out = flow.wait().split("\n");
                host.up = out[3].includes("Host is up");
                do {
                    out.splice(0, 1)
                } while (out[0] != undefined && !out[0].includes("PORT") && !out[0].includes("STATE") && !out[0].includes("SERVICE"));
                for (var i = 0; out[i] != undefined && !out[i].includes('MAC Address:') && out[i] != ""; i++) {
                    var params = out[i].split(" ").filter(item => {
                        return item != undefined && item != "" && item.length > 0
                    });
                    host.ports = [];
                    host.ports.push({
                        port: params[0].split("/")[0],
                        type: params[0].split("/")[1],
                        service: params[2],
                        state: params[1]
                    })
                }
                pipeline.show();
                exec("sudo nmap -O " + host.ip, flow.add());
                out = flow.wait();
                out = out.split("\n");
                out.forEach(item => {
                    if (item.includes('MAC Address: ')) {
                        host.mac = item.substring("MAC Address: ".length, "MAC Address: ".length + "00:00:00:00:00:00".length)
                    }
                    if (item.includes('Device type: ')) {
                        host.deviceType = item.substring('Device type: '.length).split("|")
                    }
                    if (item.includes('Running: ')) {
                        host.running = item.substring('Running: '.length).split("|")
                    }
                });
                pipeline.show()
            })
        }

        function addLinks(net, hosts) {
            var routerIp = getRouter();
            if (net.hosts[0].deviceType == "root") {
                for (var i = 0; i < hosts.length; i++) {
                    if (hosts[i].ip == routerIp) {
                        hosts[i].deviceType = "root";
                        hosts[i].ip = net.hosts[0].ip;
                        net.hosts[0] = hosts[i];
                        hosts.splice(i, 1)
                    }
                }
            } else {
                for (var i = 0; i < hosts.length; i++) {
                    if (hosts[i].ip == routerIp) {
                        net.hosts[0] = hosts[i];
                        hosts.splice(i, 1);
                        break
                    }
                }
            }
            hosts.forEach(host => {
                net.hosts.push(host);
                net.links.push({
                    from: 0,
                    to: net.hosts.length - 1
                })
            })
        }
        console.log("Scanning...");
        var net = makeTraceroute();
        var routerIp = getRouter();
        var hosts = getHosts(routerIp);
        hostsInfo(hosts);
        pipeline.show();
        addLinks(net, hosts);
        console.log("\n");
        console.log(JSON.stringify(net, null, '\t'));
        sendData(net);
        setTimeout(scan, 1000);

        function makeTraceroute() {
            var end = url;
            end = end.replace("http://", "");
            end = end.substr(0, end.length - 6);
            exec("nmap -sn -Pn --traceroute " + end, flow.add());
            var res = flow.wait().slice(0, -1);
            res = res.split('\n');
            var lines = [];
            var i = 0;
            res = res.filter(r => {
                return r != ""
            });
            while (!res[i].includes("RTT") && i < res.length - 1) {
                i++
            }
            i++;
            var net = {
                hosts: [],
                links: []
            };
            if (i == res.length) {
                net.hosts.push({
                    ip: getRouter(),
                    deviceType: "routed host"
                });
                net.hosts.push({
                    ip: end,
                    deviceType: "root"
                });
                net.links.push({
                    from: 0,
                    to: 1
                });
                return net
            }
            while (!res[i + 1].includes("Nmap done")) {
                lines.push(res[i]);
                i++
            }
            lines = lines.filter(line => {
                return line.includes('ms')
            });
            lines = lines.map(line => {
                var arr = line.split(" ");
                return arr[arr.length - 1].replace("(", "").replace(")", "")
            });
            i = 0;
            for (; i < lines.length; i++) {
                net.hosts.push({
                    ip: lines[i],
                    deviceType: "routed host"
                });
                net.links.push({
                    from: i,
                    to: i + 1
                })
            }
            net.hosts.push({
                ip: end,
                deviceType: "root"
            });
            console.log(net);
            return net
        }
    })
}
scan();