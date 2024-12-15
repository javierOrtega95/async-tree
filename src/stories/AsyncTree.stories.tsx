import type { Meta, StoryObj } from '@storybook/react'
import AsyncTree from '../components/async-tree/AsyncTree'
import {
  CHILDREN_BY_FOLDER,
  DEFAULT_TREE,
  mockLoadChildren,
} from '../mocks/tree-mocks'

const meta: Meta<typeof AsyncTree> = {
  component: AsyncTree,
  tags: ['autodocs'],
  argTypes: {
    initialTree: {
      description: 'The tree structure to be displayed initially.',
      control: 'object',
    },
    loadChildren: {
      description:
        'Callback function to load the children of a folder asynchronously.',
      control: false,
    },
  },
}

export default meta
type Story = StoryObj<typeof AsyncTree>

export const Default: Story = {
  args: {
    initialTree: DEFAULT_TREE,
    loadChildren: (folder) => mockLoadChildren(CHILDREN_BY_FOLDER[folder.name]),
  },
}
