'use client'

import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { failed: boolean }

export class Hero3DErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Decorative 3D hero disabled after a rendering error.', error, info)
    }
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}
