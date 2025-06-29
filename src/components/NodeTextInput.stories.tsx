import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { useState } from 'react'
import { NodeTextInput } from './NodeTextInput'
import { type ActionItem } from './ActionGroup'

const NodeTextInputWrapper = ({
  initialValue,
  label,
  placeholder,
  actions,
  isLoading,
  className,
}: {
  initialValue: string
  label?: string
  placeholder?: string
  actions: ActionItem[]
  isProcessing?: boolean
  isLoading?: boolean
  loadingMessage?: string
  className?: string
}) => {
  const [value, setValue] = useState(initialValue)
  return (
    <NodeTextInput
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={setValue}
      actions={actions}
      isLoading={isLoading}
      className={className}
    />
  )
}

const meta = {
  title: 'Components/NodeTextInput',
  component: NodeTextInputWrapper,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    initialValue: { control: 'text' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    isProcessing: { control: 'boolean' },
    className: { control: 'text' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NodeTextInputWrapper>

export default meta
type Story = StoryObj<typeof meta>

const defaultActions: ActionItem[] = [
  {
    label: 'Enhance',
    onClick: fn(),
    isInternal: true,
  },
  {
    label: 'Clear',
    onClick: fn(),
  },
  {
    label: 'Submit',
    onClick: fn(),
  },
]

export const Default: Story = {
  args: {
    label: 'Prompt',
    placeholder: 'Enter your prompt',
    initialValue: '',
    actions: defaultActions,
    isProcessing: false,
  },
}

export const WithInternalActions: Story = {
  args: {
    label: 'Prompt',
    placeholder: 'Enter your prompt',
    initialValue: '',
    actions: [
      {
        label: 'Enhance',
        onClick: fn(),
        isInternal: true,
      },
      {
        label: 'Generate',
        onClick: fn(),
      },
    ],
  },
}

export const WithContent: Story = {
  args: {
    label: 'Prompt',
    placeholder: 'Enter your prompt',
    initialValue:
      'This is a sample prompt text that demonstrates how the component looks with content.',
    actions: defaultActions,
    isProcessing: false,
  },
}

export const Processing: Story = {
  args: {
    label: 'Prompt',
    placeholder: 'Enter your prompt',
    initialValue: 'Processing this prompt...',
    actions: defaultActions,
    isProcessing: true,
  },
}

export const CustomLabel: Story = {
  args: {
    label: 'Custom Input',
    placeholder: 'Type something here',
    initialValue: '',
    actions: defaultActions,
    isProcessing: false,
  },
}

export const CustomActions: Story = {
  args: {
    label: 'Prompt',
    placeholder: 'Enter your prompt',
    initialValue: '',
    actions: [
      {
        label: 'Save',
        onClick: fn(),
      },
      {
        label: 'Copy',
        onClick: fn(),
      },
      {
        label: 'Export',
        onClick: fn(),
      },
    ],
    isProcessing: false,
  },
}

export const Loading: Story = {
  args: {
    label: 'Prompt',
    placeholder: 'Enter your prompt',
    initialValue: 'Loading...',
    isLoading: true,
    actions: defaultActions,
  },
}

export const WithDropdownAction: Story = {
  args: {
    label: 'Prompt',
    placeholder: 'Enter your prompt',
    initialValue: 'A serene landscape with mountains and a lake',
    actions: [
      {
        label: 'Enhance',
        onClick: fn(),
        isInternal: true,
      },
      {
        label: 'Parse',
        dropdown: {
          items: [
            {
              label: 'Segment',
              onClick: fn(),
            },
            {
              label: 'Atomize',
              onClick: fn(),
            },
          ],
        },
      },
      {
        label: 'Generate',
        onClick: fn(),
      },
    ],
  },
}

export const ParseDropdownOnly: Story = {
  args: {
    label: 'Prompt Analysis',
    placeholder: 'Enter your prompt to analyze',
    initialValue:
      'A futuristic city at sunset with flying cars and neon lights reflecting on wet streets',
    actions: [
      {
        label: 'Parse',
        dropdown: {
          items: [
            {
              label: 'Segment',
              onClick: fn(),
            },
            {
              label: 'Atomize',
              onClick: fn(),
            },
          ],
        },
      },
    ],
  },
}
