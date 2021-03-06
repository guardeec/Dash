/**
 * Created by Guardeec on 14.07.17.
 */

function getPieChartExample() {
    let data = {
        'data1': 10,
        'data2': 30
    };
    return JSON.stringify(data, null, '\t');
}

function getLineSplineChartExample() {
    let data = {
        'data':{
            'data1': [30, 20, 50, 40, 60, 50],
            'data2': [200, 130, 90, 240, 130, 220],
            'data3': [300, 200, 160, 400, 250, 250]
        },
        'x': ['2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06']
    };
    return JSON.stringify(data, null, '\t');
}

function getBarChartExample() {
    let data = {
        'data':{
            'data1': [30, 20, 50, 40, 60, 50],
            'data2': [200, 130, 90, 240, 130, 220],
            'data3': [300, 200, 160, 400, 250, 250]
        },
        'x': ['2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
        'stacked': false
    };
    return JSON.stringify(data, null, '\t');
}

function getGaugeChartExample() {
    let data = ['load', 74.35];
    return JSON.stringify(data, null, '\t');
}

function getGraphExample() {
    let graph = {nodes:[], links:[]};
    graph.nodes.push({id: "192.168.1.1", r: 3, color: "#ea6354", opacity: 0.8});
    graph.nodes.push({id: "192.168.1.2", r: 5, color: "#ea6354", opacity: 1});
    graph.nodes.push({id: "192.168.1.3", r: 3, color: "#ea6354", opacity: 0.8});
    graph.links.push({source: "192.168.1.1", dest: "192.168.1.2", w: 4, color: "#afafaf", opacity: 1});
    graph.links.push({source: "192.168.1.1", dest: "192.168.1.3", w: 9, color: "#afafaf", opacity: 0.5});
    return JSON.stringify(graph, null, '\t');
}

function getScatterPlot3DExample() {
    let scatterPlot3D = [];
    for (let i=0; i<100; i++){
        scatterPlot3D.push({
            x: Math.round(Math.random() * 100),
            y: Math.round(Math.random() * 100),
            z: Math.round(Math.random() * 100),
            color: "0x00BFFF"
        })
    }
    return JSON.stringify(scatterPlot3D, null, '\t');
}

function getVoronoiExample() {
    return "{\"nodes\":[{\"name\":\"0\"},{\"name\":\"1\"},{\"name\":\"2\"},{\"name\":\"3\"},{\"name\":\"4\"},{\"name\":\"5\"}],\"links\":[{\"from\":{\"name\":\"0\"},\"to\":{\"name\":\"1\"}},{\"from\":{\"name\":\"0\"},\"to\":{\"name\":\"2\"}},{\"from\":{\"name\":\"1\"},\"to\":{\"name\":\"3\"}},{\"from\":{\"name\":\"1\"},\"to\":{\"name\":\"4\"}},{\"from\":{\"name\":\"1\"},\"to\":{\"name\":\"5\"}}]}\n";
}

function getWindRoseExample() {
    let metrics = ["metric1", "metric2", "metric3"];
    let maxValues = [50, 50, 50];
    let elements = [
        {"name" : "user1", "values" : [10, 30, 27]},
        {"name" : "user2", "values" : [15, 10, 47]}
    ];
    let res = {"metrics" : metrics, "max" : maxValues, "elements" : elements}
    return JSON.stringify(res, null, '\t');
}

function containersExamplesByTypeRouter (containerType) {
    switch (containerType){
        case "Pie Chart" :
            return getPieChartExample();
        case "Line Chart" :
            return getLineSplineChartExample();
        case "Spline Chart" :
            return getLineSplineChartExample();
        case "Bar Chart" :
            return getBarChartExample();
        case "Gauge Chart" :
            return getGaugeChartExample();
        case "Graph" :
            return getGraphExample();
        case "Scatter Plot 3D" :
            return getScatterPlot3DExample();
        case "Voronoi" :
            return getVoronoiExample();
        case "Wind Rose" :
            return getWindRoseExample();
        default :
            return "undefined container type";
    }
}

exports.containersExamplesByTypeRouter = containersExamplesByTypeRouter;