module.exports = function (creep,hfalg) { //flag [0 - ничего от стандартного поведения, 1 - сдаем все в контроллер ]
    var logLevel=0;
    var ELowFringe=0.1; 
    var EMiddleFringe=0.5; 
    var EHighFringe=1; 
//var freeExt= GetFreeExtension(creep.room);
/*creep.memory.state [ Список состояний харвестов:
   <0 - рождается новый харви
    0 - новенький харви
    1 - зарезервировано
    2 - готов для получения задания на добычу ресурсов из memory.source
    3 - движется к месту раскопок
    4 - копает
    5 - закончил копать, энергии 100% готов получить задание на перевозку
    6 - едет сдавать энергию в memory.receiver [spawn,extension]
    7 - приехал к memory.receiver [spawn,extension]
    8 - сдал некоторую энергию в memory.receiver [spawn,extension] 
    9 - сдал всю энергию осталось меньше ELowFringe;
]
*/
var state=creep.memory.state;
switch (true) {
//------------------------------------------------------------------------------------------   
case state<0://обнаружен создающийся харвест
    creep.memory.state++;  
break;

//------------------------------------------------------------------------------------------    
case state==0://обнаружен свежий харвестр
    toLog(3,creep.name+'['+creep.memory.role+ '] - [00] я свежий харвестр');
    creep.memory.state=2; 
    creep.say("Rdy2work!");
break;//свежий харвестер

//------------------------------------------------------------------------------------------    
case state==1://резерв

break;//резерв

//------------------------------------------------------------------------------------------    
case state==2://готов для получения задания на добычу ресурсов из memory.source
    toLog(3,creep.name+'['+creep.memory.role+ '] - [02] готов получить задание на добычу');


    creep.memory.source=GetTargetResource(creep.room);
    toLog(3,creep.name+'['+creep.memory.role+ '] - [02] получил задание');
    creep.memory.state=3; 
    if (creep.memory.source != null) creep.memory.receiver = null;
    toLog(3,creep.name+'['+creep.memory.role+ '] - [04] выдвигаюсь');
break;//готов для получения задания на добычу ресурсов из memory.source

//------------------------------------------------------------------------------------------    
case state==3://двигаться к месту раскопок
    toLog(3,creep.name+'['+creep.memory.role+ '] - [03] двигаюсь к источнику '+creep.memory.source.x+','+creep.memory.source.y);

    creep.moveTo(creep.memory.source.x,creep.memory.source.y); //идем к заданному источнику


    if (creep.pos.getRangeTo(creep.memory.source.x,creep.memory.source.y)<=1) {//определяем, что достигнули источника
        toLog(3,creep.name+'['+creep.memory.role+ '] - [03] достигнут источник '+creep.memory.source.x+','+creep.memory.source.y);
        creep.memory.state=4; 
    }

break;//двигаться к месту раскопок

//------------------------------------------------------------------------------------------    
case state==4://копает
    if (creep.carry.energy==creep.carryCapacity) {//харвестер полный
        toLog(4,creep.name+ '['+creep.memory.role+ '] - [04] я заполнен');
        creep.memory.state=5;
        //creep.say("Well done!");
    } else {
        var sources = creep.room.lookForAt('source', creep.memory.source.x,creep.memory.source.y);
        if (sources.length>0) { //если есть источник в указанной точке
            creep.harvest(sources[0]); //копаем источник
            toLog(4,creep.name+ '['+creep.memory.role+ '] - [04] я копаю');
        }   

        if (creep.memory.source.energy==0) {//если источник пуст
           toLog(3,creep.name+'['+creep.memory.role+ + '] - [04] источник пуст');
            creep.memory.source = null;
            creep.memory.state=2; //искать другой источник TODO сделать проверку на то на сколько полон харвестер и в функции на получение источника сделать условие на исключение пустых источников
        }
    }
break;//копает

//------------------------------------------------------------------------------------------    
case state==5://закончил копать, энергии 100% готов получить задание на перевозку
    toLog(4,creep.name+'['+creep.memory.role+ '] - [05] готов получить задание на перевозку');
    if (hfalg==1 && Game.spawns.Spawn1.energy/Game.spawns.Spawn1.energyCapacity>0.9) {//если больше спавнить ненадо и полный 
        creep.memory.receiver=creep.room.controller; //сдаем в контроллер

    } else
    {
        if (Game.spawns.Spawn1.energy/Game.spawns.Spawn1.energyCapacity>0.9) { //если мало места в спавне
        var freeExt= GetFreeExtension(creep.room);
        if (freeExt!=0) { //если вернулся расширитель а не ноль
            toLog(4,creep.name+'['+creep.memory.role+ '] - [05] получен целевой расширитель');
            if (creep.memory.receiver==null) {creep.memory.receiver = freeExt;}//ставим целью для сдачи ресурса данный расширитель
        } else
        {
            creep.memory.receiver = Game.spawns.Spawn1; //расширителей нет отправляем в спавн 
        }
    } else
    {   
        creep.memory.receiver = Game.spawns.Spawn1;
    }
    }
    if (creep.memory.receiver != null) creep.memory.source = null;;
    toLog(4,creep.name+'['+creep.memory.role+ '] - [05] задание на перевозку получено');
    creep.memory.state=6;
break;//закончил копать, энергии 100% готов получить задание на перевозку

//------------------------------------------------------------------------------------------    
case state==6://едет сдавать энергию в memory.receiver [spawn,extension]
    toLog(4,creep.name+'['+creep.memory.role+ '] - [06] двигаюсь к получателю '+creep.memory.receiver.pos.x+','+creep.memory.receiver.pos.y);

    creep.moveTo(creep.memory.receiver.pos.x,creep.memory.receiver.pos.y); //идем к заданному источнику


    if (creep.pos.getRangeTo(creep.memory.receiver.pos.x,creep.memory.receiver.pos.y)<=1) {//определяем, что достигнули источника
        toLog(4,creep.name+'['+creep.memory.role+ '] - [06] достигнут получатель '+creep.memory.receiver.pos.x+','+creep.memory.receiver.pos.y);
        creep.memory.state=7; 
    }
break;//едет сдавать энергию в memory.receiver [spawn,extension]

//------------------------------------------------------------------------------------------    
case state==7://приехал к memory.receiver [spawn,extension]
    if (creep.carry.energy/creep.carryCapacity < ELowFringe) {//харвестер относительно пуст
        toLog(4,creep.name+ '['+creep.memory.role+ '] - [07] я пустой');
        creep.memory.state=9;
        //creep.say("On my way!");
    } else {//харвестер еще полон

        var receivers = creep.room.lookForAt('structure', creep.memory.receiver.pos.x,creep.memory.receiver.pos.y); 
        if (receivers.length>0) {//если есть получатель в указанной точке

            toLog(4,creep.name+'['+creep.memory.role+ '] - [07] в указаной точке найден получатель');


            if (receivers[0].structureType==STRUCTURE_CONTROLLER && receivers[0].pos.x==36 && receivers[0].pos.y==20){
                    creep.upgradeController(receivers[0]);
                    toLog(4,creep.name+ '['+creep.memory.role+ '] - [07] Отдали энергию в контроллер ');
                    break; 
                } else toLog(4,creep.name+ '['+creep.memory.role+ '] - [07] не структура контроллера! '+receivers[0].structureType);



            if (receivers[0].energy==receivers[0].energyCapacity) {//если получатель заполнен
               toLog(4,creep.name+'['+creep.memory.role+  '] - [07] получатель заполнен');
                creep.memory.receiver = null;
                creep.memory.state=8; //искать другой источник TODO сделать проверку на то на сколько полон харвестер и в функции на 
            } else {
                var amount=receivers[0].energyCapacity-receivers[0].energy;
                if (amount > creep.carry.energy) amount=creep.carry.energy;

                var answer=creep.transferEnergy(receivers[0],amount); //передаем энергию в получатель
                toLog(4,creep.name+ '['+creep.memory.role+ '] - [07] флаг передачи='+answer);

            }

        }


    }
break;  //приехал к memory.receiver [spawn,extension]

//------------------------------------------------------------------------------------------    
case state==8://сдал некоторую энергию в memory.receiver [spawn,extension] 
    toLog(3,creep.name+'['+creep.memory.role+ '] - [08] сдал энергию, и еще осталось');

    if (hfalg==1 && Game.spawns.Spawn1.energy/Game.spawns.Spawn1.energyCapacity>0.9) {//если больше спавнить ненадо и полный 
    //если крипов производить ненадо их много, то сдаем все добытое в контроллер комнаты
            creep.memory.receiver=creep.room.controller;//сдаем все в контроллер
            creep.memory.state=6;

    } else {

            //ищем ближайший расширитель с меньшей очередью

    var FreeExtension = GetFreeExtension(creep.room);   
    if (FreeExtension!=0) {//если есть

        creep.memory.receiver=FreeExtension;

        creep.memory.state=6;   
    }
        }
break;//сдал некоторую энергию в memory.receiver [spawn,extension] 

//------------------------------------------------------------------------------------------    
case state==9://сдал всю энергию осталось меньше ELowFringe;
    toLog(3,creep.name+'['+creep.memory.role+ '] - [09] сдал всю энергию');
    creep.memory.state=2; 
break;//сдал всю энергию осталось меньше ELowFringe;

//------------------------------------------------------------------------------------------    
case state>9:
    toLog(0,'state='+creep.memory.state); 
break;

//------------------------------------------------------------------------------------------    
case state==null:
    toLog(0,'state='+creep.memory.state); 
break;
}

function GetTargetResource(Xroom) { //возвращает ресурс близкий к крипу
        //creep.memory.receiver=null;
        //toLog(3,creep.name+ '[03] Энергии в харвесте слишком мало');
        //Проверяем на запрещенные источники
       toLog(3,'Проверка на запрещеные источники');
        var sourcesT = Xroom.find(FIND_SOURCES_ACTIVE)
        var sources = [];
        for (var i in sourcesT) {
           toLog(3,'Проверка присутсвие флага в точке: '+sourcesT[i].pos.x+',' +sourcesT[i].pos.y);
            var posflag = Xroom.lookForAt('flag', sourcesT[i])
            if (posflag.length > 0) {
               if (logLevel>=3)  console.log('Найден флаг в точке: '+posflag[0].name);
            } 
            else
            {
               toLog(3,'Флаг отсутствует в точке: ');
                sources.push(sourcesT[i]); //помещаем в список доступных ресурсов
            }
        }

        //Сортируем разрешенные источники по растоянию от крипа до них
        sources.sort(function(a, b) { //сортируем список ресурсов по расстоянию от крипа до ресурса
            var aDeltaX = Math.abs(creep.pos.x - a.pos.x);
            var aDeltaY = Math.abs(creep.pos.y - a.pos.y);
            var aDelta = Math.sqrt(aDeltaX + aDeltaY);

            var bDeltaX = Math.abs(creep.pos.x - b.pos.x);
            var bDeltaY = Math.abs(creep.pos.y - b.pos.y);
            var bDelta = Math.sqrt(bDeltaX + bDeltaY);

            return aDelta < bDelta;
        });

        var harvesters = Xroom.find(FIND_MY_CREEPS, function(crep) { //ищем все харвестеры в комнате
            return crep.memory.role == 'harvester';
        });
        var target = sources[0];  //ставим по умолчанию целью первый ресурс в списке
        for (var i in sources) {//считаем количество харвесотв на каждый ресурс
            var count = 0;
            for (var j in harvesters) {
                if (harvesters[j].memory.source &&
                        sources[i].pos.x == harvesters[j].memory.source.x &&
                        sources[i].pos.y == harvesters[j].memory.source.y) {
                    count++;
                }
            }
            if (count < 3) { //если данный ресурс копают меньше 3 харвестов 
            //TODO сделать условие динамически зависимость от растрояния от спавна до ресурса и учитывая общее количество крипов
                target = sources[i];
            }
        }

        var TargetSource = {
            id: target.id,
            x: target.pos.x,
            y:  target.pos.y
        }
      return TargetSource;

}

function GetFreeExtension(Xroom) {// Возвращает расширитель с меньшей очередью по возможности пустой и самый близкий к крипу
    var FreeExtensions = Xroom.find(FIND_MY_STRUCTURES, { //ищем любые расширители если находим то установим по умолчанию первый попавшийся
                filter: function(i) {
                    if (i.structureType == STRUCTURE_EXTENSION ) return i;
                    //if (i.structureType == STRUCTURE_EXTENSION && i.energy<i.energyCapacity) return i;
                    }});
    var FreeExtension = 0;//если расширители не найдутся то вернем 0
    toLog(0,creep.name+ '[11] Проверяем есть ли Расширители в комнате');
    if (FreeExtensions.length>0) { //если есть расширители
        toLog(3,creep.name+ '[11] Расширители имеются');
        //ищем тот который пустой
        FreeExtensions = null;
       toLog(0,creep.name+ '[12] Ищем пустой расширитель');
        FreeExtensions = Xroom.find(FIND_MY_STRUCTURES, { //ищем любые расширители если находим то установим по умолчанию первый попавшийся
                filter: function(i) {if (i.structureType == STRUCTURE_EXTENSION && i.energy<i.energyCapacity) return i;}});
        if (FreeExtensions.length>0) { //если нашли пустые расширители
           toLog(0,creep.name+ '[12] Нашли пустой расширитель');
             FreeExtension = FreeExtensions[0]; //ставим первый свободный расширитель
        } else {
           toLog(0,creep.name+ '[12] Пустых расширителей нет');
            // Получаем упорядоченный список расширителей  по возрастанию очереди в них
           toLog(3,creep.name+ '[13] Получаем очереди в расширители');
            var QueuesExtensions = GetExtensionsSmallQueue(Xroom);  
            if (QueuesExtensions.length>0) {//если список не пустой
            var smallest=1000;
           toLog(3,creep.name+ '[13] Получили очереди, перебираем где меньше');
                 for (var i in QueuesExtensions) {
                    if (QueuesExtensions[i].Count<smallest) {
                        smallest=QueuesExtensions[i].Count;
                        FreeExtension = QueuesExtensions[i].Ext;//ставим первого расширителя с наименьшей очередью как цель для сдачи ресурса    
                       toLog(4,creep.name+ '[13] Получили меньшую очередь в '+FreeExtension.pos.x+','+FreeExtension.pos.y);
                    }                 

                 }
            }
          }
        }

   return FreeExtension;


}


function GetExtensionsSmallQueue(Xroom) {


    var Queues = [];
    //var FindedExtensions = Xroom.find(FIND_MY_STRUCTURES);
    //ищем любые расширители
    var FindedExtensions = Xroom.find(FIND_MY_STRUCTURES, {filter: function(i) {if (i.structureType == STRUCTURE_EXTENSION || i.structureType == STRUCTURE_SPAWN) return i;}});
    var harves = creep.room.find(FIND_MY_CREEPS, function(creep) {return creep.memory.role == 'harvester';}); //находим всех харвестеров
        // считаем очередь
         for (var i in FindedExtensions) {
            var count = 0;
            for (var j in harves) {
                if (harves[j].memory.receiver && // если харви стоит в очереди
                        FindedExtensions[i].pos.x == harves[j].memory.receiver.pos.x &&
                        FindedExtensions[i].pos.y == harves[j].memory.receiver.pos.y
                        ) { //если совпадают координаты целевого расширителя
                            if (i.structureType == STRUCTURE_SPAWN){
                                count=count+0.5; //добавляем +1 к очереди на данный спавн
                            } else {
                                count++; //добавляем +1 к очереди на данный расширитель
                            }

                        }
            }
            Queues.push({Ext: FindedExtensions[i], Count:count});
           toLog(4,creep.name+ ': В список очередей добавлен расширитель: '+FindedExtensions[i].pos.x+','+FindedExtensions[i].pos.y+' , очередь в него:'+count);
         }


      Queues.sort(function (a, b) {
        if (a.count > b.count) {
            return 1;
        }
        if (a.count < b.count) {
            return -1;
        }
        // a равно b
        return 0;
        });  

        if (logLevel>=3) {
			toLog(3,creep.name+ ' Упорядоченный Список Queues:');
            for (var i in Queues) {
                toLog(4,creep.name+ ' pos:'+i+' Ext:'+Queues[i].Ext.pos.x+','+Queues[i].Ext.pos.y+' count:'+Queues[i].Count);
            }
        }
      return Queues;
   }//end function  

function toLog(loglvl,msg) { //вывод в лог
    if (logLevel>=loglvl) console.log(msg);
}

}
