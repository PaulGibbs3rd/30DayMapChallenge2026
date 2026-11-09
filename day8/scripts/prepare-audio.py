"""Inspect supplied FLACs and prepare private, reviewable soundtrack excerpts.

Uses Python's standard library and a portable FFmpeg executable. Source files are
read only. Generated audio stays in scripts/.local/, outside the Pages export.
"""

import argparse
from array import array
import json
import math
from pathlib import Path
import shutil
import struct
import subprocess
import sys
import wave
import zipfile

HERE = Path(__file__).resolve().parent
LOCAL = HERE / ".local"
ANCHORS = (4, 6, 12, 13, 15, 18, 19)


def flac_info(path):
    info = {"file": path.name, "bytes": path.stat().st_size}
    with path.open("rb") as source:
        if source.read(4) != b"fLaC":
            raise ValueError(f"Not a native FLAC file: {path.name}")
        while True:
            header = source.read(4)
            if len(header) != 4:
                raise ValueError(f"Incomplete FLAC metadata: {path.name}")
            kind = header[0] & 127
            length = int.from_bytes(header[1:], "big")
            if kind == 0:
                data = source.read(length)
                packed = int.from_bytes(data[10:18], "big")
                rate = (packed >> 44) & 0xFFFFF
                samples = packed & ((1 << 36) - 1)
                info.update(sampleRate=rate, channels=((packed >> 41) & 7) + 1,
                            bitsPerSample=((packed >> 36) & 31) + 1,
                            samples=samples, duration=round(samples / rate, 6),
                            audioMd5=data[18:34].hex())
            elif kind == 4:
                data = source.read(length)
                vendor_length = struct.unpack_from("<I", data, 0)[0]
                offset = 4 + vendor_length
                count = struct.unpack_from("<I", data, offset)[0]
                offset += 4
                tags = {}
                for _ in range(count):
                    size = struct.unpack_from("<I", data, offset)[0]
                    offset += 4
                    item = data[offset:offset + size].decode("utf-8", "replace")
                    offset += size
                    key, separator, value = item.partition("=")
                    if separator and key.upper() in {"TITLE", "ARTIST", "ALBUM", "TRACKNUMBER", "DATE"}:
                        tags[key.upper()] = value
                info["tags"] = tags
            else:
                source.seek(length, 1)
            if header[0] & 128:
                break
    if "duration" not in info:
        raise ValueError(f"Missing STREAMINFO: {path.name}")
    return info


def find_ffmpeg():
    binary = LOCAL / "tools" / "ffmpeg.exe"
    if binary.exists():
        return binary
    installed = shutil.which("ffmpeg")
    if installed:
        return Path(installed)
    for wheel in (LOCAL / "tools").glob("imageio_ffmpeg-*.whl"):
        with zipfile.ZipFile(wheel) as archive:
            members = [name for name in archive.namelist() if name.endswith(".exe") and "ffmpeg" in name]
            if len(members) != 1:
                raise ValueError("Expected one portable FFmpeg executable in wheel")
            binary.write_bytes(archive.read(members[0]))
            return binary
    raise FileNotFoundError("FFmpeg is needed; place the portable tool in scripts/.local/tools/.")


def run_ffmpeg(binary, arguments, capture=False):
    return subprocess.run([str(binary), "-hide_banner", "-loglevel", "error", "-nostdin", *arguments],
                          check=True, stdout=subprocess.PIPE if capture else subprocess.DEVNULL,
                          stderr=subprocess.PIPE)


def envelope(binary, source):
    data = run_ffmpeg(binary, ["-i", str(source), "-vn", "-ac", "1", "-ar", "4000",
                               "-f", "s16le", "pipe:1"], capture=True).stdout
    samples = array("h")
    samples.frombytes(data)
    if sys.byteorder != "little":
        samples.byteswap()
    step = 200  # 50 ms windows at 4 kHz
    values = []
    for offset in range(0, len(samples), step):
        chunk = samples[offset:offset + step]
        values.append(round(math.sqrt(sum(value * value for value in chunk) / len(chunk)) / 32768, 6))
    return {"stepSeconds": .05, "rms": values}


