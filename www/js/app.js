var MC = monaca.cloud;
var lastUpdated;
var html = "<li>{0}<br/>{1}</li>";

$(window).load(function() {
    MC.Push.setHandler(onNotified);
    $("#footer").stickyFooter({
        // The class that is added to the footer.
        class: 'sticky-footer',
    
        // The footer will stick to the bottom of the given frame. The parent of the footer is used when an empty string is given.
        frame: '',
    
        // The content of the frame. You can use multiple selectors. e.g. "#header, #body"
        content: '#content'
    });
    $("#send").click(onSend);
});

function onSend() {
    console.debug("onSend");
    var message = $("#message").val();
    MC.Collection("Message").insert({message: message})
    .done(function(result) {
        console.debug("done");
        $("#messages").append(html.format(formatDate(new Date(Date.parse(result._createdAt))), result.message));
        $("#message").val("");
        $("#content").scrollTop($("#content")[0].scrollHeight);
        lastUpdated = new Date();
        MC.Push.send({
             pushProjectId:"ThDimlTtyS3FVdcK"
            ,platform: "android"
            ,target:"debugger"
            ,buildType:"debug"
            ,title:"push from debugger"
            ,message:"message"
            ,json:"{}"
        });
    })
    .fail(function(err) {
        console.error(JSON.stringify(err));
    });
}

function onNotified(data) {
    alert("onNotified");
    console.debug("onNotified");
    var criteria = monaca.cloud.Criteria('_createdAt >= "{0}"'.format(formatDate(lastUpdated)));
    MC.Collection("Message").find(criteria, "_createdAt ASC", {propertyNames: ["message", "_createdAt"]})
    .done(function(result) {
        console.debug("done");
        for(i = 0; i < result.items.length; i++) {
            item = result.items[i];
            $("#messages").append(html.format(item._createdAt, item.message));
        }
        lastUpdated = new Date();
    })
    .fail(function(err) {
        console.error(JSON.stringify(err));
    });
}