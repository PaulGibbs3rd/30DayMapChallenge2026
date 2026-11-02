"""Assemble a captioned square GIF from real browser screenshots and a timing manifest."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import argparse, json

parser=argparse.ArgumentParser()
parser.add_argument('capture_folder',type=Path)
parser.add_argument('output',type=Path)
args=parser.parse_args()
manifest=json.loads((args.capture_folder/'manifest.json').read_text())
W=H=1080
BG='#101e27'; MINT='#90decf'; MUTED='#a5bac4'; WHITE='#edf6f5'
def font(size,bold=False):
    return ImageFont.truetype('C:/Windows/Fonts/'+('segoeuib.ttf' if bold else 'segoeui.ttf'),size)
captions={
 'overview':('01 / Find a climb','Ranked street segments across Seattle'),
 'uphill':('02 / Look uphill in 3D','A = lower terrain endpoint   /   B = higher terrain endpoint'),
 'profile':('03 / Trace the elevation profile','A point on the chart marks the same location in the scene'),
 'return':('Explore a city of climbs','#30DayMapChallenge 2026   /   Day 02: Lines')
}
def compose(entry):
    frame=Image.new('RGB',(W,H),BG)
    d=ImageDraw.Draw(frame)
    d.text((30,22),'SEATTLE’S STEEPEST STREETS',font=font(44,True),fill=WHITE)
    d.text((32,83),'DAY 02 / LINES     ·     #30DayMapChallenge',font=font(21),fill=MINT)
    shot=Image.open(args.capture_folder/entry['file']).convert('RGB')
    shot=shot.resize((1020,765),Image.Resampling.LANCZOS)
    frame.paste(shot,(30,137))
    d.rectangle((29,136,1050,902),outline='#35515c',width=1)
    title,sub=captions[entry['stage']]
    d.text((32,927),title,font=font(31,True),fill=MINT)
    d.text((32,975),sub,font=font(21),fill=WHITE)
    d.text((32,1037),'Paul Gibbs  ·  ArcGIS Maps SDK for JavaScript + Calcite',font=font(16),fill=MUTED)
    d.text((32,1059),'Street data: Seattle SDOT  ·  Terrain: Esri World Elevation',font=font(14),fill=MUTED)
    return frame

frames=[compose(e) for e in manifest]
durations=[max(60,round(e['duration']/10)*10) for e in manifest]
# Give viewers a moment to read the final overview before the loop repeats.
durations[-1]+=1300
# One palette across the sequence avoids color flicker between screenshots.
samples=Image.new('RGB',(540,540))
for n,i in enumerate([0,4,8,15,30,34,40,44,len(frames)-1]):
    sample=frames[i].resize((180,180))
    samples.paste(sample,((n%3)*180,(n//3)*180))
palette=samples.quantize(colors=256,method=Image.Quantize.MEDIANCUT)
indexed=[im.quantize(palette=palette,dither=Image.Dither.NONE) for im in frames]
args.output.parent.mkdir(parents=True,exist_ok=True)
indexed[0].save(args.output,save_all=True,append_images=indexed[1:],duration=durations,loop=0,optimize=True,disposal=1)
frames[0].save(args.output.with_suffix('.png'))
qa=Image.new('RGB',(1080,1080),BG)
for n,i in enumerate([0,15,40,len(frames)-1]):
    qa.paste(frames[i].resize((540,540)),((n%2)*540,(n//2)*540))
qa.save(args.output.with_name('seattle-demo-storyboard.jpg'),quality=92)
with Image.open(args.output) as gif:
    duration=sum(gif.seek(i) or gif.info.get('duration',0) for i in range(gif.n_frames))
    print(json.dumps({'file':str(args.output),'size_mb':round(args.output.stat().st_size/1048576,2),'frames':gif.n_frames,'seconds':duration/1000,'dimensions':gif.size}))

