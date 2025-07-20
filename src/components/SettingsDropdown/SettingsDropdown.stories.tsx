import type { Meta, StoryObj } from '@storybook/react'
import SettingsDropdown from './SettingsDropdown/SettingsDropdown'

const meta = {
  title: 'Components/SettingsDropdown',
  component: SettingsDropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SettingsDropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
