//module: PushBody 
module.exports = function (Body, PartBody,HowMany) {
   for (var i = 1; i <= HowMany; i++) {
    Body.push(PartBody);
    console.log('add body part '+PartBody);
   }
}