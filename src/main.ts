import './styles/global.css';
import './styles/clay.css';
import './styles/clay-game.css';
import './styles/game-but-sen.css';
import './styles/game-su-dia.css';
import { App } from './app/App';

const mount = document.querySelector<HTMLElement>('#app');
if (!mount) {
  throw new Error('#app not found');
}

const app = new App(mount);

if (import.meta.hot) {
  import.meta.hot.dispose(() => app.dispose());
}
