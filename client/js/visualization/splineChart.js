/**
 * Created by Guardeec on 14.07.17.
 */

drawSplineChart = function (div, container) {
    let currentData;
    setTimeout(function () {
        let height = $("#" + div).parent().height();
        let width = $("#" + div).width();
        if (height > 1 && width > 1) {
            let data = Containers.find({name: container}).fetch()[0].data;
            let chartData = data.data;
            chartData.x = data.x;
            currentData = chartData;
            let chart = c3.generate({
                bindto: "#" + div,
                size: {height: height - 50, width: width - 20},
                data: {x: 'x', xFormat: '%Y-%m-%d %H:%M:%S', json: chartData, type: 'spline'},
                transition: {
                    duration: 500
                },
                axis: {
                    x: {
                        type: 'timeseries',
                        tick: {
                            format: '%Y-%m-%d %H:%M:%S'
                        }
                    }
                }
            });
            $( window ).resize(function() {
                let height = $("#" + div).parent().height()-50;
                let width = $("#" + div).width()-20;
                chart.resize({height:height, width:width});
            });
            setInterval(function () {
                let data = Containers.find({name: container}).fetch()[0].data;
                let chartData = data.data;
                chartData.x = data.x;
                let newData = chartData;
                let toUnload = Object.keys(currentData).filter(oldD => {
                    return !Object.keys(newData).some(newD => {
                        return newD === oldD;
                    })
                });
                currentData = newData;
                chart.load({
                    unload: toUnload,
                    json: currentData
                });
            }, 1500);
        }
    }, 100);
}