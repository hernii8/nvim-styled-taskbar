export interface SubItem {
  id: string
  label: string
  icon: string
  description?: string
  action: () => void
}

export interface Command {
  id: string
  name: string
  icon: string
  description: string
  getItems: (query: string) => Promise<SubItem[]> | SubItem[]
}
