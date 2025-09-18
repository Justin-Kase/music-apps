from flask import Flask, request, send_file
from flask_cors import CORS
import mido
import io
import random

app = Flask(__name__)
CORS(app)

KEY_TO_MIDI = {
    'C': 60, 'C#': 61, 'D': 62, 'D#': 63, 'E': 64, 'F': 65,
    'F#': 66, 'G': 67, 'G#': 68, 'A': 69, 'A#': 70, 'B': 71
}

SCALE_INTERVALS = {
    'Major': [2, 2, 1, 2, 2, 2, 1],
    'Natural Minor': [2, 1, 2, 2, 1, 2, 2],
    'Harmonic Minor': [2, 1, 2, 2, 1, 3, 1],
    'Melodic Minor': [2, 1, 2, 2, 2, 2, 1],
    'Dorian': [2, 1, 2, 2, 2, 1, 2],
    'Phrygian': [1, 2, 2, 2, 1, 2, 2],
    'Lydian': [2, 2, 2, 1, 2, 2, 1],
    'Mixolydian': [2, 2, 1, 2, 2, 1, 2],
    'Locrian': [1, 2, 2, 1, 2, 2, 2],
    'Pentatonic Major': [2, 2, 3, 2, 3],
    'Pentatonic Minor': [3, 2, 2, 3, 2],
    'Blues': [3, 2, 1, 1, 3, 2],
    'Chromatic': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    'Whole Tone': [2, 2, 2, 2, 2, 2],
    'Augmented': [3, 1, 3, 1, 3, 1],
    'Double Harmonic': [1, 3, 1, 2, 1, 3, 1],
    'Hungarian Minor': [2, 1, 3, 1, 1, 3, 1],
    'Neapolitan Minor': [1, 2, 2, 2, 2, 2, 1],
    'Neapolitan Major': [1, 2, 2, 2, 2, 2, 1],
    'Enigmatic': [1, 3, 2, 2, 2, 1, 1],
    'Persian': [1, 3, 1, 1, 2, 3, 1],
    'Arabian': [2, 2, 1, 1, 2, 2, 2],
    'Spanish Gypsy': [1, 3, 1, 2, 1, 2, 2]
}

@app.route('/generate-midi', methods=['POST'])
def generate_midi():
    import mido
    import io
    import random

    data = request.json
    key = data.get('key', 'C')
    bars = int(data.get('bars', 32))
    scale = data.get('scale', 'Major')
    note_length = int(data.get('noteLength', 480))
    velocity = int(data.get('velocity', 80))
    randomize = bool(data.get('randomize', False))
    root_note = KEY_TO_MIDI.get(key, 60)
    intervals = SCALE_INTERVALS.get(scale, SCALE_INTERVALS['Major'])

    # Build scale notes for arpeggio (root + scale degrees)
    notes = [root_note]
    current = root_note
    for interval in intervals:
        current += interval
        notes.append(current)
    arpeggio_notes = notes[:4]

    mid = mido.MidiFile(ticks_per_beat=480)
    track = mido.MidiTrack()
    mid.tracks.append(track)
    track.append(mido.Message('program_change', program=0, time=0))

    for bar in range(bars):
        for note in arpeggio_notes:
            n_length = random.randint(60, 1920) if randomize else note_length
            n_velocity = random.randint(10, 127) if randomize else velocity
            track.append(mido.Message('note_on', note=note, velocity=n_velocity, time=0))
            track.append(mido.Message('note_off', note=note, velocity=n_velocity, time=n_length))

    midi_io = io.BytesIO()
    mid.save(file=midi_io)
    midi_io.seek(0)
    return send_file(
        midi_io,
        mimetype='audio/midi',
        as_attachment=True,
        download_name=f'generated_{key}_{scale}_{bars}bars.mid'
    )

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=6000)