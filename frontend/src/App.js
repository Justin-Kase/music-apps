import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const KEYS = [
  'C', 'C#', 'D', 'D#', 'E', 'F',
  'F#', 'G', 'G#', 'A', 'A#', 'B'
];

const SCALES = [
  { name: 'Major' },
  { name: 'Natural Minor' },
  { name: 'Harmonic Minor' },
  { name: 'Melodic Minor' },
  { name: 'Dorian' },
  { name: 'Phrygian' },
  { name: 'Lydian' },
  { name: 'Mixolydian' },
  { name: 'Locrian' },
  { name: 'Pentatonic Major' },
  { name: 'Pentatonic Minor' },
  { name: 'Blues' },
  { name: 'Chromatic' },
  { name: 'Whole Tone' },
  { name: 'Augmented' },
  { name: 'Double Harmonic' },
  { name: 'Hungarian Minor' },
  { name: 'Neapolitan Minor' },
  { name: 'Neapolitan Major' },
  { name: 'Enigmatic' },
  { name: 'Persian' },
  { name: 'Arabian' },
  { name: 'Spanish Gypsy' }
];

function App() {
  const [key, setKey] = useState('C');
  const [bars, setBars] = useState(32);
  const [scale, setScale] = useState('Major');
  const [noteLength, setNoteLength] = useState(480);
  const [velocity, setVelocity] = useState(80);
  const [randomize, setRandomize] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const response = await fetch('/generate-midi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, bars, scale, noteLength, velocity, randomize })
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated_${key}_${scale}_${bars}bars.mid`;
    a.click();
    window.URL.revokeObjectURL(url);
    setLoading(false);
  };

  return (
    <div className="bg-dark text-light min-vh-100 d-flex flex-column justify-content-center align-items-center">
      <div className="card bg-secondary text-light p-4" style={{ minWidth: 350 }}>
        <h1 className="mb-4 text-center">MIDI Sequence Generator</h1>
        <div className="mb-3">
          <label htmlFor="keySelect" className="form-label">Select Key</label>
          <select
            id="keySelect"
            className="form-select"
            value={key}
            onChange={e => setKey(e.target.value)}
          >
            {KEYS.map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="scaleSelect" className="form-label">Select Scale</label>
          <select
            id="scaleSelect"
            className="form-select"
            value={scale}
            onChange={e => setScale(e.target.value)}
          >
            {SCALES.map(s => (
              <option key={s.name} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="barsInput" className="form-label">Bar Length</label>
          <input
            id="barsInput"
            type="number"
            className="form-control"
            min={1}
            max={128}
            value={bars}
            onChange={e => setBars(Number(e.target.value))}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="noteLength" className="form-label">Note Length (ticks, 480 = quarter note)</label>
          <input
            id="noteLength"
            type="range"
            className="form-range"
            min={60}
            max={1920}
            step={60}
            value={noteLength}
            onChange={e => setNoteLength(Number(e.target.value))}
            disabled={randomize}
          />
          <div>{noteLength} ticks</div>
        </div>
        <div className="mb-3">
          <label htmlFor="velocity" className="form-label">Velocity</label>
          <input
            id="velocity"
            type="range"
            className="form-range"
            min={10}
            max={127}
            value={velocity}
            onChange={e => setVelocity(Number(e.target.value))}
            disabled={randomize}
          />
          <div>{velocity}</div>
        </div>
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="randomize"
            checked={randomize}
            onChange={e => setRandomize(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="randomize">
            Randomize note length and velocity
          </label>
        </div>
        <button
          className="btn btn-primary w-100"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate MIDI'}
        </button>
      </div>
    </div>
  );
}

export default App;