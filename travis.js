const fs = require('fs');
fs.writeFile("./functions/rails-private-key.json", process.env.KEY, function(err) {
    if(err) {
        return console.log(err);
    }
});
