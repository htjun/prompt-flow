import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { useState, ReactNode } from 'react'
import { NodeTextInput } from './NodeTextInput'
import { ActionButton, ActionDropdown, ActionDropdownItem } from './ActionGroup'

const NodeTextInputWrapper = ({
  initialValue,
  label,
  placeholder,
  children,
  isLoading,
  className,
}: {
  initialValue: string
  label?: string
  placeholder?: string
  children: ReactNode
  isLoading?: boolean
  className?: string
}) => {
  const [value, setValue] = useState(initialValue)
  return (
    <NodeTextInput
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={setValue}
      isLoading={isLoading}
      className={className}
    >
      {children}
    </NodeTextInput>
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
    isLoading: { control: 'boolean' },
    className: { control: 'text' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NodeTextInputWrapper>

export default meta
type Story = StoryObj<typeof meta>

const DefaultActions = () => (
  <>
    <div>
      <ActionButton onClick={fn()}>Enhance</ActionButton>
      <ActionButton onClick={fn()}>Clear</ActionButton>
    </div>
    <ActionButton onClick={fn()}>Submit</ActionButton>
  </>
)

export const Default: Story = {
  args: {
    label: 'Prompt',
    placeholder: 'Enter your prompt',
    initialValue: '',
    children: <DefaultActions />,
    isLoading: false,
  },
}

export const WithContent: Story = {
  args: {
    label: 'Prompt',
    placeholder: 'Enter your prompt',
    initialValue:
      'This is a sample prompt text that demonstrates how the component looks with content.',
    children: <DefaultActions />,
    isLoading: false,
  },
}

export const Loading: Story = {
  args: {
    label: 'Prompt',
    placeholder: 'Enter your prompt',
    initialValue: 'Processing this prompt...',
    children: <DefaultActions />,
    isLoading: true,
  },
}

export const CustomLabel: Story = {
  args: {
    label: 'Custom Input',
    placeholder: 'Type something here',
    initialValue: '',
    children: <DefaultActions />,
    isLoading: false,
  },
}

export const WithDropdownAction: Story = {
  args: {
    label: 'Prompt',
    placeholder: 'Enter your prompt',
    initialValue: 'A serene landscape with mountains and a lake',
    children: (
      <>
        <ActionDropdown label="Format">
          <ActionDropdownItem onClick={fn()}>Segment</ActionDropdownItem>
          <ActionDropdownItem onClick={fn()}>Atomize</ActionDropdownItem>
        </ActionDropdown>
        <ActionButton onClick={fn()}>Generate</ActionButton>
      </>
    ),
    isLoading: false,
  },
}
