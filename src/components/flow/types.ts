import type { DialogueEntryType } from "@/types";

export interface DialogueStepType {
  entry?: DialogueEntryType,
  link: {
    conversationId: number,
    entryId: number
  }
}

export interface DialoguePathType {
  origin: DialogueEntryType,
  destination: DialogueStepType
  steps: DialogueStepType[]
}
