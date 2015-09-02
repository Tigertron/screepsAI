Creep.prototype.moveByHeart = function(dst, rebuild) {
  if (typeof(rebuild) ==='undefined') rebuild = true;

  if(!this.memory.path || this.memory.dst != dst.id || ( (Game.time - this.memory.pathBorn > 30 ) && rebuild ) ){
    this.memory.dst = dst.id;
    this.memory.path = this.pos.findPathTo(dst);
    this.memory.pathBorn = Game.time;
  }
  var error = this.moveByPath(this.memory.path);
  if(error != OK && error != ERR_TIRED)
    this.clearPath();
};

Creep.prototype.continueMove = function() {
  if(this.memory.path)
    this.moveByPath(this.memory.path);
}

Creep.prototype.clearPath = function(dst) {
  this.memory.path = null;
};

module.exports = {

}