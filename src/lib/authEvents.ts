type Listener = () => void;

class AuthEventEmitter {
  private listeners: Listener[] = [];

  on(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  emit(event: 'logout') {
    this.listeners.forEach(l => l());
  }
}

export const authEvents = new AuthEventEmitter();
