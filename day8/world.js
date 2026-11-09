export const TRACKS = [
  ['HYAENA','Arrival','An unstable threshold. Danger, movement, and homecoming occupy the same ground.',280,540,0],
  ['THANK GOD','Refuge','Gratitude and freedom exist alongside ambition and spiritual conflict.',730,830,4],
  ['MODERN JAM','Spectacle','Physical energy becomes a shared space: freedom means more when others can enter.',1080,450,2],
  ['MY EYES','Perspective','A road into the inner self. What changes when we see the same place through another pair of eyes?',685,440,1],
  ["GOD’S COUNTRY",'Refuge','The promise of sanctuary carries an unsettled edge. Safety and threat share a boundary.',570,770,4],
  ['SIRENS','The Room','A room can hold a festival. A perfect destination may already be an ordinary place.',365,660,0],
  ['MELTDOWN','Spectacle','Status and rivalry leave a fault line through a landscape of monuments.',1140,260,2],
  ['FE!N','Spectacle','Appetite keeps moving in circles. The search for peace sits beside the demand for more.',1190,380,2],
  ['DELRESTO (ECHOES)','Memory','Rooms, statues, storms, and echoes give memory a physical architecture.',490,330,6],
  ['I KNOW ?','Uncertainty','Recognition slips in the hours before dawn. Familiar faces become uncertain reflections.',800,555,1],
  ['TOPIA TWINS','Spectacle','Pleasure arrives at the waterfront; connection may last only a moment.',1240,540,2],
  ['CIRCUS MAXIMUS','Spectacle','An arena of attraction and distraction. Being seen is not always the same as being known.',1015,330,2],
  ['PARASAIL','Refuge','Shade, water, memory, and recovery create a place to stop moving for a while.',855,735,4],
  ['SKITZO','Uncertainty','Night movement, vigilance, and return make the streets feel different at every turn.',930,525,3],
  ['LOST FOREVER','Displacement','Islands appear close while the ocean keeps them apart. Proximity does not guarantee belonging.',1325,690,3],
  ['LOOOVE','Spectacle','A gathering place formed by recognition, performance, and collective energy.',960,420,2],
  ['K-POP','Escape','A coast of remembered encounters and seductive destinations, with paths that loop back.',1420,540,3],
  ['TELEKINESIS','Possibility','Wealth, imagined fulfillment, and unresolved attachment complicate the view from above.',675,185,5],
  ['TIL FURTHER NOTICE','Departure','An ending leaves a question of direction. Several onward paths remain possible.',345,295,6],
].map(([title,region,note,x,y,chapter],i)=>({number:i+1,title,region,note,x,y,chapter}));

export const LOOKS = [
  {name:'THE ROOM',color:'#dfad73',point:5,headline:'Somewhere\ncan be here.',text:'Begin in an ordinary room. Watch its boundaries become the edges of a much larger world.',views:[[0,365,660,3.3,-.07],[12,385,625,2.8,-.04],[25,720,500,1.04,0],[34.4,750,490,1,0]]},
  {name:'PERSPECTIVE',color:'#e7be88',point:3,headline:'Another way\nto see.',text:'The terrain stays. The perspective changes. A narrow view gives way to the geography beneath it.',views:[[0,585,520,2.1,-.09],[8,625,480,2.5,-.07],[20.5,685,440,2.5,-.07],[24,755,415,1.35,.025],[35,700,420,1.7,.025],[54,780,390,1.5,0]]},
  {name:'SPECTACLE',color:'#f0995b',point:11,headline:'The pull\nof the crowd.',text:'Light gathers around the arena. Every route leads toward the center; quieter exits are still there.',views:[[0,850,410,1.25,-.04],[14,970,350,1.8,.02],[27,1015,330,2.6,.07],[43,1045,350,2.25,.04]]},
  {name:'DISPLACEMENT',color:'#97b0b0',point:14,headline:'Close is not\nconnected.',text:'The shore breaks into islands. Follow the spaces between them and consider what it means to belong.',views:[[0,1130,550,1.45,.035],[13,1260,655,1.8,-.03],[28,1325,690,2.3,-.07],[43,1300,660,1.8,-.04]]},
  {name:'REFUGE',color:'#a4b896',point:12,headline:'A place\nto breathe.',text:'The light softens. Water carries the route into shade, memory, and a moment of recovery.',views:[[0,1020,700,1.45,-.02],[15,900,740,2.1,.035],[34,855,735,2.7,.055],[51,820,720,2.2,.02]]},
  {name:'POSSIBILITY',color:'#e0c68e',point:17,headline:'Beyond\nwhat you have.',text:'Rise above the monuments without losing sight of them. Decide what you were looking for all along.',views:[[0,950,420,1.25,0],[25,800,310,1.6,-.045],[46,675,185,2.2,-.06],[58,690,250,1.5,-.02],[65,710,370,1.12,0]]},
  {name:'DEPARTURE',color:'#b9a6c5',point:18,headline:'No fixed\ndestination.',text:'There is no prescribed place to finish. Choose a place, return to the atlas, or take the journey again.',views:[[0,500,310,1.55,.025],[14,345,295,2.25,.04],[27,710,480,1.03,0],[32,740,490,1,0]]},
];

export const CHOICES = [
  {name:'Connection',track:15,caption:'Where the paths meet.'},
  {name:'Freedom',track:17,caption:'Where the horizon opens.'},
  {name:'Recognition',track:11,caption:'Where the lights gather.'},
  {name:'Peace',track:12,caption:'Where the river slows.'},
];
