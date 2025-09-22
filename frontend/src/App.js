import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// List of musical keys
const KEYS = [
  'C', 'C#', 'D', 'D#', 'E', 'F',
  'F#', 'G', 'G#', 'A', 'A#', 'B'
];

// List of available scales
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

// List of sequence types
const SEQUENCE_TYPES = [
  { value: 'arpeggio', label: 'Arpeggio' },
  { value: 'scale', label: 'Scale (stepwise)' },
  { value: 'random', label: 'Random Sequence' },
  { value: 'none', label: 'None (single note)' }
];

function App() {
  // State hooks for user-selected options
  const [key, setKey] = useState('C');
  const [bars, setBars] = useState(32);
  const [scale, setScale] = useState('Major');
  const [noteLength, setNoteLength] = useState(480);
  const [velocity, setVelocity] = useState(80);
  const [randomize, setRandomize] = useState(false);
  const [randomizeVelocity, setRandomizeVelocity] = useState(false);
  const [randomizeNoteLength, setRandomizeNoteLength] = useState(false);
  const [sequenceType, setSequenceType] = useState('arpeggio');
  const [loading, setLoading] = useState(false);

  // Handles MIDI generation and download
  const handleGenerate = async () => {
    setLoading(true);
    const response = await fetch('/generate-midi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key,
        bars,
        scale,
        noteLength,
        velocity,
        randomize,
        randomizeVelocity,
        randomizeNoteLength,
        sequenceType
      })
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated_${key}_${scale}_${bars}bars_${sequenceType}.mid`;
    a.click();
    window.URL.revokeObjectURL(url);
    setLoading(false);
  };

  return (
    <div className="bg-dark text-light min-vh-100 d-flex flex-column justify-content-center align-items-center">
      {/* Main card container */}
      <div className="card bg-secondary text-light p-4" style={{ minWidth: 350 }}>
        <h1 className="mb-4 text-center">MIDI Sequence Generator</h1>
        {/* Sequence type selection */}
        <div className="mb-3">
          <label htmlFor="sequenceTypeSelect" className="form-label">Sequence Type</label>
          <select
            id="sequenceTypeSelect"
            className="form-select"
            value={sequenceType}
            onChange={e => setSequenceType(e.target.value)}
          >
            {SEQUENCE_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        {/* Key selection */}
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
        {/* Scale selection */}
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
        {/* Bar length input */}
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
        {/* Note length slider */}
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
            disabled={randomizeNoteLength}
          />
          <div>{noteLength} ticks</div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="randomizeNoteLength"
              checked={randomizeNoteLength}
              onChange={e => setRandomizeNoteLength(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="randomizeNoteLength">
              Randomize note length
            </label>
          </div>
        </div>
        {/* Velocity slider */}
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
            disabled={randomizeVelocity}
          />
          <div>{velocity}</div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="randomizeVelocity"
              checked={randomizeVelocity}
              onChange={e => setRandomizeVelocity(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="randomizeVelocity">
              Randomize velocity
            </label>
          </div>
        </div>
        {/* Randomize checkbox */}
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
        {/* Generate button */}
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