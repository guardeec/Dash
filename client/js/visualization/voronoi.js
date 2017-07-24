/**
 * Created by Guardeec on 24.07.17.
 */

drawVoronoi = function (div, container) {

    function getSvgHeight(div) {
        return $("#" + div).parent().height() - 60;
    }
    function getSvgWidth(div) {
        return $("#" + div).width() - 20;
    }


    let height = getSvgHeight(div);
    let width = getSvgWidth(div);
    let data = Containers.find({name: container}).fetch()[0].data;

    //создаем svg-контейнер
    let svg = d3.select("#" + div).append("svg")
        .attr("width", width)
        .attr("height", height);


    function draw(data) {
        svg.remove();
        svg = d3.select("#" + div).append("svg")
            .attr("width", width)
            .attr("height", height);
        norm(data, width, height);

        data.polygons.forEach(polygon=>{
            let points = "";
            polygon.coordinates.forEach(c=>{
                points+=c.x+","+c.y+" ";
            });
            svg.append("polygon")
                .attr("points", points)
                .attr("fill", d3.rgb(242, 242, 242))
                .attr("stroke","black")
                .attr("stroke-width",0);
        });
        data.edges.forEach(edge=>{
            let color = d3.rgb(128, 128, 128);
            let width = 5;
            if(edge.separator){
                color=d3.rgb(218, 218, 218);
                width = 2;
            }
            svg.append("line")
                .attr("x1", edge.from.x)
                .attr("y1", edge.from.y)
                .attr("x2", edge.to.x)
                .attr("y2", edge.to.y)
                .attr("stroke-width", width)
                .attr("stroke", color);
        });
    }

    draw(data);


    //изменение размера экрана
    $(window).resize(function () {
        height = getSvgHeight(div);
        width = getSvgWidth(div);
        draw(data);
    });
    //
    //
    //обновление данных
    setInterval(function () {
        data = Containers.find({name: container}).fetch()[0].data;
        draw(data);
    }, 1000);
};

function norm(data, sizeX, sizeY) {
    let biggestX = data.polygons[0].coordinates[0].x;
    let biggestY = data.polygons[0].coordinates[0].y;
    let smallestX = data.polygons[0].coordinates[0].x;
    let smallestY = data.polygons[0].coordinates[0].y;
    data.polygons.forEach(p=>{
        p.coordinates.forEach(c=>{
            if(c.x>biggestX){biggestX=c.x;}
            if(c.y>biggestY){biggestY=c.y;}
            if(c.x<smallestX){smallestX=c.x;}
            if(c.y<smallestY){smallestY=c.y;}
        })
    });

    let kY = sizeY/biggestY;
    let kX = sizeX/biggestX;
    data.polygons.forEach(p=>{
        p.coordinates.forEach(c=>{
            c.x = Math.round(c.x*kX);
            c.y = Math.round(c.y*kY);
        })
    });
    data.edges.forEach(e=>{
        e.from.x = Math.round(e.from.x*kX);
        e.from.y = Math.round(e.from.y*kY);
        e.to.x = Math.round(e.to.x*kX);
        e.to.y = Math.round(e.to.y*kY);
    });

    // let kY = sizeY/biggestY;
    // let kX = sizeX/biggestX;
    // data.polygons.forEach(p=>{
    //     p.coordinates.forEach(c=>{
    //         c.x = c.x*kX;
    //         c.y = c.y*kY;
    //     })
    // });
    // data.edges.forEach(e=>{
    //     e.from.x = e.from.x*kX;
    //     e.from.y = e.from.y*kY;
    //     e.to.x = e.to.x*kX;
    //     e.to.y = e.to.y*kY;
    // });


}
