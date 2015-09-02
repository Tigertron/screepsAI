var harvester = require('role_harvester');
var builder = require('role_builder');
var guard = require('role_guard');
var transporter = require('role_transporter');

var harvesters_count = 0;
var harvesters_needed = 1;
var transporters_count = 0;
var transporters_needed = 4;
var harvesters1_count = 0;
var harvesters1_needed = 3;
var builders_count = 0;
var builders_needed = 3;
var guards_count = 0;
var guards_needed = 0;

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
    if (harvesters_count < harvesters_needed)
    {
        body = [WORK, MOVE]; role = "harvester"; // 150
    }
    else if (transporters_count < transporters_needed)
    {
        body = [CARRY, MOVE]; role = "transporter"; // 100
    }
    else if (harvesters_count < harvesters1_needed)
    {
        body = [WORK, WORK, MOVE]; role = "harvester"; // 250
    }
    else if (builders_count < builders_needed)
    {
        body = [WORK, WORK, CARRY, MOVE]; role = "builder"; // 300
    }
    else if (guards_count < guards_needed)
    {
        body = [TOUGH, ATTACK, MOVE, MOVE]; role = "guard"; // 190
    }

    if(role != "")
    {
        var i = 0;
        var name = role+i;
        while(Game.creeps[name] !== undefined) {
            i++;
            name = role+i;
        }
        
        var res = spawn.createCreep( body, name, { role: role } );
        if ( res == OK)
            console.log("Spawning new " + role);
        else if (res == ERR_NAME_EXISTS)
            console.log("Name: '" + role + num +"' existed");
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






