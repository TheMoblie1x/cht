// scripts/generate-sample-data.js
// Run: node scripts/generate-sample-data.js
const fs = require('fs');
const path = require('path');

const CHART_TYPES = [
  'line','area','bar','pie','doughnut','scatter','bubble','heatmap','treemap','radar',
  'candlestick','ohlc','gauge','sunburst','icicle','partition','parallel','waterfall',
  'surface','scatter3d','bar3d','line3d','area3d','volume','globe','map3d','tube',
  'ribbon','cone','pyramid','scatterBubble3d','cone3d','cylinder'
];

const OUT_DIR = path.join(process.cwd(), 'data', 'sample');
const PER_TYPE = 50; // set 40-50 as requested (adjustable)

// small helper randoms
const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const choice = (arr) => arr[Math.floor(Math.random() * arr.length)];

// common generator helpers
function timeSeries(fields = ['value'], count = 12) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return {
    columns: [{ name: 'month', type: 'string', displayName: 'Month' }, ...fields.map(f=>({name:f,type:'number',displayName:f}))],
    rows: months.slice(0,count).map(m => {
      const row = { month: m };
      for (const f of fields) row[f] = rnd(10, 300);
      return row;
    }),
    metadata: { rowCount: count, columnCount: fields.length + 1, generatedAt: new Date().toISOString(), source: 'timeSeries' }
  };
}

function categoryData(categories = ['A','B','C','D'], metrics = ['value']) {
  return {
    columns: [{ name: 'category', type: 'string', displayName: 'Category' }, ...metrics.map(m=>({name:m,type:'number',displayName:m}))],
    rows: categories.map(cat => {
      const r = { category: cat };
      for (const m of metrics) r[m] = rnd(5, 500);
      return r;
    }),
    metadata: { rowCount: categories.length, columnCount: metrics.length + 1, generatedAt: new Date().toISOString(), source: 'category' }
  };
}

function pieData(n=5) {
  const names = Array.from({length:n}, (_,i)=>`Category ${String.fromCharCode(65+i)}`);
  return {
    columns: [{name:'name',type:'string',displayName:'Name'},{name:'value',type:'number',displayName:'Value'}],
    rows: names.map(nm => ({ name: nm, value: rnd(5,100) })),
    metadata: { rowCount: n, columnCount: 2, generatedAt: new Date().toISOString(), source: 'pie' }
  };
}

function scatterData(count=30) {
  const rows = Array.from({length:count}, ()=>({ x: rnd(0,200), y: rnd(0,200), size: rnd(10,100) }));
  return { columns:[{name:'x',type:'number'},{name:'y',type:'number'},{name:'size',type:'number'}], rows, metadata:{rowCount:count,columnCount:3,generatedAt:new Date().toISOString(),source:'scatter'} };
}

function bubbleData(count=20) {
  const rows = Array.from({length:count}, ()=>({ x: rnd(0,200), y: rnd(0,200), size: rnd(50,200), category: choice(['A','B','C']) }));
  return { columns:[{name:'x',type:'number'},{name:'y',type:'number'},{name:'size',type:'number'},{name:'category',type:'string'}], rows, metadata:{rowCount:count,columnCount:4,generatedAt:new Date().toISOString(),source:'bubble'} };
}

function heatmapData(rows=7,cols=24) {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const rowData = [];
  for (let d=0; d<rows; d++) {
    for (let h=0; h<cols; h++) {
      rowData.push({ day: days[d], hour: `${h}:00`, value: rnd(10,100) });
    }
  }
  return { columns:[{name:'day',type:'string'},{name:'hour',type:'string'},{name:'value',type:'number'}], rows: rowData, metadata:{rowCount:rows*cols,columnCount:3,generatedAt:new Date().toISOString(),source:'heatmap'} };
}

