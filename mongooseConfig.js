const mongoose = require("mongoose");
module.exports = {
    mongoose,
    connect: () => {
        mongoose.Promise = Promise;
        mongoose
            .connect("mongodb://127.0.0.1:27017/BackendProject", {
                useNewUrlParser: true,
                useCreateIndex: true,
                dropSchema: true,
                useFindAndModify: false
            })
            .then(() => {
                console.log('DB connection successful!')
            });
    },
    disconnect: done => {
        mongoose.disconnect(done);
    }
};