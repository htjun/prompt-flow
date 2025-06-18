import type { Metadata } from 'next'
import { ReactFlowProvider } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import '../styles/global.css'

export const metadata: Metadata = {
  title: 'Prompt Flow',
  description: 'AI-powered prompt management and visualization tool',
  icons: {
    icon: '/logo.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReactFlowProvider>{children}</ReactFlowProvider>
      </body>
    </html>
  )
}
