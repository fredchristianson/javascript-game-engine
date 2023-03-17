
exports.log = function (req, res) {
    console.log("LOG: " + req.body.formattedMessage);
    res.end(JSON.stringify({ success: true }));
};
