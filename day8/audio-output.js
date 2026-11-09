/** Declare long-form music before opening Web Audio's output on iPhone. */
export function requestMusicPlayback(platform=globalThis){
  try{
    const session=platform.navigator?.audioSession;
    if(!session)return false;
    session.type='playback';
    return session.type==='playback';
  }catch{
    // Older browsers and embedded web views may not expose a writable session.
    return false;
  }
}

export function createPlaybackContext(platform=globalThis){
  requestMusicPlayback(platform);
  const AudioContext=platform.AudioContext||platform.webkitAudioContext;
  if(!AudioContext)throw new Error('This browser does not support Web Audio. You can still explore the atlas.');
  return new AudioContext();
}
