export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    const later = () => {
      timeoutId = null;
      func(...args);
    };

    clearTimeout(timeoutId as ReturnType<typeof setTimeout>);
    timeoutId = setTimeout(later, wait);
  };
}