"""Create the local, georeferenced 16-bit terrain from open elevation/coast data.
Run with Python + Pillow + NumPy. Source tiles are cached under ignored .codex/.
"""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from urllib.request import urlopen, Request
from io import BytesIO
import json
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

DAY = Path(__file__).resolve().parent.parent
CACHE = DAY / '.codex' / 'terrain'
OUT = DAY / 'scripts' / 'app' / 'public' / 'data'
CACHE.mkdir(parents=True, exist_ok=True)
OUT.mkdir(parents=True, exist_ok=True)
Z, X0, X1, Y0, Y1 = 6, 53, 58, 22, 27
N = 2 ** Z
SIZE = 768

def download(url, path):
    if not path.exists():
        with urlopen(Request(url, headers={'User-Agent': 'NeonJapanMap/1.0'}), timeout=45) as r:
            path.write_bytes(r.read())
    return path.read_bytes()

def tile(pair):
    x, y = pair
    data = download(f'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{Z}/{x}/{y}.png', CACHE / f'{Z}-{x}-{y}.png')
    return x, y, Image.open(BytesIO(data)).convert('RGB')

mosaic = Image.new('RGB', (1536, 1536))
with ThreadPoolExecutor(max_workers=8) as pool:
    for x, y, im in pool.map(tile, [(x,y) for x in range(X0,X1+1) for y in range(Y0,Y1+1)]):
        mosaic.paste(im, ((x-X0)*256,(y-Y0)*256))
# Decode at original resolution before resampling: encoded channels must not be averaged.
raw = np.asarray(mosaic, dtype=np.float32)
elevation = raw[:,:,0]*256 + raw[:,:,1] + raw[:,:,2]/256 - 32768
elevation = np.asarray(Image.fromarray(elevation).resize((SIZE,SIZE), Image.Resampling.BOX))

source = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson'
countries = json.loads(download(source, CACHE / 'countries.geojson'))
land = Image.new('L',(SIZE,SIZE)); japan = Image.new('L',(SIZE,SIZE))
def project(coord):
    lon, lat = coord[:2]
    lat = max(-85,min(85,lat))
    tx = (lon+180)/360*N
    ty = (1-math.asinh(math.tan(math.radians(lat)))/math.pi)/2*N
    return ((tx-X0)/6*SIZE,(ty-Y0)/6*SIZE)

for f in countries['features']:
    g = f['geometry']
    polys = g['coordinates'] if g['type']=='MultiPolygon' else [g['coordinates']]
    is_japan = f['properties'].get('ADMIN') == 'Japan'
    for poly in polys:
        for mask in ([land,japan] if is_japan else [land]):
            draw=ImageDraw.Draw(mask)
            draw.polygon([project(p) for p in poly[0]],fill=255)
            for hole in poly[1:]: draw.polygon([project(p) for p in hole],fill=0)

land_a = np.asarray(land)>0
japan_a = np.asarray(japan)>0
colors = np.zeros((SIZE,SIZE,3),dtype=np.uint8)
colors[:]=[9,14,31]
for threshold,color in [(-6500,[10,16,34]),(-5000,[11,19,37]),(-3000,[13,23,41]),(-1200,[15,28,45]),(-250,[17,32,48])]:
    colors[elevation>threshold]=color
colors[land_a]=[22,39,49]
for threshold,color in [(-500,[24,71,66]),(100,[27,88,75]),(350,[37,108,85]),(700,[59,130,96]),(1200,[97,157,115]),(1900,[153,188,137]),(2600,[209,222,171])]:
    colors[japan_a & (elevation>threshold)]=color
# Northwest light, deliberately quantized to a small number of palette steps.
dy,dx=np.gradient(elevation)
shade=dx-dy
colors[japan_a & (shade>95)] = (colors[japan_a & (shade>95)]*.77).astype(np.uint8)
coast=(np.asarray(japan.filter(ImageFilter.MaxFilter(3)))>0)&~japan_a
colors[coast]=[38,100,103]
out=Image.fromarray(colors).resize((3072,3072),Image.Resampling.NEAREST)
out.save(OUT/'japan-16bit.png',optimize=True)
R=20037508.342789244
extent={'xmin':X0/N*2*R-R,'xmax':(X1+1)/N*2*R-R,'ymax':R-Y0/N*2*R,'ymin':R-(Y1+1)/N*2*R,'spatialReference':{'wkid':3857}}
(OUT/'terrain.json').write_text(json.dumps({'extent':extent,'pixelGrid':[SIZE,SIZE],'sourceZoom':Z,'sourceTiles':36,'sourceDate':'2026-11-06','sources':[source,'https://registry.opendata.aws/terrain-tiles/'],'note':'Generalized elevation and coastlines. Palette, hillshade, and pixel grid are artistic. Not for navigation.'},indent=2),encoding='utf-8')
(DAY/'scripts'/'app'/'src'/'terrain.json').write_bytes((OUT/'terrain.json').read_bytes())
print(f'Created pixel terrain: {OUT / "japan-16bit.png"}')
