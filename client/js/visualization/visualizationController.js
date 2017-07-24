/**
 * Created by Guardeec on 14.07.17.
 */

let widgets = [];

Template.chart.rendered = function () {
    let o = {};
    o.div = this.firstNode.id;
    o.type = this.firstNode.getAttribute('type');
    o.container = this.firstNode.getAttribute('container');
    widgets.push(o);
};

setTimeout(function () {
    widgets.forEach(function (item) {
        let label = "<div style='background-color: #f7f7f7'><label style='padding-left: 10px; padding-top: 5px; color: #494949'>"+item.container+"</label></div>";
        $('#'+item.div).parent().prepend(label);
        switch (item.type) {
            case "Line Chart": {
                drawLineChart(item.div, item.container);
                break;
            }
            case "Pie Chart": {
                drawPieChart(item.div, item.container);
                break;
            }
            case "Bar Chart": {
                drawBarChart(item.div, item.container);
                break;
            }
            case "Spline Chart": {
                drawSplineChart(item.div, item.container);
                break;
            }
            case "Gauge Chart": {
                drawGaugeChart(item.div, item.container);
                break;
            }
            case  "Graph": {
                drawGraph(item.div, item.container);
                break;
            }
            case "Scatter Plot 3D":{
                drawScatterPlot3D(item.div, item.container);
                break;
            }
            default: {
                break;
            }
        }
    });
}, 1000);

