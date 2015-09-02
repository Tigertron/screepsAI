var harvester = require('harvester');
var builder = require('builder');
var guard = require('guard');
var transporter = require('transporter');

var harvesters_count = 0;
var harvesters_needed = 1;
var transporters_count = 0;
var transporters_needed = 1;
var harvesters1_count = 0;
var harvesters1_needed = 2;
var builders_count = 0;
var builders_needed = 0;
var guards_count = 0;
var guards_needed = 5;

var transporters = {};
for(var name in Game.creeps) 
{
	var creep = Game.creeps[name];

    if (creep.memory.role == "guard")
    {
        guards_count++;
        guard(creep);
    }
    if (creep.memory.role == "harvester")
    {
        harvesters_count++;
        harvester(creep);
    }
    if (creep.memory.role == "builder")
    {
        builders_count++;
        builder(creep);
    }
    if (creep.memory.role == "transporter")
    {
        transporters_count++;
        transporters[name] = creep;
    }
}

Game.rooms.sim.find(FIND_DROPPED_ENERGY).forEach(function(energy) {
    for(var name in transporters) 
    {
        var creep = Game.creeps[name];
        
        if (creep.memory.in_work == undefined || !creep.memory.in_work)
        {
            transporter(creep, energy);
            //continue;
        }
    }
});

var spawn = Game.spawns.Spawn1;
var is_spawn_free = (spawn.spawning == null);

if (is_spawn_free)
{
    var body;
    var role = "";
    var num = 0;
    if (harvesters_count < harvesters_needed)
    {
        num = harvesters_count; body = [WORK, MOVE]; role = "harvester"; // 150
    }
    else if (transporters_count < transporters_needed)
    {
        num = transporters_count; body = [CARRY, MOVE]; role = "transporter"; // 100
    }
    else if (harvesters_count < harvesters1_needed)
    {
        num = harvesters_count; body = [WORK, WORK, MOVE]; role = "harvester"; // 250
    }
    else if (builders_count < builders_needed)
    {
        num = builders_count; body = [WORK, CARRY, CARRY, MOVE, MOVE]; role = "builder"; // 300
    }
    else if (guards_count < guards_needed)
    {
        num = guards_count; body = [TOUGH, ATTACK, MOVE, MOVE]; role = "guard"; // 190
    }

    if(role != "")
    {
        var res = spawn.createCreep( body, role + num, { role: role } );
        if ( res == OK)
            console.log("Spawning new " + role);
        else if (res == ERR_NAME_EXISTS)
            console.log("Name: '" + role + num +"' have been taken");
    }
}

if(Memory.inited == undefined || !Memory.inited)
{
    Memory.inited = true;
    Memory.energy = 0;
    Memory.steps = 0;
}

Memory.steps++;
if (Memory.steps%10 == 0)
    console.log("Energy: " + Memory.energy + " Steps: "+ Memory.steps + " Harvesters: " + (harvesters_count+harvesters1_count) + " Averange: " + Memory.energy/Memory.steps);


