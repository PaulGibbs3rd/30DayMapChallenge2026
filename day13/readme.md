# The Desert Feeds the Forest

**Day 13 · Interactions · November 13, 2026**

**Status:** Working preview

Replay one documented Saharan dust crossing from April 4 through April 11, 2014. The date control advances the satellite mosaic and the historical wind field together. Drag or keyboard-move the wind lens, click the map to place it, or select **Full wind** for the whole map. The guided stops follow the plume over the Atlantic, to the coast, and into the Amazon. [Event study, Section 3.5 and Figures 9 and 11–13](https://acp.copernicus.org/articles/18/10055/2018/acp-18-10055-2018.pdf)

## Run the preview

Run `npm run dev` from the repository root and open `/30DayMapChallenge2026/day13/` on the local server. The software and fonts load from public CDNs. The map data is bundled with the page. [Project spec](spec.md)

## Preview data

- **Aerosol.** NASA GIBS Dark Target 550 nm aerosol optical depth for Terra and Aqua MODIS. The script decodes the published color bands to their lower bounds and averages the values where two valid observations share a pixel on the same day. It recolors the resulting mosaic with one fixed ramp. Clear areas include retrieval gaps. The product measures total column optical depth from aerosols including dust, smoke, and other particles. [NASA GIBS](https://www.earthdata.nasa.gov/data/projects/gibs) · [GIBS input palette](https://gibs.earthdata.nasa.gov/colormaps/v1.3/MODIS_VIIRS_AOD.xml)
- **Wind.** Copernicus Climate Change Service ERA5 via WeatherBench 2, sampled from the 1.5° product at 850 hPa and 12:00 UTC on each replay day. Wind components in m/s are interpolated onto the regional Web Mercator grid. The selected level gives a single reference for comparing the wind throughout the crossing. The event study describes dust at several heights and uses 925 hPa winds to discuss the inland leg. [WeatherBench 2 data guide](https://weatherbench2.readthedocs.io/en/latest/data-guide.html) · [Event study](https://acp.copernicus.org/articles/18/10055/2018/acp-18-10055-2018.pdf)
- **Geography.** Natural Earth 1:110m land and the Amazon Tall Tower Observatory at 2.1459°S, 59.0056°W. [Natural Earth land](https://www.naturalearthdata.com/downloads/110m-physical-vectors/110m-land/) · [ATTO coordinates in Wang et al. (2024)](https://escholarship.org/uc/item/1757m6h5)

The draft specifies MERRA-2 dust-only optical depth and 12-hour steps. The source download requires Earthdata sign-in. The preview uses daily MODIS satellite mosaics with midday ERA5 winds. Source URLs, dates, grid dimensions, and output checksums are recorded in [the data manifest](data/manifest.json). Run `python day13/scripts/prepare-data.py` from the source checkout to regenerate the assets. The script requires NumPy, SciPy, Numcodecs, and Pillow.

The phosphorus connection comes from multiyear research. The replay shows one transport event and presents the phosphorus result as context for its broader significance. [NASA phosphorus research summary](https://www.nasa.gov/missions/calipso/nasa-satellite-reveals-how-much-saharan-dust-feeds-amazons-plants/)

## Validation

A clean Chrome session loaded the static build and rendered the bundled 850 hPa winds with ArcGIS `FlowRenderer`. Browser checks covered animated pixels inside the lens, pointer and keyboard movement, the mobile layout, reduced-motion arrows, rapid scrubbing, playback, and missing imagery and wind responses. For all eight dates, the imagery filename matched the selected day, the wind raster matched the source grid within floating-point precision, and both layers used the same geographic bounds. The project check builds the site and validates local asset paths.
