export interface Landmark { id: string; name: string; category: string; lon: number; lat: number; description: string; height: number; custom?: boolean }
export const NEEDLE = { lon: -122.34928, lat: 47.62051 };
// Illustrative WGS84 samples. Mount Rainier uses USGS GNIS high-point coordinates (1533614).
export const LANDMARKS: Landmark[] = [
 {id:"mopop",name:"Museum of Pop Culture",category:"Seattle Center",lon:-122.34812,lat:47.62155,height:2,description:"A sample point on the plaza beside Seattle’s music and pop-culture museum."},
 {id:"science",name:"Pacific Science Center",category:"Seattle Center",lon:-122.35196,lat:47.61931,height:2,description:"Test the view toward the science center’s outdoor courtyard."},
 {id:"kerry",name:"Kerry Park",category:"Queen Anne",lon:-122.35984,lat:47.62947,height:2,description:"A sightline toward Queen Anne’s familiar skyline overlook."},
 {id:"lakeunion",name:"Lake Union Park",category:"South Lake Union",lon:-122.33756,lat:47.62706,height:2,description:"A waterfront sample point near the park’s northern promenade."},
 {id:"sculpture",name:"Olympic Sculpture Park",category:"Waterfront",lon:-122.35512,lat:47.61657,height:2,description:"Look toward the park’s open paths overlooking Elliott Bay."},
 {id:"pike",name:"Pike Place Market",category:"Downtown",lon:-122.34090,lat:47.60962,height:2,description:"A street-level sample point near the market’s Pike Street entrance."},
 {id:"wheel",name:"Seattle Great Wheel",category:"Waterfront",lon:-122.34238,lat:47.60605,height:2,description:"A sample point on Pier 57 near the wheel’s waterfront approach."},
 {id:"library",name:"Seattle Central Library",category:"Downtown",lon:-122.33281,lat:47.60696,height:2,description:"Test a street-level point beside the library along Fourth Avenue."},
 {id:"gasworks",name:"Gas Works Park",category:"Lake Union",lon:-122.33440,lat:47.64424,height:2,description:"Look across Lake Union toward the park’s southern shoreline."},
 {id:"stadium",name:"Lumen Field",category:"SoDo",lon:-122.33158,lat:47.59690,height:2,description:"A sample point in the open plaza north of the stadium."},
 {id:"rainier",name:"Mount Rainier",category:"Cascade Range",lon:-121.7604408,lat:46.8528267,height:2,description:"A summit-area sample at the USGS named high point. Explore the regional sightline or look toward the mountain from the deck. Clouds and haze are not modeled."}
];
export function distanceBearing(lon: number, lat: number) {
 const r = Math.PI / 180, a = NEEDLE.lat*r, b = lat*r, d = (lon-NEEDLE.lon)*r;
 const h = Math.sin((b-a)/2)**2 + Math.cos(a)*Math.cos(b)*Math.sin(d/2)**2;
 return {distance:6371008.8*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h)),bearing:(Math.atan2(Math.sin(d)*Math.cos(b),Math.cos(a)*Math.sin(b)-Math.sin(a)*Math.cos(b)*Math.cos(d))/r+360)%360};
}
export function rimPosition(bearing: number) {const a=bearing*Math.PI/180;return {lon:NEEDLE.lon+21*Math.sin(a)/(111320*Math.cos(NEEDLE.lat*Math.PI/180)),lat:NEEDLE.lat+21*Math.cos(a)/111320};}
