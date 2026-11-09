"""Make an isolated validation snapshot of only the intended Day 8 release."""
import json
from pathlib import Path
import shutil
import subprocess
import uuid
import zipfile

ROOT=Path(__file__).resolve().parents[2]
LOCAL=Path(__file__).resolve().parent/".local"
SCOPES=["day8","README.md","NOTICE.md","directory/days.json","directory/index.html","scripts/check-project.mjs"]
changed=subprocess.check_output(["git","diff","--name-only","--",*SCOPES],cwd=ROOT,text=True).splitlines()
new=subprocess.check_output(["git","ls-files","--others","--exclude-standard","--","day8"],cwd=ROOT,text=True).splitlines()
files=sorted(set(changed+new))
for name in files:
    if not (name.startswith("day8/") or name in SCOPES):
        raise ValueError("File outside release scope: "+name)
    if "/.local/" in name or "__pycache__" in name or name.lower().endswith((".flac",".wav",".exe",".whl",".pyc")):
        raise ValueError("Private working file in release: "+name)
LOCAL.mkdir(exist_ok=True)
run=uuid.uuid4().hex[:8]
archive=LOCAL/("release-base-"+run+".zip")
snapshot=LOCAL/("release-check-"+run)
snapshot.mkdir()
subprocess.run(["git","archive","--format=zip","--output="+str(archive),"HEAD"],cwd=ROOT,check=True)
with zipfile.ZipFile(archive) as bundle:
    for entry in bundle.infolist():
        resolved=(snapshot/entry.filename).resolve()
        if not resolved.is_relative_to(snapshot.resolve()):
            raise ValueError("Archive path escaped snapshot")
    bundle.extractall(snapshot)
for name in files:
    source=ROOT/name
    if not source.is_file():
        raise ValueError("Release source not found: "+name)
    target=snapshot/name
    target.parent.mkdir(parents=True,exist_ok=True)
    shutil.copy2(source,target)
manifest={"base":subprocess.check_output(["git","rev-parse","HEAD"],cwd=ROOT,text=True).strip(),"snapshot":str(snapshot),"files":files}
(LOCAL/"release-manifest.json").write_text(json.dumps(manifest,indent=2)+"\n",encoding="utf-8")
print(json.dumps({"snapshot":str(snapshot),"files":len(files),"audioFiles":sum(name.endswith('.mp3') for name in files)},indent=2))
