import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Crash-Proof Error Boundary
 * Prevents white screen of death, catches runtime anomalies,
 * and allows smooth recovery without data loss.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error cleanly for debugging without crashing the browser
    console.error('Game Recovery Caught Error:', error, errorInfo);
  }

  private handleRecover = () => {
    this.setState({ hasError: false, error: null });
    // Soft reload game state without clearing local storage progress
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-[100dvh] max-w-lg mx-auto flex flex-col items-center justify-center p-6 bg-slate-950 text-slate-100 select-none">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/40 animate-pulse">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-white mb-2 text-center">
            Game Resumed Smoothly
          </h2>
          <p className="text-xs text-slate-400 text-center max-w-xs mb-6 leading-relaxed">
            An unexpected glitch was caught and neutralized so your progress and saved coins remain safe.
          </p>
          <button
            onClick={this.handleRecover}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 hover:from-emerald-500 hover:to-teal-500 active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Continue Playing</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
