import './App.css'
import AsyncTree from './components/async-tree/AsyncTree'
import {
  FolderNode,
  TreeNode,
  TreeNodeType,
} from './components/async-tree/types'

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
    children: [],
  },
  {
    id: crypto.randomUUID(),
    nodeType: TreeNodeType.Item,
    name: 'custom element',
  },
]

function App() {
  const loadChildren = async (folder: FolderNode): Promise<TreeNode[]> => {
    console.log(`Fetching children of folder ${folder.id}`)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    return [
      {
        id: crypto.randomUUID(),
        nodeType: TreeNodeType.Folder,
        name: 'Folder',
        children: [],
      },
      {
        id: crypto.randomUUID(),
        nodeType: TreeNodeType.Item,
        name: 'item.pdf',
      },
    ]
  }

  return (
    <>
      <h1>Async Tree Demo</h1>

      <main className='tree-container'>
        <AsyncTree initialTree={initialTree} loadChildren={loadChildren} />
      </main>
    </>
  )
}

export default App
