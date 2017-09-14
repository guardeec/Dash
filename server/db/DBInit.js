if (Pages.find().count() === 0) {
  Pages.insert({
      name: 'Dashboard',
      url: "/"
  });

  Pages.insert({
      name: 'Nmap',
      url: "/nmap"
  });

  Pages.insert({
      name: 'Settings',
      url: "/settings"
  });
}

if(Files.find().count() === 0){
  Files.insert({
     name: "agentTemplate",
     file: Assets.getText('agentTemplate.js')
  });
}

if(RawData.find().count() === 0){
  RawData.insert({
      name: "network",
      data: "{}"
  });
}

if(Settings.find().count() === 0){
  Settings.insert({
     serverUrl: "http://91.151.187.30:1111/"
  });
}

if (Widgets.find().count() === 0) {

  Widgets.insert({
    type: "Pie Chart",
    width: "3",
    height: "3",
    name: "pie1",
    x: 0,
    y: 0,
    container: "packagesCounter"
  });
  //
  // Widgets.insert({
  //   type: "Bar Chart",
  //   width: "3",
  //   height: "3",
  //   name: "bar1",
  //   x: 0,
  //   y: 0,
  //   container: "packagesCounterOfLastMinute"
  // });
  //
  // Widgets.insert({
  //   type: "Line Chart",
  //   width: "3",
  //   height: "3",
  //   name: "line1",
  //   x: 0,
  //   y: 0,
  //   container: "packagesCounterIpOfLastMinute"
  // });
  //
  // Widgets.insert({
  //   type: "Spline Chart",
  //   width: "3",
  //   height: "3",
  //   name: "spline1",
  //   x: 0,
  //   y: 0,
  //   container: "packagesCounterWholeOfLastMinute"
  // });
}

if (Containers.find().count() === 0) {
//  Containers.insert({
//    type: "Bar Chart",
//    name: "container2",
//    data: {
//      data1: 30,
//      data2: 67
//    }
//  });
//  
//  Containers.insert({
//    type: "Line Chart",
//    name: "container1",
//    data: {
//      data1: [30, 200, 100, 400, 150, 250],
//      data2: [50, 20, 10, 40, 15, 25]
//    }
//  });
//  
//  Containers.insert({
//    type: "Spline Chart",
//    name: "container1",
//    data: {
//      data1: [30, 200, 100, 400, 150, 250],
//      data2: [50, 20, 10, 40, 15, 25]
//    }
//  });
  
  Containers.insert({
        type: "Pie Chart",
        name: "packagesCounter",
        data: {"2048" : 57, "2054" : 10}
  });

}
