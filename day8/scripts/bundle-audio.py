"""Encode the seven user-requested delivery excerpts; never copy full masters."""
import importlib.util
import json
from pathlib import Path
import subprocess

HERE=Path(__file__).resolve().parent
DAY=HERE.parent
spec=importlib.util.spec_from_file_location("prepare_audio",HERE/"prepare-audio.py")
prepare=importlib.util.module_from_spec(spec)
spec.loader.exec_module(prepare)
binary=prepare.find_ffmpeg()
sheet=json.loads((DAY/"audio-cues.json").read_text(encoding="utf-8"))
rendered=json.loads((HERE/".local/rendered-clips.json").read_text(encoding="utf-8"))
out=DAY/"audio"
out.mkdir(exist_ok=True)
total=0
for chapter,clip in zip(sheet["chapters"],rendered,strict=True):
    if chapter["id"]!=clip["id"]:
        raise ValueError("Clip and chapter order differ")
    source=HERE/".local/clips"/clip["file"]
    target=out/(source.stem+".mp3")
    prepare.run_ffmpeg(binary,["-y","-i",str(source),"-vn","-map_metadata","-1",
        "-c:a","libmp3lame","-b:a","192k","-ar","44100","-ac","2",
        "-write_xing","1","-id3v2_version","3",
        "-metadata","title="+chapter["trackTitle"]+" (project excerpt)",
        "-metadata","artist=Travis Scott","-metadata","album=UTOPIA",str(target)])
    decoded=prepare.run_ffmpeg(binary,["-i",str(target),"-f","s16le","-acodec","pcm_s16le","pipe:1"],capture=True).stdout
    duration=len(decoded)/(44100*2*2)
    expected=chapter["sourceOut"]-chapter["sourceIn"]
    if abs(duration-expected)>1/44100:
        raise ValueError(f"Decoded MP3 duration changed: {target.name}: {duration}")
    chapter["audio"]="./audio/"+target.name
    total+=target.stat().st_size
    print(f"{target.name}: {duration:.3f}s; {target.stat().st_size:,} bytes; decoded duration verified")
(DAY/"audio-cues.json").write_text(json.dumps(sheet,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
print(f"Seven bundled MP3 excerpts: {total:,} bytes ({total/1e6:.2f} MB).")
