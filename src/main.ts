import './styles/global.css';
import './styles/clay.css';
import './styles/clay-game.css';
import { App } from './app/App';

const mount = document.querySelector<HTMLElement>('#app');
if (!mount) {
  throw new Error('#app not found');
}

const app = new App(mount);

if (import.meta.hot) {
  import.meta.hot.dispose(() => app.dispose());
}
