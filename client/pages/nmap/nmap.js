Template.agentsList.helpers({
    agent: function () {
        return Agents.find();
    }
});


Template.makeAgent.events({
    'click #addAgentBtn': function (e) {
        let name = $('#addAgentName_Field').val();
        let location = $('#addAgentLocation_Field').val();
        Agents.insert({
            name: name,
            location: location,
            status: "false"
        });
        let file = Files.findOne({name : "agentTemplate"}).file;
        file = file.replace("HERE MUST BE URL", Settings.findOne({}).serverUrl).replace("HERE MUST BE AGENT NAME", name);

        function download(filename, text) {
            let element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        }
        download('agent '+name, file);
        //console.log(file);
    }
});

Template.agentItem.helpers({
    'isTrue': function(state){
        console.log(state);
        return state;
    }
});

Template.agentsList.events({
    'click #deleteAgentBtn': function (e) {
        let id = Agents.findOne({name: this.name});
        Agents.remove({_id: id._id});
    }
});