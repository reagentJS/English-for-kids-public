export default class Audioplayer {
  constructor() {
    this.audio = document.createElement('audio');
  }

  play(fileName) {
    this.audio.setAttribute('src', `./assets/short-sounds/${fileName}.mp3`);
    this.audio.load();
    this.audio.play();
  }
}