def render_clips(binary, source_dir, inventory, cue_path):
    cue_sheet = json.loads(cue_path.read_text(encoding="utf-8"))
    clips = LOCAL / "clips"
    clips.mkdir(parents=True, exist_ok=True)
    rows = {int(item["file"].split(".", 1)[0]): item for item in inventory}
    output = []
    for chapter in cue_sheet["chapters"]:
        row = rows[chapter["trackNumber"]]
        start, end = chapter["sourceIn"], chapter["sourceOut"]
        if not 0 <= start < end <= row["duration"]:
            raise ValueError(f"Invalid source interval for {chapter['id']}")
        duration = end - start
        target = clips / f"{chapter['order']:02d}-{chapter['id']}.wav"
        # Uncompressed WAV makes the first timing review independent of MP3 encoder delay.
        run_ffmpeg(binary, ["-y", "-ss", str(start), "-i", str(source_dir / row["file"]),
                            "-t", str(duration), "-map", "0:a:0", "-map_metadata", "-1",
                            "-af", f"afade=t=in:d=0.025,afade=t=out:st={duration - .08}:d=0.08",
                            "-ar", "44100", "-ac", "2", "-c:a", "pcm_s16le", str(target)])
        with wave.open(str(target), "rb") as clip:
            actual = clip.getnframes() / clip.getframerate()
            if abs(actual - duration) > 1 / clip.getframerate():
                raise ValueError(f"Clip duration differs from cue sheet: {target.name}")
        output.append({"id": chapter["id"], "file": target.name, "duration": actual,
                       "sourceIn": start, "sourceOut": end, "trackFile": row["file"]})
    (LOCAL / "rendered-clips.json").write_text(json.dumps(output, indent=2) + "\n", encoding="utf-8")
    make_review(cue_sheet, output)
    print(f"Rendered and duration-checked {len(output)} private WAV excerpts.")


def make_review(cue_sheet, rendered):
    template = (HERE / "review-template.html").read_text(encoding="utf-8")
    waveforms = json.loads((LOCAL / "waveforms.json").read_text(encoding="utf-8"))
    payload = {"chapters": cue_sheet["chapters"], "rendered": rendered, "waveforms": waveforms}
    encoded = json.dumps(payload, ensure_ascii=False).replace("<", "\\u003c")
    (LOCAL / "review.html").write_text(template.replace("/* AUDIO_REVIEW_DATA */", encoded), encoding="utf-8")
    print("Created private review screen: " + str(LOCAL / "review.html"))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path, help="Directory of supplied FLAC recordings")
    parser.add_argument("--analyze", action="store_true", help="Generate anchor-track RMS waveforms")
    parser.add_argument("--render", type=Path, metavar="CUES_JSON", help="Render the cue sheet's draft excerpts")
    args = parser.parse_args()
    source_dir = args.source.resolve(strict=True)
    files = sorted(source_dir.glob("*.flac"))
    if not files:
        parser.error("No FLAC recordings found in source directory")
    LOCAL.mkdir(parents=True, exist_ok=True)
    inventory = [flac_info(path) for path in files]
    (LOCAL / "inventory.json").write_text(json.dumps(inventory, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    (LOCAL / "source.json").write_text(json.dumps({"directory": str(source_dir)}, indent=2) + "\n", encoding="utf-8")
    for item in inventory:
        print(f"{item['file']}: {item['duration']:.3f}s; {item['sampleRate']} Hz / {item['bitsPerSample']} bit / {item['channels']} ch")
    if args.analyze or args.render:
        binary = find_ffmpeg()
    if args.analyze:
        waveforms = {}
        for path in files:
            number = int(path.name.split(".", 1)[0])
            if number in ANCHORS:
                waveforms[str(number)] = envelope(binary, path)
        (LOCAL / "waveforms.json").write_text(json.dumps(waveforms, separators=(",", ":")), encoding="utf-8")
        print(f"Analyzed {len(waveforms)} anchor recordings (50 ms RMS windows).")
    if args.render:
        render_clips(binary, source_dir, inventory, args.render)


if __name__ == "__main__":
    main()
