$(function () {

    // Initialize jQuery UI buttons
    $("button").button();

    // Initialize tabs
    $("#dashboardTabs").tabs();

    // Initialize datepicker
    $("#customerDate").datepicker();

    // Initialize accordion
    $("#accordion").accordion({
        collapsible: true,
        heightStyle: "content"
    });

    // Initialize customer dialog
    $("#customerDialog").dialog({
        autoOpen: false,
        modal: true,
        width: 450,
        buttons: {
            "Create Customer": function () {
                var name = $("#customerName").val();
                var email = $("#customerEmail").val();

                if (!name || !email) {
                    alert("Please enter a name and email.");
                    return;
                }

                alert("Customer created: " + name);
                $(this).dialog("close");
            },

            "Cancel": function () {
                $(this).dialog("close");
            }
        }
    });

    // Open customer dialog
    $("#newCustomerButton").on("click", function () {
        $("#customerDialog").dialog("open");
    });

});