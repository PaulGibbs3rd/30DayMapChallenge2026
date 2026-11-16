"""Package the sampled NOAA ETOPO1 CSV as a grid of signed metre values."""

import argparse
import base64
import csv
import json
import sys
from array import array
from pathlib import Path


WIDTH, HEIGHT = 1201, 601
STEP = 0.3


def read_grid(source):
    values = array("h")
    with source.open(newline="", encoding="utf-8") as stream:
        rows = csv.reader(stream)
        if next(rows) != ["latitude", "longitude", "altitude"]:
            raise ValueError("Unexpected ERDDAP CSV columns")
        next(rows)
        for index, (latitude, longitude, altitude) in enumerate(rows):
            row, column = divmod(index, WIDTH)
            if (abs(float(latitude) - (-90 + row * STEP)) > 0.0001
                    or abs(float(longitude) - (-180 + column * STEP)) > 0.0001):
                raise ValueError(f"Unexpected coordinates at sample {index}")
            values.append(int(altitude))
    if len(values) != WIDTH * HEIGHT:
        raise ValueError(f"Expected {WIDTH * HEIGHT} samples, got {len(values)}")
    return values


def find_ocean(values):
    # Use the connected below-zero ocean so inland depressions stay fixed.
    # The final longitude repeats the antimeridian, so wrap across the unique columns.
    columns = WIDTH - 1
    start = (HEIGHT // 2) * WIDTH + round(30 / STEP)
    if values[start] >= 0:
        raise ValueError("The Pacific seed must be below sea level")
    mask = bytearray(len(values))
    mask[start] = 1
    queue = [start]
    for index in queue:
        row, column = divmod(index, WIDTH)
        base = row * WIDTH
        neighbors = [base + (column - 1) % columns, base + (column + 1) % columns]
        if row > 0:
            neighbors.append(index - WIDTH)
        if row < HEIGHT - 1:
            neighbors.append(index + WIDTH)
        for neighbor in neighbors:
            if not mask[neighbor] and values[neighbor] < 0:
                mask[neighbor] = 1
                queue.append(neighbor)
    for row in range(HEIGHT):
        mask[row * WIDTH + columns] = mask[row * WIDTH]
    return mask


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    values = read_grid(args.source)
    ocean = find_ocean(values)
    # The top bit marks ocean and the lower 15 bits store metres offset by 16,384.
    packed = array("H", ((value + 16384) | (flag << 15) for value, flag in zip(values, ocean)))
    if sys.byteorder != "little":
        packed.byteswap()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open("w", encoding="utf-8") as stream:
        json.dump({"width": WIDTH, "height": HEIGHT, "step": STEP,
                   "samples": base64.b64encode(packed.tobytes()).decode("ascii")}, stream,
                  separators=(",", ":"))
        stream.write("\n")
    print(f"Packed {len(values):,} samples, including {sum(ocean):,} connected ocean samples.")


if __name__ == "__main__":
    main()
