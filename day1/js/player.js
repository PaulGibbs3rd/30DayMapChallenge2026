/**
 * Gorillaz recordings, checked 2026-11-01.
 * Videos come from Warner's Gorillaz catalog and Gorillaz / Gorillaz - Topic.
 * Additional IDs were checked against YouTube's own oEmbed title/author metadata.
 * Two rarities use explicitly labeled fan/archive uploads.
 * See ../research/music-playback.md for sources and playback limits.
 */
const catalog = [
  ["19-2000", "WXR-bCF5dbM", "Official video"],
  ["5/4", "9lWKt4vxOdg", "Official animatic"],
  ["911", "EFKyGMpjFMs", "Archive upload · Gorillaz & D12", "Gorillaz Archive"],
  ["Andromeda", "9W44NWYwa1g", "Official audio"],
  ["Broken", "crC4DKiKPYY", "Official audio"],
  ["Busted and Blue", "gervMH6qMpU", "Official live recording · Printworks, London"],
  ["California and the Slipping of the Sun", "0aHc5Fn5IrI", "Official audio"],
  ["Casablanca", "NiHj1L1UvQM", "Official visualiser"],
  ["Clint Eastwood", "1V_xRb0x9aw", "Official video"],
  ["Cloud of Unknowing", "h7H73jpgX3U", "Official audio"],
  ["Delirium", "yw8ftPahxAg", "Official visualiser"],
  ["Demon Days", "LTJjQj6PkrY", "Official audio"],
  ["Dirty Harry", "cLnkQAeMbIM", "Official video"],
  ["Don't Get Lost in Heaven", "1L0bdrrJegA", "Official audio"],
  ["Double Bass", "_ONnnlhrM-g", "Official audio"],
  ["Dracula", "rOJ0__UQlLY", "Fan archive upload", "Everything Gorillaz"],
  ["El Mañana", "hji4gBuOvIQ", "Official video"],
  ["Empire Ants", "C-yP9f0gadU", "Official video"],
  ["Every Planet We Reach Is Dead", "eevt2glBfMg", "Official audio"],
  ["Feel Good Inc.", "HyHNuVaZJ-k", "Official video"],
  ["Fire Flies", "LCet4yrfp4o", "Official visualiser"],
  ["Garage Palace", "qoAxRICB9j8", "Official visualiser"],
  ["Ghost Train", "UdF9_gGv_vc", "Official audio"],
  ["Hollywood", "GgwE94KZJ7E", "Official visualiser"],
  ["Kansas", "skKP6QwOXYA", "Official visualiser"],
  ["Kids With Guns", "VCkFSe3voRc", "Official video"],
  ["Last Living Souls", "k7wIluiBvZE", "Official audio"],
  ["Latin Simone (¿Qué Pasa Contigo?)", "5xQzNkkedKI", "Official audio"],
  ["Let Me Out", "1dONxX9rifs", "Official audio"],
  ["M1 A1", "HWvPWQCWbsU", "Official audio"],
  ["New Genious (Brother)", "WFrd_HyHf3E", "Official audio"],
  ["New Gold", "qJa-VFwPpYA", "Official visualiser"],
  ["November Has Come", "EGc9mgpvtxU", "Official audio"],
  ["O Green World", "tMt_YXr90AM", "Official audio"],
  ["On Melancholy Hill", "04mfKJWDSzI", "Official video"],
  ["Opium", "Idt5gNZGi9Q", "Official audio"],
  ["Orange County", "X70VHzox6uA", "Official visualiser"],
  ["Pac-Man", "G-7U-FDql1A", "Official video"],
  ["Phoner to Arizona", "SAeUwuUGSaM", "Official visualiser"],
  ["Plastic Beach", "AGM8BMqBcTo", "Official audio"],
  ["Re-Hash", "Tv1SYqLllKI", "Official audio"],
  ["Rhinestone Eyes", "yYDmaexVHic", "Official storyboard film"],
  ["Rock the House", "lRlmM88zzbY", "Official video"],
  ["Saturnz Barz", "5qJp6xlKEug", "Official video"],
  ["She's My Collar", "-W20dfeNCmI", "Official audio"],
  ["Skinny Ape", "D8tjuP_nq5I", "Official lyric video"],
  ["Slow Country", "hqIWJeKA-HM", "Official audio"],
  ["Souk Eye", "-B57lnGcMpY", "Official visualiser"],
  ["Sound Check (Gravity)", "uQpclIzUwLk", "Official audio"],
  ["Strobelite", "DAXjiVuzlPw", "Official video"],
  ["Stylo", "nhPaWIeULKk", "Official video"],
  ["Submission", "sK4_drvjb4U", "Official audio"],
  ["Superfast Jellyfish", "t6BPyilmanI", "Official visual accompaniment"],
  ["The Empty Dream Machine", "H4dfwJ_IuSw", "Official visualiser"],
  ["The Happy Dictator", "MG_npaLydKg", "Official visualiser"],
  ["The Manifesto", "6JIv1l96zN0", "Official visualiser"],
  ["The Moon Cave", "OUh_hwmS0Xo", "Official visualiser"],
  ["The Mountain", "a2IdAW2A1ug", "Official visualiser"],
  ["The Pink Phantom", "CJ68kQLS250", "Official video"],
  ["The Sad God", "fQE0FnpfqQo", "Official visualiser"],
  ["The Shadowy Light", "P0gLOXQM6-c", "Official visualiser"],
  ["Tomorrow Comes Today", "PiNdcBg3xC8", "Official video"],
  ["Tranz", "E2Q52cVx7Bo", "Official video"],
  ["We Are Happy Landfill", "gpDBd9efcMo", "Official audio"],
  ["Welcome to the World of the Plastic Beach", "vruyqXg67rw", "Official audio"],
  ["White Light", "P91kQ8ADh5Q", "Official audio"],
];

