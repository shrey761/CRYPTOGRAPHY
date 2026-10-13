/**
 * File Download / Key Export Utilities
 */

export function downloadTextFile(filename, text) {
  const element = document.createElement('a');
  const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export function exportKeyRecordAsJson(record) {
  const jsonStr = JSON.stringify(record, null, 2);
  const filename = `rsa-key-${record.key_size}bit-${record.id || 'export'}.json`;
  downloadTextFile(filename, jsonStr);
}
