/**
 * Created by Guardeec on 11.07.17.
 */

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

