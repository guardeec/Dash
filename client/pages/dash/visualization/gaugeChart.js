/**
 * Created by Guardeec on 14.07.17.
 */

drawGaugeChart = function (div, container) {
    let currentData;
    setTimeout(function () {
        let height = $("#" + div).parent().height();
        let width = $("#" + div).width();

        if (height > 1 && width > 1) {
            currentData = Containers.find({name: container}).fetch()[0].data;
            let chart = c3.generate({
                bindto: "#" + div,
                size: {height: height-50, width: width - 20},
                data: {columns: [currentData], type: 'gauge'},
                color: {
                    pattern: ['#60B044', '#F6C600', '#F97600', '#FF0000'], // the three color levels for the percentage values.
                    threshold: {
                        values: [30, 60, 90, 100]
                    }
                },
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
                currentData = Containers.find({name: container}).fetch()[0].data;
                chart.load({
                    columns: [currentData]
                });
            }, 1500);
        }
    }, 100);
};







