Session.set("selected_widget_type", "Line Chart");

Template.selectWidgetInput.helpers({
    widget: function () {
        return Widgets.find();
    }
});

Template.selectContainerInput_basedType.helpers({
    containerBasedType: function () {
        return Containers.find({type: Session.get("selected_widget_type")});
    }
});

Template.selectContainerInput.helpers({
    container: function () {
        return Containers.find();
    }
});

Template.chargeSlider.helpers({
    charge: function () {
        return Settings.findOne({}).graphSettings.charge;
    }
});
Template.chargeLabel.helpers({
    charge: function () {
        return Settings.findOne({}).graphSettings.charge;
    }
});
Template.linkDistanceSlider.helpers({
    linksDistance: function () {
        return Settings.findOne({}).graphSettings.linksDistance;
    }
});
Template.linkDistanceLabel.helpers({
    linksDistance: function () {
        return Settings.findOne({}).graphSettings.linksDistance;
    }
});
Template.updateTimeGraphLabel.helpers({
    updateTime: function () {
        return Settings.findOne({}).graphSettings.updateTime;
    }
});
Template.updateTimeGraphSlider.helpers({
    updateTime: function () {
        return Settings.findOne({}).graphSettings.updateTime;
    }
});

Template.chargeSlider.events({
    'change input[type=range]': function(event){
        let sliderValue = event.currentTarget.value;
        let s = Settings.findOne({});
        s.graphSettings.charge = sliderValue;
        Settings.update({_id: s._id}, s);
    }
});
Template.linkDistanceSlider.events({
    'change input[type=range]': function(event){
        let sliderValue = event.currentTarget.value;
        let s = Settings.findOne({});
        s.graphSettings.linksDistance = sliderValue;
        Settings.update({_id: s._id}, s);
    }
});
Template.updateTimeGraphSlider.events({
    'change input[type=range]': function(event){
        let sliderValue = event.currentTarget.value;
        let s = Settings.findOne({});
        s.graphSettings.updateTime = sliderValue;
        Settings.update({_id: s._id}, s);
    }
});

Template.settings.events({
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
            document.location.href="/";
        }
    },
    'click #removeVisModelBtn': function (e) {
        let widgetName = $('#removeVisModel_removeWidget').find(":selected").text();
        let id = Widgets.findOne({name: widgetName});
        Widgets.remove({_id: id._id});
        document.location.href="/";
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
            document.location.href="/";
        }
    },
    'click #removeContainerBtn': function (e) {
        let containerName = $('#removeContainer_selectContainer').find(":selected").text();
        let id = Containers.findOne({name: containerName});
        Containers.remove({_id: id._id});
        document.location.href="/";
    },
    'change #addVisModel_typeSelect': function (event) {
        Session.set("selected_widget_type", $('#addVisModel_typeSelect').find(":selected").text());
    }
});