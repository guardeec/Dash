/**
 * Created by Guardeec on 09.08.17.
 */

drawWindRose = function (div, container) {

    function getSize(div) {
        let h = $("#" + div).parent().height() - 50;
        let w = $("#" + div).width() - 20;
        return h > w ? w : h;
    }

    let size = getSize(div),
        svg = d3.select("#" + div).append("svg").attr("width", size).attr("height", size),
        polygons = [],
        data = Containers.find({name: container}).fetch()[0].data;

    drawGrid(data);
    drawPolygons(data, true);

    //изменение размера экрана
    $(window).resize(function () {
        svg.remove();
        size = getSize(div);
        svg = d3.select("#" + div).append("svg").attr("width", size).attr("height", size);
        polygons = [];
        drawGrid(data, false);
        drawPolygons(data, false);
    });

    //обновление данных
    setInterval(function () {
        data = Containers.find({name: container}).fetch()[0].data;
        update(data);
    }, 1000);


    /*
    ОТРИСОВКА WIND ROSE
     */

    function update(d) {
        let toDraw = [];
        let toDelete;
        let toUpdate = [];
        d.elements.forEach(function (el) {
            let polygon = polygons.find(function (p) {return p.name === el.name;});
            if (polygon !== undefined) {toUpdate.push(polygon);}
            else {toDraw.push(el);}
        });
        toDelete = polygons.filter(function (p) {return !toUpdate.includes(p);});
        toDelete.forEach(function (p) {hidePolygon(p);});
        toDraw.forEach(function (p) {drawPolygon(p, polygons.length + 1, d);});
        toUpdate.forEach(function (p) {
            let el = d.elements.find(function (el) {return el.name === p.name;});
            updatePolygon(el, d, p);
        });

        function hidePolygon(p) {
            p.polygon.transition().style("opacity", 0).duration(500).delay(500);
            p.points.forEach(function (p) {p.transition().style("opacity", 0).duration(500).delay(500);});
            setTimeout(function () {delete  p;}, 700);
        }
    }


    function drawGrid(data) {
        data.metrics.forEach(function (el, i) {
            let x = Math.round(size / 2 + size / 2 * Math.cos(toRadians(360) / data.metrics.length * i)),
                y = Math.round(size / 2 + size / 2 * Math.sin(toRadians(360) / data.metrics.length * i));
            svg.append("line")
                .attr("x1", size / 2)
                .attr("y1", size / 2)
                .attr("x2", x)
                .attr("y2", y)
                .attr("stroke", "grey")
                .style("strike-width", 1);
            let tip = d3.tip().attr('class', 'd3-tip').html(el + " : " + data.max[i]);
            svg.call(tip);
            svg.append("circle")
                .attr("cx", x)
                .attr("cy", y)
                .attr("r", size / 200)
                .attr("fill", "grey")
                .style("opacity", 0.7)
                .on("mouseover", tip.show)
                .on("mouseout", tip.hide);

        });
    }

    function drawPolygons(data, animation) {
        data.elements.forEach(function (el, i) {drawPolygon(el, i, data, animation);});
    }

    function drawPolygon(el, i, data, animation) {
        let c20 = d3.scale.category20(),
            points = getPoints(el.values, data),
            lineFunctionStart = d3.svg.line()
                .x(function (d) {return size / 2;})
                .y(function (d) {return size / 2;})
                .interpolate("cardinal-closed"),
            lineFunction = d3.svg.line()
                .x(function (d) {return d.x;})
                .y(function (d) {return d.y;})
                .interpolate("cardinal-closed"),
            polygon = svg.append("path")
                .attr("d", lineFunctionStart(points))
                .attr("stroke", c20(i))
                .attr("stroke-width", 2)
                .attr("fill", c20(i))
                .attr("fill-opacity", 0.2)
                .style("pointer-events", "none"),
            animationValue = 500;
        if(!animation){
           animationValue=1;
        }
        polygon.transition()
            .attr("d", lineFunction(points))
            .duration(animationValue)
            .delay(animationValue);
        let circles = [],
            tips = [];
        points.forEach(function (p, q) {
            let circle = drawCircles(p, c20[i]);
            circles.push(circle);
            tips.push(drawTip(points[q], circle, el));
        });
        polygons.push({"name": el.name, "points": circles, "tips": tips, "polygon": polygon});
    }

    function drawTip(point, circle, el) {
        let tip = d3.tip().attr('class', 'd3-tip').html(el.name + "<br>" + point.metric + " : " + point.value);
        svg.call(tip);
        circle
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide);
        return tip;
    }

    function drawCircles(point, color) {
        let circle = svg.append("circle")
            .attr("cx", size / 2)
            .attr("cy", size / 2)
            .attr("r", size / 200)
            .attr("fill", color)
            .style("opacity", 0);
        circle.transition()
            .attr("cx", point.x)
            .attr("cy", point.y)
            .style("opacity", 0.9)
            .duration(500)
            .delay(500);
        return circle;
    }

    function updatePolygon(el, data, p) {
        let points = getPoints(el.values, data),
            lineFunction = d3.svg.line()
                .x(function (d) {return d.x;})
                .y(function (d) {return d.y;})
                .interpolate("cardinal-closed"),
            animationValue = 500;
        p.polygon.transition()
            .attr("d", lineFunction(points))
            .duration(animationValue)
            .delay(animationValue);
        p.points.forEach(function (c, i) {
            c.transition()
                .attr("cx", points[i].x)
                .attr("cy", points[i].y)
                .style("opacity", 0.8)
                .duration(animationValue)
                .delay(animationValue);
            p.tips[i].html(el.name + "<br>" + points[i].metric + " : " + points[i].value);
        });
    }

    function getPoints(points, data) {
        let res = [];
        points.forEach(function (value, i) {
            let r = size / 2 * value / (data.max[i]),
                x = Math.round(size / 2 + r * Math.cos(toRadians(360) / data.metrics.length * i)),
                y = Math.round(size / 2 + r * Math.sin(toRadians(360) / data.metrics.length * i));
            res.push({"x": x, "y": y, "value": value, "metric": data.metrics[i]});
        });
        return res;
    }

    function toRadians(angle) {
        return angle * (Math.PI / 180);
    }
};