function treemapData() {
  return {
    columns: [{name:'id',type:'string'},{name:'parent',type:'string'},{name:'value',type:'number'},{name:'color',type:'number'}],
    rows: [
      {id:'root',parent:'',value:0,color:0},
      {id:'a',parent:'root',value:rnd(10,100),color:rnd(1,10)},
      {id:'b',parent:'root',value:rnd(10,100),color:rnd(1,10)},
      {id:'a1',parent:'a',value:rnd(5,50),color:rnd(1,10)},
      {id:'a2',parent:'a',value:rnd(5,50),color:rnd(1,10)},
      {id:'b1',parent:'b',value:rnd(5,50),color:rnd(1,10)},
      {id:'b2',parent:'b',value:rnd(5,50),color:rnd(1,10)},
    ],
    metadata: { rowCount: 7, columnCount: 4, generatedAt: new Date().toISOString(), source: 'treemap' }
  };
}

function radarData() {
  const axes = ['Speed','Strength','Defense','Magic','Stamina'];
  return {
    columns: [{name:'axis',type:'string'},{name:'value',type:'number'}],
    rows: axes.map(ax => ({ axis: ax, value: rnd(20,100) })),
    metadata: { rowCount: axes.length, columnCount: 2, generatedAt: new Date().toISOString(), source: 'radar' }
  };
}

function ohlcData(count=20) {
  return {
    columns: [{name:'date',type:'string'},{name:'open',type:'number'},{name:'high',type:'number'},{name:'low',type:'number'},{name:'close',type:'number'}],
    rows: Array.from({length:count}, (_,i) => {
      const base = 100 + i;
      const open = +(base + Math.random() * 8).toFixed(2);
      const close = +(base + Math.random() * 8).toFixed(2);
      const high = Math.max(open, close) + +(Math.random()*10).toFixed(2);
      const low = Math.min(open, close) - +(Math.random()*8).toFixed(2);
      return { date: `Day ${i+1}`, open, high, low, close };
    }),
    metadata:{rowCount:count,columnCount:5,generatedAt:new Date().toISOString(),source:'ohlc'}
  };
}

function gaugeData() {
  return { columns:[{name:'metric',type:'string'},{name:'value',type:'number'},{name:'max',type:'number'}], rows:[{metric:'KPI', value: rnd(10,99), max:100}], metadata:{rowCount:1,columnCount:3,generatedAt:new Date().toISOString(),source:'gauge'} };
}

function surfaceData(xCount=10,yCount=10) {
  const rows = Array.from({length:xCount*yCount}, (_,i)=>({ x: i % xCount, y: Math.floor(i/xCount), z: +(Math.sin(i/5)*50 + 50).toFixed(2) }));
  return { columns:[{name:'x',type:'number'},{name:'y',type:'number'},{name:'z',type:'number'}], rows, metadata:{rowCount:rows.length,columnCount:3,generatedAt:new Date().toISOString(),source:'surface'} };
}

function scatter3DData(count=30) {
  const rows = Array.from({length:count}, ()=>({ x: rnd(0,200), y: rnd(0,200), z: rnd(0,200), size: rnd(10,300) }));
  return { columns:[{name:'x',type:'number'},{name:'y',type:'number'},{name:'z',type:'number'},{name:'size',type:'number'}], rows, metadata:{rowCount:rows.length,columnCount:4,generatedAt:new Date().toISOString(),source:'scatter3d'} };
}

function bar3DData() { return categoryData(['North','South','East','West'], ['q1','q2','q3']); }
function line3DData() { return timeSeries(['series1','series2'],12); }
function volumeData() { return surfaceData(8,8); }
function globeData() {
  return { columns:[{name:'country',type:'string'},{name:'lat',type:'number'},{name:'lng',type:'number'},{name:'value',type:'number'}], rows:[
    {country:'USA',lat:37.09,lng:-95.71,value:rnd(10,300)},
    {country:'China',lat:35.86,lng:104.19,value:rnd(10,300)},
    {country:'India',lat:20.59,lng:78.96,value:rnd(10,300)},
    {country:'Brazil',lat:-14.23,lng:-51.92,value:rnd(10,300)},
    {country:'AU',lat:-25.27,lng:133.77,value:rnd(10,300)},
  ], metadata:{rowCount:5,columnCount:4,generatedAt:new Date().toISOString(),source:'globe'} };
}

