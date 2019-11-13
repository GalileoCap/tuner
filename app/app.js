const Application = function() {
  this.tuner = new Tuner()
  this.notes = new Notes('.notes', this.tuner)
  this.meter = new Meter('.meter')
  this.frequencyBars = new FrequencyBars('.frequency-bars')
  this.update({ name: 'A', frequency: 440, octave: 4, value: 69, cents: 0 })
}

var _time= new Date;
var _D_time= 0;
var _last_note;
var _sheet_data= [];

function keep_time(lastNote) {
	var old_time= _time;
	_time= new Date;
	_D_time= _time.getTime() - old_time.getTime();
	_sheet_data.push([lastNote, _D_time])
	console.log('DELTA TIME', _D_time);
}

Application.prototype.start = function() {
  const self = this

  this.tuner.onNoteDetected = function(note) {
    if (self.notes.isAutoMode) {
      if (self.lastNote === note.name) {
        console.log('NOTE', note.name, note.octave);
        TUNER= this.tuner;
        self.update(note)
      } else {
				keep_time(self.lastNote);
        self.lastNote = note.name
      }
    }
  }

  swal('Welcome online tuner!').then(function() {
    self.tuner.init()
    self.frequencyData = new Uint8Array(self.tuner.analyser.frequencyBinCount)
  })

  if (!/Android/i.test(navigator.userAgent)) {
    this.updateFrequencyBars()
  }
}

Application.prototype.updateFrequencyBars = function() {
  if (this.tuner.analyser) {
    this.tuner.analyser.getByteFrequencyData(this.frequencyData)
    this.frequencyBars.update(this.frequencyData)
  }
  requestAnimationFrame(this.updateFrequencyBars.bind(this))
}

Application.prototype.update = function(note) {
  this.notes.update(note)
  this.meter.update((note.cents / 50) * 45)
}

// noinspection JSUnusedGlobalSymbols
Application.prototype.toggleAutoMode = function() {
  this.notes.toggleAutoMode()
}

const app = new Application()
app.start()
