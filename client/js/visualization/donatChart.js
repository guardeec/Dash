/**
 * Created by Guardeec on 14.07.17.
 */

drawPieChart = function (div, container) {
    let currentData;
    setTimeout(function () {
        let height = $("#" + div).parent().height();
        let width = $("#" + div).width();
        if (height > 1 && width > 1) {
            currentData = Containers.find({name: container}).fetch()[0].data;
            let chart = c3.generate({
                bindto: "#" + div,
                size: {height: height - 50, width: width - 10},
                data: {json: currentData, type: 'donut'},
                transition: {
                    duration: 500
                }
            });
            $( window ).resize(function() {
                let height = $("#" + div).parent().height()-50;
                let width = $("#" + div).width()-20;
                chart.resize({height:height, width:width});
            });
            setInterval(function () {
                let newData = Containers.find({name: container}).fetch()[0].data;
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