function tubeData(count = 40) {
  const rows = Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1) * Math.PI * 2;
    return {
      x: +(Math.cos(t) * (50 + 10 * Math.sin(t))).toFixed(2),
      y: +(Math.sin(t) * (50 + 10 * Math.cos(t))).toFixed(2),
      z: +(i * 2).toFixed(2),
      radius: +(10 + 5 * Math.sin(t)).toFixed(2),
    };
  });
  return { columns: [{ name: 'x', type: 'number' }, { name: 'y', type: 'number' }, { name: 'z', type: 'number' }, { name: 'radius', type: 'number' }], rows, metadata: { rowCount: rows.length, columnCount: 4, generatedAt: new Date().toISOString(), source: 'tube' } };
}

function ribbonData(count = 50) {
  const rows = Array.from({ length: count }, (_, i) => ({
    x: +(i * 2).toFixed(2),
    y: +(Math.sin(i / 5) * 30).toFixed(2),
    z: +(Math.cos(i / 5) * 30).toFixed(2),
  }));
  return { columns: [{ name: 'x', type: 'number' }, { name: 'y', type: 'number' }, { name: 'z', type: 'number' }], rows, metadata: { rowCount: rows.length, columnCount: 3, generatedAt: new Date().toISOString(), source: 'ribbon' } };
}

function coneData(count = 30) {
  const rows = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const height = (i / count) * 100;
    const radius = (1 - i / count) * 50;
    return {
      angle: +angle.toFixed(2),
      height: +height.toFixed(2),
      radius: +radius.toFixed(2),
      value: rnd(10, 300),
    };
  });
  return { columns: [{ name: 'angle', type: 'number' }, { name: 'height', type: 'number' }, { name: 'radius', type: 'number' }, { name: 'value', type: 'number' }], rows, metadata: { rowCount: rows.length, columnCount: 4, generatedAt: new Date().toISOString(), source: 'cone' } };
}

function pyramidData(count = 30) {
  const rows = Array.from({ length: count }, (_, i) => {
    const level = Math.floor(i / 5);
    const posInLevel = i % 5;
    const size = 100 - level * 20;
    return {
      level: level,
      position: posInLevel,
      x: +(Math.cos((posInLevel / 5) * Math.PI * 2) * size).toFixed(2),
      y: +(level * 30).toFixed(2),
      z: +(Math.sin((posInLevel / 5) * Math.PI * 2) * size).toFixed(2),
      value: rnd(10, 300),
    };
  });
  return { columns: [{ name: 'level', type: 'number' }, { name: 'position', type: 'number' }, { name: 'x', type: 'number' }, { name: 'y', type: 'number' }, { name: 'z', type: 'number' }, { name: 'value', type: 'number' }], rows, metadata: { rowCount: rows.length, columnCount: 6, generatedAt: new Date().toISOString(), source: 'pyramid' } };
}

function scatterBubble3DData(count = 25) {
  const rows = Array.from({ length: count }, () => ({
    x: rnd(0, 200),
    y: rnd(0, 200),
    z: rnd(0, 200),
    size: rnd(20, 400),
    category: choice(['A', 'B', 'C', 'D']),
  }));
  return { columns: [{ name: 'x', type: 'number' }, { name: 'y', type: 'number' }, { name: 'z', type: 'number' }, { name: 'size', type: 'number' }, { name: 'category', type: 'string' }], rows, metadata: { rowCount: rows.length, columnCount: 5, generatedAt: new Date().toISOString(), source: 'scatterBubble3d' } };
}

function cone3DData() {
  return coneData(30);
}

