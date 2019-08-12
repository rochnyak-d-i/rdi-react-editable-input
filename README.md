# rdi-react-editable-input

## Installation
```bash
npm i rdi-react-editable-input
```

## Usage

```jsx
import EditableInput from 'rdi-react-editable-input';
import 'rdi-react-editable-input/assets/style.css';

<EditableInput
  html={this.state.html}
  onChange={html => this.setState({html})}
/>
```
```jsx
const [html, setHTML] = useState('');

<EditableInput
  html={html}
  onChange={setHTML}
/>
```

## Development

```bash
npm i && npm run build
```
