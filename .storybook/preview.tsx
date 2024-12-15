import type { Preview } from '@storybook/react'
import React from 'react'
import '../src/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{ width: 400, minHeight: 320, margin: 'auto', padding: '1rem' }}
      >
        <Story />
      </div>
    ),
  ],
}

export default preview
