import type { DialogueEntryType } from "@/types";

export interface DialogueStepType {
  entry?: DialogueEntryType,
  link: {
    conversationId: number,
    entryId: number
  }
}

export interface DialoguePathType {
  destination: DialogueStepType
  steps: DialogueStepType[]
}
