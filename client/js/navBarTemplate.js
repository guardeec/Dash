Session.set("selected_widget_type", "Line Chart");

Template.navBar.helpers({
    page: function () {
        return Pages.find();
    }
});

Template.dashboard.events({
    'click #addVisModelBtn': function (e) {
        let type = $('#addVisModel_typeSelect').find(":selected").text();
        let containerName = $('#addVisModel_selContainerBasedType').find(":selected").text();
        let widgetName = $('#addVisModel_widgetNameField').val();
        let size = "";
        let selected = $("#selRadio").find("input[type='radio']:checked");
        if (selected.length > 0) {
            size = selected.val();
        }
        if (!(containerName === "" || type === "" || widgetName === "" || size === "")) {
            Widgets.insert({
                type: type,
                width: size[0] * 3,
                height: size[2] * 3,
                name: widgetName,
                x: 0,
                y: 0,
                container: containerName
            });
            location.reload();
        }
    },
    'click #removeVisModelBtn': function (e) {
        let widgetName = $('#removeVisModel_removeWidget').find(":selected").text();
        let id = Widgets.findOne({name: widgetName});
        Widgets.remove({_id: id._id});
        location.reload();
    },
    'click #addContainerBtn': function (e) {
        let type = $('#addContainer_typeSelect').find(":selected").text();
        let containerName = $('#addContainer_containerNameField').val();
        if (!(containerName === "" || type === "")) {
            Containers.insert({
                type: type,
                name: containerName,
                data: {}
            });
            location.reload();
        }
    },
    'click #removeContainerBtn': function (e) {
        let containerName = $('#removeContainer_selectContainer').find(":selected").text();
        let id = Containers.findOne({name: containerName});
        Containers.remove({_id: id._id});
        location.reload();
    },
    'change #addVisModel_typeSelect': function (event) {
        Session.set("selected_widget_type", $('#addVisModel_typeSelect').find(":selected").text());
    }
});

setInterval(function () {
    //console.log($('#typeSelect').find(":selected").text());
}, 1000);