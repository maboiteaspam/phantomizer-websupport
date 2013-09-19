define(["vendors/go-domain/jquery.json-2.4.min"], function($) {
    return function (Name, http_response_code, action_status, action_content){
        return function(/*ignored_args*/){
            return $.ajax({
                type: "POST",
                url: "/pong/todo"+Name,
                dataType: "json",
                data: {response_code:http_response_code, response_body: $.toJSON({status:action_status, data:action_content})}
            });
        };
    };
});