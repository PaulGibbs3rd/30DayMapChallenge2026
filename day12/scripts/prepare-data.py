"""Build the Day 12 snapshot from the pinned Ember and Natural Earth inputs."""

import argparse
import csv
import hashlib
import json
from collections import Counter, defaultdict
from decimal import Decimal, InvalidOperation
from pathlib import Path


DAY = Path(__file__).resolve().parents[1]
YEARS = range(2000, 2026)
FUELS = ('Bioenergy', 'Coal', 'Gas', 'Hydro', 'Nuclear', 'Other fossil',
         'Other renewables', 'Solar', 'Wind')
TOTAL = 'Total generation'
TOLERANCE = Decimal('0.06')
EMBER_URL = 'https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv'
EARTH_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.1/geojson/ne_50m_admin_0_map_units.geojson'
EMBER_HASH = '08932763076fa781634371dd1b75d8156f76592710c7e984836ed56a663d5688'
EARTH_HASH = 'b8d421aca6e9e08e8cdf09cc26af111cc3e0deba4fe915611d58ade71e8a4db0'


def check_hash(path, expected):
    actual = hashlib.sha256(path.read_bytes()).hexdigest()
    if actual != expected:
        raise ValueError(f'{path.name} SHA-256 is {actual}, expected {expected}. Audit the new source before changing the pin.')
    return actual


def read_generation(path):
    names = {}
    generation = defaultdict(dict)
    issues = {'duplicateRows': [], 'invalidGenerationRows': []}
    required = {'Area', 'ISO 3 code', 'Year', 'Area type', 'Electricity source',
                'Is aggregated source', 'Generation (TWh)'}
    with path.open(encoding='utf-8-sig', newline='') as stream:
        rows = csv.DictReader(stream)
        if missing := required.difference(rows.fieldnames or []):
            raise ValueError(f'Missing Ember fields: {sorted(missing)}')
        for line, row in enumerate(rows, 2):
            if row['Area type'] != 'Country or economy':
                continue
            code = row['ISO 3 code'].strip().upper()
            year = int(row['Year'])
            if len(code) != 3 or not code.isascii() or not code.isalpha() or year not in YEARS:
                continue
            source = row['Electricity source']
            if source != TOTAL and (source not in FUELS or row['Is aggregated source'] != 'False'):
                continue
            names[code] = row['Area']
            raw = row['Generation (TWh)'].strip()
            value = None
            if raw:
                try:
                    value = Decimal(raw)
                    if not value.is_finite() or value < 0:
                        raise InvalidOperation
                except InvalidOperation:
                    issues['invalidGenerationRows'].append([line, code, year, source, raw])
                    value = None
            records = generation[code, year]
            if source in records:
                issues['duplicateRows'].append([line, code, year, source])
                if records[source] != value:
                    raise ValueError(f'Conflicting Ember rows for {code}, {year}, {source}')
            records[source] = value
    return names, generation, issues


def classify(records):
    values = [records.get(fuel) for fuel in FUELS]
    available = [value for value in values if value is not None]
    total = records.get(TOTAL)
    if total == 0 and not any(available):
        return 'zero', []
    if total is None or total <= 0 or not available:
        return 'unavailable', []
    remainder = total - sum(available)
    best = max(available)
    if best <= 0 or abs(remainder) > TOLERANCE or (len(available) < len(FUELS) and remainder >= best):
        return 'unavailable', []
    leaders = [index for index, value in enumerate(values) if value == best]
    return ('shared' if len(leaders) > 1 else str(leaders[0])), leaders


def number(value):
    return None if value is None else float(value)


def summarize(names, generation):
    areas = {}
    coverage = {year: Counter({key: 0 for key in ('observed', 'single', 'shared', 'zero', 'unavailable')})
                for year in YEARS}
    withheld = []
    quality = {year: {'sparseWithSourceData': 0, 'positiveTotalsBelowTolerance': 0,
                      'maxReconciledDifferenceTWh': 0} for year in YEARS}
    for code, name in sorted(names.items()):
        series = []
        for year in YEARS:
            records = generation.get((code, year), {})
            values = [records.get(fuel) for fuel in FUELS]
            total = records.get(TOTAL)
            status, leaders = classify(records)
            counts = coverage[year]
            available = [value for value in values if value is not None]
            if available:
                counts['observed'] += 1
                if len(available) < len(FUELS):
                    quality[year]['sparseWithSourceData'] += 1
            if total is not None and 0 < total <= TOLERANCE:
                quality[year]['positiveTotalsBelowTolerance'] += 1
            if leaders:
                difference = number(abs(total - sum(available)))
                quality[year]['maxReconciledDifferenceTWh'] = max(quality[year]['maxReconciledDifferenceTWh'], difference)
            counts[status if status in ('shared', 'zero', 'unavailable') else 'single'] += 1
            if status == 'unavailable' and (total is not None or available):
                withheld.append([code, year, number(total), number(sum(available))])
            series.append([number(total), [number(value) for value in values], status, leaders])
        areas[code] = {'name': name, 'series': series}
    return areas, coverage, withheld, quality