// Exact track URIs from Spotify's public album/track embed metadata, 2026-11-01.
// No audio preview URLs are extracted, stored, or played outside Spotify's player.
const spotifyCatalog = [
  ["19-2000", "71koAFCnGnugRdGIDfS7f4", "Gorillaz"],
  ["5/4", "5Q10MhatY5DkgBfbWUkRpN", "Gorillaz"],
  ["911", "0tocP6ZmztTIDtm9IY9MA0", "Live in NYC · archive performance"],
  ["Andromeda", "2C0KFbb4v9CNWR5c9jWcKC", "Humanz"],
  ["Broken", "3THFKx88trZuOFlssVLJ5G", "Plastic Beach"],
  ["Busted and Blue", "04zxGiXcmNQ0m9oDXtwo18", "Humanz"],
  ["California and the Slipping of the Sun", "0T3sFcYATyEHE9iXMOudXV", "The Fall"],
  ["Casablanca", "4PjP7VfSAPxyt2TprUpALA", "The Mountain"],
  ["Clint Eastwood", "1RKUoGiLEbcXN4GY4spQDx", "Gorillaz"],
  ["Cloud of Unknowing", "0NDOVMOT6ah2k6HuXLrq5x", "Plastic Beach"],
  ["Delirium", "4uIXvy8PbYLEhs0PZgaP8p", "The Mountain"],
  ["Demon Days", "2k6hpKTyubRVOmQR11ViY3", "Demon Days"],
  ["Dirty Harry", "2bfGNzdiRa1jXZRdfssSzR", "Demon Days"],
  ["Don't Get Lost in Heaven", "4hjGZN8poACfjWCK3Og6vY", "Demon Days"],
  ["Double Bass", "6rlPa5vO2PV7bpVDz1SAG5", "Gorillaz"],
  ["Dracula", "6VftaOwtKDyrVEAarVHg4g", "G-Sides"],
  ["El Mañana", "0dcMqjeDpwqB2xhzMsld0p", "Demon Days"],
  ["Empire Ants", "3a6PN6BRB8PP3ms48s7kU1", "Plastic Beach"],
  ["Every Planet We Reach Is Dead", "2pw9RZWZibttZzoFhwjuy6", "Demon Days"],
  ["Feel Good Inc.", "0d28khcov6AiegSCpG5TuT", "Demon Days"],
  ["Fire Flies", "4A5FLaZI3Ni5eT0c9fqi8F", "The Now Now"],
  ["Garage Palace", "1Rstazzb7ttz0o7QpSPUGw", "Garage Palace · feat. Little Simz"],
  ["Ghost Train", "7rcxC221JJklGZFxPyQGZT", "G-Sides"],
  ["Hollywood", "0P2Dxoy0mdzM9NlFQoLZbc", "The Now Now"],
  ["Kansas", "7FJ7lHtpbWvPKe3zCoeAWC", "The Now Now"],
  ["Kids With Guns", "0eEgMbSzOHmkOeVuNC3E0k", "Demon Days"],
  ["Last Living Souls", "7JzmCjvB6bk48JghLyrg8N", "Demon Days"],
  ["Latin Simone (¿Qué Pasa Contigo?)", "5A0FQhWDBk2YSPiMjSZxe5", "Gorillaz"],
  ["Let Me Out", "44PelqgstAM0lb8rHPKfHq", "Humanz"],
  ["M1 A1", "0zbSbnHtSrVl1CBaTvCLIH", "Gorillaz"],
  ["New Genious (Brother)", "0rOG02q8ocSOeGHWrSAObK", "Gorillaz"],
  ["New Gold", "60SvhHtwefT0e2G7i7kOH3", "Cracker Island"],
  ["November Has Come", "6lrDckuosGpwEHtm1hHBcf", "Demon Days"],
  ["O Green World", "4hNPMfFHauPIbOKvdYqFt7", "Demon Days"],
  ["On Melancholy Hill", "0q6LuUqGLUiCPP1cbdwFs3", "Plastic Beach"],
  ["Opium", "0ZjkSNCmPseM9r9cCmc1Ce", "Song Machine"],
  ["Orange County", "4HnBNOfnPYCgRzB1dcAi3x", "The Mountain"],
  ["Pac-Man", "4H4WF5QKtbiGl7gdnGJ5QC", "Song Machine"],
  ["Phoner to Arizona", "3JbifTI5vkmehPZXuvpwun", "The Fall"],
  ["Plastic Beach", "2nZ33CKRbgpJQJJQKHuGXb", "Plastic Beach"],
  ["Re-Hash", "0dYN5MqKzCfdpDb1bgvdsm", "Gorillaz"],
  ["Rhinestone Eyes", "1foMv2HQwfQ2vntFf9HFeG", "Plastic Beach"],
  ["Rock the House", "0UQNHlrHiz19Htk7YTLVe5", "Gorillaz"],
  ["Saturnz Barz", "7l9CE3wmEGOUYw1j4ETjnL", "Humanz"],
  ["She's My Collar", "3lIxtCaROdRDuTnNBDm3n2", "Humanz"],
  ["Skinny Ape", "67BbnzIuXFd5knDLwB3mkN", "Cracker Island"],
  ["Slow Country", "2VX5J8lHfBjlcY4xU3TqtA", "Gorillaz"],
  ["Souk Eye", "4fjzDf54eBNOlW45mNe14U", "The Now Now"],
  ["Sound Check (Gravity)", "0HpJb4Lstb9R6wlu2jUBoy", "Gorillaz"],
  ["Strobelite", "6XGddj522FQRHXEhBtjiJu", "Humanz"],
  ["Stylo", "6LUfuyLgvgqrykiTE6sJHY", "Plastic Beach"],
  ["Submission", "2W4yTO3qHdqyvbz2UxfIPh", "Humanz"],
  ["Superfast Jellyfish", "1UJNbgfTzG1gZZTWFJdMf1", "Plastic Beach"],
  ["The Empty Dream Machine", "5FH7DTLl8WQNkZs00Cb3EM", "The Mountain"],
  ["The Happy Dictator", "4JbyNMvp3BqVILVy4Bbevf", "The Mountain"],
  ["The Manifesto", "1WUBWl3jNNYo0hrPTrA5D0", "The Mountain"],
  ["The Moon Cave", "6VflG4mpZSlpKnqNRL3NO9", "The Mountain"],
  ["The Mountain", "3MebYJnEDK4XdnCj3VMLjL", "The Mountain"],
  ["The Pink Phantom", "317NHDFQTxayqc69cimMLS", "Song Machine"],
  ["The Sad God", "5pMMyQyob7rjYO9y8lD7Ey", "The Mountain"],
  ["The Shadowy Light", "1WHBtgrgSKDJd9Y8vHNZqH", "The Mountain"],
  ["Tomorrow Comes Today", "6BL4PpswVjH9BAajbIbpmZ", "Gorillaz"],
  ["Tranz", "7jYUaoOfdcYgUvkK8NnFfx", "The Now Now"],
  ["We Are Happy Landfill", "2Y7ZiLq0vet6hyGiknmC3s", "D-Sides"],
  ["Welcome to the World of the Plastic Beach", "46WOptLnXUtH3LOyYvmMO1", "Plastic Beach"],
  ["White Light", "7hnW9af7GuGH5lyUUTa8UH", "Demon Days"],
];

