import './App.css'
import AsyncTree from './components/async-tree/AsyncTree'
import { TreeNode, TreeNodeType } from './components/async-tree/types'

const initialTree: TreeNode[] = [
  {
    id: crypto.randomUUID(),
    nodeType: TreeNodeType.Folder,
    name: 'Documents',
    children: [],
  },
  {
    id: crypto.randomUUID(),
    nodeType: TreeNodeType.Folder,
    name: 'Pictures',
    children: [
      {
        id: crypto.randomUUID(),
        nodeType: TreeNodeType.Item,
        name: 'item.txt',
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    nodeType: TreeNodeType.Item,
    name: 'item.txt',
  },
]

function App() {
  return (
    <>
      <h1>Async Tree Demo</h1>

      <main>
        <AsyncTree initialTree={initialTree} />
      </main>
    </>
  )
}

export default App
