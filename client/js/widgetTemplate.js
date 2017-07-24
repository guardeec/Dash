Template.widgets.helpers({
    widget: function () {
        return Widgets.find();
    }
});

setTimeout(myTimer, 500);
function myTimer() {
    $(function () {
        let options = {
            cell_height: 100,
            vertical_margin: 10
        };
        $('.grid-stack').gridstack(options);
        $('.grid-stack').on('change', function (event, items) {
            _.each(items, function (item) {
                let dom = item.el[0];
                Widgets.update({
                    _id: dom.id
                }, {
                    $set: {
                        x: dom.getAttribute("data-gs-x"),
                        y: dom.getAttribute("data-gs-y")
                    }
                });
            });
        });
    });
}