function normalize(title) {
  return String(title).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]/g, "");
}

const tracks = new Map(catalog.map(([title, videoId, kind, uploader = "Gorillaz"]) => [normalize(title), { title, videoId, kind, uploader }]));
const spotifyTracks = new Map(spotifyCatalog.map(([title, trackId, album]) => [normalize(title), { title, trackId, album }]));
tracks.set(normalize("New Genius (Brother)"), tracks.get(normalize("New Genious (Brother)")));
tracks.set(normalize("Welcome to the World of Plastic Beach"), tracks.get(normalize("Welcome to the World of the Plastic Beach")));
spotifyTracks.set(normalize("New Genius (Brother)"), spotifyTracks.get(normalize("New Genious (Brother)")));
spotifyTracks.set(normalize("Welcome to the World of Plastic Beach"), spotifyTracks.get(normalize("Welcome to the World of the Plastic Beach")));

let provider = "spotify";
export function setProvider(value) {
  provider = value === "youtube" ? "youtube" : "spotify";
  stopPlayback();
  const embed = document.getElementById("player-embed");
  if (embed) embed.dataset.provider = provider;
  return provider;
}

export function getTrackVideo(title) {
  return tracks.get(normalize(title)) ?? null;
}

export function getSpotifyTrack(title) {
  return spotifyTracks.get(normalize(title)) ?? null;
}

