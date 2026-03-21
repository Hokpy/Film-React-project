import { Component, type ReactNode, type ErrorInfo } from 'react';
import styles from './ErrorBoundary.module.css';

interface Props { children: ReactNode; }
interface State { error: Error | null; }

// Глобальный перехватчик ошибок рендера — предотвращает белый экран
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className={styles.container}>
          <h2 className={`${styles.title} bebas`}>Что-то пошло не так</h2>
          <p className={styles.message}>{this.state.error.message}</p>
          <button
            className={styles.btn}
            onClick={() => { this.setState({ error: null }); window.location.href = '/'; }}
          >
            Вернуться на главную
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
