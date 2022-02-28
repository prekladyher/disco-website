export interface ActorType {
  id: number,
  fields: Record<string, any>,
  [key: string]: any
}

export interface ConversationType {
  id: number,
  fields: Record<string, any>,
  dialogueEntries?: DialogueEntryType[],
  [key: string]: any
}

export interface DialogueEntryType {
  id: number,
  fields: Record<string, any>,
  conversationID: number,
  outgoingLinks?: DialogueLinkType[],
  conditionsString: string,
  canvasRect: {
    x: number,
    y: number,
    width: number,
    height: number
  }
  [key: string]: any
}

export interface DialogueLinkType {
  originConversationID: number,
  originDialogueID: number,
  destinationConversationID: number,
  destinationDialogueID: number,
  isConnector?: number,
  priority?: number
}

export interface ItemType {
  id: number,
  fields: Record<string, any>,
}

export interface VariableType {
  id: number,
  fields: Record<string, any>,
}

export interface DialogueDatabase {
  actorsById: Map<number, ActorType>,
  conversationsById: Map<number, ActorType>,
  itemsById: Map<number, ItemType>,
  variablesByName: Map<string, VariableType>
}