function externalLink(label, href) {
  const link = document.createElement("a");
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = label;
  return link;
}

/** Remove the iframe so playback cannot continue behind a different selection. */
export function stopPlayback() {
  document.getElementById("player-embed")?.replaceChildren();
  const title = document.getElementById("player-title");
  const subtitle = document.getElementById("player-subtitle");
  const status = document.getElementById("player-status");
  if (title) title.textContent = "Choose a song";
  if (subtitle) subtitle.textContent = "Pick a track from the setlist.";
  if (status) status.replaceChildren();
}

/**
 * Load a verified recording, then let the visitor start it in the provider's controls.
 * Returns whether an embed was created; this does not assert playback availability.
 */
export async function loadTrack(title) {
  const embed = document.getElementById("player-embed");
  if (!embed) return false;
  stopPlayback();
  embed.dataset.provider = provider;
  const heading = document.getElementById("player-title");
  const subtitle = document.getElementById("player-subtitle");
  const status = document.getElementById("player-status");
  if (heading) heading.textContent = String(title);

  if (provider === "spotify") {
    const track = getSpotifyTrack(title);
    if (!track) {
      if (subtitle) subtitle.textContent = "No matching Gorillaz recording in the Spotify collection.";
      const message = document.createElement("p");
      message.textContent = "This brief concert cover has no verified matching Spotify recording.";
      embed.append(message, externalLink("Search Spotify ↗", `https://open.spotify.com/search/${encodeURIComponent(`Gorillaz ${title}`)}`));
      if (status) status.textContent = "You can also switch to YouTube to look for a concert recording.";
      return false;
    }
    if (subtitle) subtitle.textContent = `${track.album} · Gorillaz`;
    const iframe = document.createElement("iframe");
    iframe.src = `https://open.spotify.com/embed/track/${track.trackId}?utm_source=generator&theme=0`;
    iframe.title = `${track.title} — Spotify player`;
    iframe.width = "100%";
    iframe.height = "152";
    iframe.style.cssText = "display:block;width:100%;height:152px;border:0;border-radius:12px;";
    iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    embed.append(iframe);
    if (status) {
      status.append(document.createTextNode("Spotify may play a preview. Sign in on Spotify for the playback your account supports. "),
        externalLink("Open in Spotify ↗", `https://open.spotify.com/track/${track.trackId}`));
    }
    return true;
  }

  const track = getTrackVideo(title);
  if (!track) {
    if (subtitle) subtitle.textContent = "No verified official video in this collection.";
    const search = new URL("https://www.youtube.com/results");
    search.searchParams.set("search_query", `Gorillaz ${title}`);
    const message = document.createElement("p");
    message.textContent = "Find this song on YouTube.";
    embed.append(message, externalLink("Search YouTube ↗", search.href));
    if (status) status.textContent = "Search results may include fan uploads and live recordings.";
    return false;
  }

  if (subtitle) subtitle.textContent = `${track.kind} · ${track.uploader}`;
  const iframe = document.createElement("iframe");
  const source = new URL(`https://www.youtube-nocookie.com/embed/${track.videoId}`);
  source.searchParams.set("playsinline", "1");
  source.searchParams.set("rel", "0");
  source.searchParams.set("origin", location.origin);
  iframe.src = source.href;
  iframe.title = `${track.title} — ${track.kind}`;
  iframe.width = "100%";
  iframe.height = "210";
  iframe.style.cssText = "display:block;width:100%;min-width:200px;min-height:200px;border:0;background:#111;";
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  embed.append(iframe);
  if (status) {
    status.append(document.createTextNode("Use YouTube’s play button. Unavailable here? "),
      externalLink("Watch on YouTube ↗", `https://www.youtube.com/watch?v=${track.videoId}`));
  }
  return true;
}
