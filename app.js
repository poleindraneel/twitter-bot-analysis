var Twitter = require('twitter');
var config = require('./config.js');
var fs = require('fs');

var T = new Twitter(config);

var params = {
    q: 'devendrafadnavis',
    count: 100,
    result_type: 'recent'
}

T.get('search/tweets', params, function (err, data, response) {
    if (!err) {
        var statuses = mapResult(data);
        fs.writeFile(`./result/myresult_${Date.now()}.json`,JSON.stringify(statuses),(err)=> {
            if(!err) {
                console.log("Success");
            } else {
                console.log("Error while writing to file", err);
            }
        });
        console.log("Message", statuses);
    } else {
        console.log("error", err);
    }
});

function mapResult(data) {
   var statuses = data.statuses.map(({
        text,
        created_at,
        source,
        user,
        place,
        lang
    }) => ({
        text,
        created_at,
        source,
        user,
        place,
        lang
    }));
    if (statuses) {
        for (var i = 0; i < statuses.length; i++) {
            if (statuses[i] && statuses[i].user) {
                statuses[i].user = {
                    name: statuses[i].user.name,
                    description: statuses[i].user.description,
                    created_at: statuses[i].user.created_at,
                    location: statuses[i].user.location
                };
            }
        }
    }
    return statuses;
}