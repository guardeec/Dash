/**
 * Created by Guardeec on 17.07.17.
 */



drawGraph = function (div, container) {

    function getSvgHeight(div) {
        return $("#" + div).parent().height() - 50;
    }
    function getSvgWidth(div) {
        return $("#" + div).width() - 20;
    }
    function getDataGraph(container) {
        let graph = Containers.find({name: container}).fetch()[0].data;
        graph.links.forEach(link => {
            link.source = graph.nodes.find(function (node) {
                return node.id === link.source;
            });
            link.target = graph.nodes.find(function (node) {
                return node.id === link.target;
            });
        });
        return graph;
    }
    function getLinearScaleForGraphNodesSize(graph, sizeFrom, sizeTo) {
        return d3.scale.linear().domain(
            [
                d3.min(graph.nodes.map(node => {
                    return node.s;
                })),
                d3.max(graph.nodes.map(node => {
                    return node.s;
                }))
            ]
        ).range([sizeFrom, sizeTo]);
    }

    let height = getSvgHeight(div);
    let width = getSvgWidth(div);
    let graph = getDataGraph(container);

    //создаем svg-контейнер
    let svg = d3.select("#" + div).append("svg")
        .attr("width", width)
        .attr("height", height);
    let oldGraph;
    let force;

    let tip;

    function draw(graph) {
        let linearScaleNodeSize = getLinearScaleForGraphNodesSize(graph, 50, 500);
        let linearScaleDistance = getLinearScaleForGraphNodesSize(graph, 10, 50);


        svg.remove();
        svg = d3.select("#" + div).append("svg")
            .attr("width", width)
            .attr("height", height);

        force = d3.layout.force()
            .charge(Settings.findOne({}).graphSettings.charge)
            .linkDistance(Settings.findOne({}).graphSettings.linksDistance)
            .size([width, height])
            .nodes(graph.nodes)
            .links(graph.links)
            .start();

        //инит линков
        let link = svg.selectAll(".link")
            .data(force.links())
            .enter().append("line")
            .attr("class", "link")
            .attr("id", function (d) {return d.source.id + "-" + d.target.id;}) //для того что бы потом было просто искать
            .style("stroke", function (d) {return "#" + d.color;})
            .style("stroke-opacity", function (d) {return d.opacity;})
            .style("stroke-width", function (d) {return d.w;});
        //инит нодов
        let node = svg.selectAll(".node")
            .data(force.nodes())
            .enter().append("g")
            .attr("class", "node")
            .call(force.drag);

        tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return "<span style='color:#CCC'>" + d.id.split("/n").join("<br>") + "</span>";
            });
        svg.call(tip);

        node
            .append("circle")
            .attr("class", "node")
            .attr("id", function (d) {return d.id;})
            .attr("name", function (d) {return d.id;})
            .attr("r", function (d) {return Math.sqrt(linearScaleNodeSize(d.s) / Math.PI);})
            .style("fill", function (d) {return "#" + d.color;})
            .call(force.drag)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        //силовая отрисовка на каждый тик
        force.on("tick", function () {
            link
                .attr("x1", function (d) {return d.source.x;})
                .attr("y1", function (d) {return d.source.y;})
                .attr("x2", function (d) {return d.target.x;})
                .attr("y2", function (d) {return d.target.y;});

            //без бокса
            //node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

            //с боксом
            node.attr("transform", function(d) {
                let r = Math.sqrt(linearScaleNodeSize(d.s) / Math.PI);
                return "translate(" + Math.max(r, Math.min(width - r, d.x)) + "," + Math.max(r, Math.min(height - r, d.y)) + ")";
            });

            // node.attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
            //     .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });

        });
        oldGraph = graph;
    }


    draw(graph);


    //изменение размера экрана
    $(window).resize(function () {
        height = $("#" + div).parent().height() - 50;
        width = $("#" + div).width() - 20;
        svg
            .attr("width", width)
            .attr("height", height);
        //смещение силовой симуляции
        force.size([width, height]).resume();
    });



    //обновление данных
    let updateCounter = 0;
    setInterval(function () {
        console.log(updateCounter+" "+Settings.findOne({}).graphSettings.updateTime);
        if(updateCounter<Settings.findOne({}).graphSettings.updateTime){
            updateCounter+=5;
        }else {
            updateCounter=5;
            tip.hide();
            let newGraph = getDataGraph(container);
            newGraphAddCoords(newGraph, oldGraph);
            draw(newGraph);
        }
    }, 5000);
};

function newGraphAddCoords(newGraph, oldGraph) {
    newGraph.nodes.forEach(newNode=>{
       let oldNode = oldGraph.nodes.find(node=>{
           return node.id===newNode.id;
       });
       if(oldNode!==undefined){
           newNode.px = oldNode.px;
           newNode.pt = oldNode.py;
           newNode.x = oldNode.x;
           newNode.y = oldNode.y;
       }
    });
}