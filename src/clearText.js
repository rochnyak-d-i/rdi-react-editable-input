import sanitizeHTML from 'sanitize-html';

export default function sanitize(text = '', allows = {}) {
  return sanitizeHTML(text, {
    allowedTags: allows.tags || false,
    allowedAttributes: allows.attributes || false
  });
}
