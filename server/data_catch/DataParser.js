let fs = require('fs');
let exec = require('child_process');

function parse(data, container) {
    if (Containers.find({name: container}).fetch()[0].type==="Voronoi"){
        let voronoi = parseVoronoi(data);
        console.log(data);
        console.log(voronoi);

        return JSON.parse(voronoi);
    }
    return JSON.parse(data);
}

function parseVoronoi(data) {
    fs.writeFileSync("/home/guardeec/VoronoiJava/input",data);
    exec.execSync('java -jar /home/guardeec/VoronoiJava/Voronoi.jar -input input -output output -x 1000 -y 1000', {cwd: '/home/guardeec/VoronoiJava/'});
    return fs.readFileSync("/home/guardeec/VoronoiJava/output", "utf8");
}

exports.parse = parse;