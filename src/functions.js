import { DEFAULT_OPTIONS } from './config';
import { pwdLengthInput, checkboxes, input } from './elements';

export function generate() {
  const qs = new URLSearchParams(
    Object.assign(
      DEFAULT_OPTIONS,
      _buildOptions()
    )
  );
  return fetch(`/.netlify/functions/generate?${qs}`, {
    credentials: 'same-origin'
  })
    .then(res => res.text())
    .then(pwd => {
      input.value = pwd;
    })
    .catch(error => {
      console.error(error)
    })
}

function _buildOptions() {
  const options = {};
  if (pwdLengthInput.value) {
    options.length = pwdLengthInput.value;
  }
  for (const checkbox of checkboxes) {
    const id = checkbox.dataset.id;
    options[id] = checkbox.checked;
  }
  return options;
}

export function getHistory() {
  return fetch('/.netlify/functions/history').then(r => r.json());
}