function cylinderData(count = 30) {
  const rows = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const height = (i / count) * 100;
    return {
      angle: +angle.toFixed(2),
      height: +height.toFixed(2),
      radius: 50,
      value: rnd(10, 300),
    };
  });
  return { columns: [{ name: 'angle', type: 'number' }, { name: 'height', type: 'number' }, { name: 'radius', type: 'number' }, { name: 'value', type: 'number' }], rows, metadata: { rowCount: rows.length, columnCount: 4, generatedAt: new Date().toISOString(), source: 'cylinder' } };
}

function defaultGenerator(type) {
  // fallback mapping
  if (['line','area','line3d','area3d'].includes(type)) return timeSeries(['value','target'],12);
  if (['bar','bar3d'].includes(type)) return categoryData(['A','B','C','D'], ['v']);
  if (['pie','doughnut'].includes(type)) return pieData(5);
  if (type === 'scatter') return scatterData(30);
  if (type === 'bubble') return bubbleData(20);
  if (type === 'heatmap') return heatmapData(7,24);
  if (type === 'treemap') return treemapData();
  if (type === 'radar') return radarData();
  if (['candlestick','ohlc'].includes(type)) return ohlcData(20);
  if (type === 'gauge') return gaugeData();
  if (type === 'surface') return surfaceData(10,10);
  if (type === 'scatter3d') return scatter3DData(30);
  if (type === 'volume') return volumeData();
  if (type === 'globe' || type === 'map3d') return globeData();
  return timeSeries(['value'],12);
}

// ensure output dir exists
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

console.log(`Generating ${PER_TYPE} datasets per ${CHART_TYPES.length} types -> ~${PER_TYPE * CHART_TYPES.length} files into ${OUT_DIR}`);

for (const type of CHART_TYPES) {
  const typeDir = path.join(OUT_DIR, type);
  if (!fs.existsSync(typeDir)) fs.mkdirSync(typeDir, { recursive: true });
  const index = [];
  for (let i = 1; i <= PER_TYPE; i++) {
    let data;
    // some types use dedicated generators
    switch(type) {
      case 'line': data = timeSeries(['revenue','cost'],12); break;
      case 'area': data = timeSeries(['revenue','cost'],12); break;
      case 'bar': data = categoryData(['North','South','East','West'], ['q1','q2','q3']); break;
      case 'pie':
      case 'doughnut': data = pieData(5); break;
      case 'scatter': data = scatterData(30); break;
      case 'bubble': data = bubbleData(20); break;
      case 'heatmap': data = heatmapData(7,24); break;
      case 'treemap': data = treemapData(); break;
      case 'radar': data = radarData(); break;
      case 'candlestick':
      case 'ohlc': data = ohlcData(20); break;
      case 'gauge': data = gaugeData(); break;
      case 'surface': data = surfaceData(10,10); break;
      case 'scatter3d': data = scatter3DData(30); break;
      case 'bar3d': data = bar3DData(); break;
      case 'line3d': data = line3DData(); break;
      case 'area3d': data = line3DData(); break;
      case 'volume': data = volumeData(); break;
      case 'globe':
      case 'map3d': data = globeData(); break;
      case 'tube': data = tubeData(40); break;
      case 'ribbon': data = ribbonData(50); break;
      case 'cone': data = coneData(30); break;
      case 'pyramid': data = pyramidData(30); break;
      case 'scatterBubble3d': data = scatterBubble3DData(25); break;
      case 'cone3d': data = cone3DData(); break;
      case 'cylinder': data = cylinderData(30); break;
      default: data = defaultGenerator(type); break;
    }

    const fileName = `dataset-${String(i).padStart(3,'0')}.json`;
    const outPath = path.join(typeDir, fileName);
    fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf8');
    index.push(fileName);
  }
  fs.writeFileSync(path.join(typeDir, 'index.json'), JSON.stringify({ files: index }, null, 2), 'utf8');
}

console.log('Done.');