def read_boundaries(path, areas, overrides):
    groups = {}
    unmatched_units = []
    for feature in json.loads(path.read_text(encoding='utf-8'))['features']:
        properties = feature['properties']
        unit = properties['GU_A3']
        if unit in overrides:
            code = overrides[unit]['ember']
            if code is not None and code not in areas:
                raise ValueError(f'Unknown override for {unit}: {code}')
        else:
            code = next((properties[field] for field in ('ISO_A3', 'ISO_A3_EH')
                         if properties[field] in areas), None)
        group_id = code or f'unit-{unit}'
        name = properties['GEOUNIT']
        if code is None:
            unmatched_units.append([unit, name])
        group = groups.setdefault(group_id, {'name': areas[code]['name'] if code else name,
                                             'code': code, 'polygons': [], 'units': []})
        geometry = feature['geometry']
        if geometry['type'] not in ('Polygon', 'MultiPolygon'):
            raise ValueError(f'Unexpected geometry for {unit}: {geometry["type"]}')
        polygons = geometry['coordinates'] if geometry['type'] == 'MultiPolygon' else [geometry['coordinates']]
        group['polygons'].extend(polygons)
        group['units'].append(unit)
    return groups, sorted(unmatched_units)


def write_boundaries(groups, areas):
    features = []
    for object_id, (key, group) in enumerate(sorted(groups.items()), 1):
        code = group['code']
        properties = {'key': key, 'name': group['name']}
        for index, year in enumerate(YEARS):
            properties[f'y{year}'] = areas[code]['series'][index][2] if code else 'unavailable'
        polygons = group['polygons']
        # Keep upstream precision and topology, including tiny island polygons and the antimeridian.
        geometry = {'type': 'MultiPolygon', 'coordinates': polygons}
        features.append({'type': 'Feature', 'id': object_id, 'properties': properties, 'geometry': geometry})
    return {'type': 'FeatureCollection', 'features': features}


def write_json(name, value, *, indent=None):
    path = DAY / 'data' / name
    separators = (',', ':') if indent is None else None
    path.write_text(json.dumps(value, ensure_ascii=False, indent=indent, separators=separators) + '\n',
                    encoding='utf-8', newline='\n')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('ember_csv', type=Path)
    parser.add_argument('natural_earth_geojson', type=Path)
    parser.add_argument('--retrieved', required=True, help='Source retrieval date, YYYY-MM-DD')
    args = parser.parse_args()
    ember_hash = check_hash(args.ember_csv, EMBER_HASH)
    earth_hash = check_hash(args.natural_earth_geojson, EARTH_HASH)
    names, generation, issues = read_generation(args.ember_csv)
    areas, coverage, withheld, quality = summarize(names, generation)
    overrides = json.loads((DAY / 'data' / 'boundary-overrides.json').read_text(encoding='utf-8'))
    groups, unmatched_units = read_boundaries(args.natural_earth_geojson, areas, overrides)
    unmatched_areas = sorted([code, areas[code]['name']] for code in areas.keys() - groups.keys())
    for code, area in areas.items():
        area['mapped'] = code in groups
    for year, counts in coverage.items():
        index = year - YEARS.start
        counts['mappedObserved'] = sum(
            area['mapped'] and any(value is not None for value in area['series'][index][1])
            for area in areas.values()
        )
    manifest = {
        'generation': {'publisher': 'Ember', 'release': '2026-11-11', 'retrieved': args.retrieved,
                       'url': EMBER_URL, 'sha256': ember_hash, 'license': 'CC BY 4.0'},
        'boundaries': {'publisher': 'Natural Earth', 'release': '5.1.1', 'retrieved': args.retrieved,
                       'url': EARTH_URL, 'sha256': earth_hash, 'license': 'Public domain'},
        'reconciliationToleranceTWh': float(TOLERANCE),
        'modifications': 'Selected country or economy generation, reconciled totals, ranked sources, and joined Natural Earth map units by reviewed geography IDs.'
    }
    audit = {'coverage': coverage, 'quality': quality, 'unmatchedAreas': unmatched_areas, 'unmatchedMapUnits': unmatched_units,
             'groupedMapUnits': {key: group['units'] for key, group in groups.items() if len(group['units']) > 1},
             'withheldWithNumericData': withheld, **issues}
    write_json('generation.json', {'firstYear': YEARS.start, 'lastYear': YEARS.stop - 1,
                                  'release': manifest['generation']['release'], 'fuels': FUELS,
                                  'coverage': coverage, 'areas': areas})
    write_json('countries.geojson', write_boundaries(groups, areas))
    write_json('manifest.json', manifest, indent=2)
    write_json('audit.json', audit, indent=2)
    print(f'{len(areas)} Ember geographies, {len(groups)} map features, {len(unmatched_areas)} Ember geographies without polygons.')


if __name__ == '__main__':
    main()
