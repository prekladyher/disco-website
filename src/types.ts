
export type BooleanFieldType = "True" | "False";

export type NumberFieldType = `${number}`;

export interface ActorType {
  id: number;
  fields: {
    /** Actor's official name. */
    "Name"?: string;
    "IsPlayer"?: BooleanFieldType;
    "IsNPC"?: BooleanFieldType;
    "IsFemale"?: BooleanFieldType;
    "Pictures"?: string;
    /** Short description for basic character actor. */
    "Description"?: string;
    "character_short_name"?: string;
    "character_alternative_name"?: string;
    /** Short description for skill actor representation. */
    "short_description"?: string;
    /** Long description for skill actor representation. */
    "LongDescription"?: string;
    "color"?: NumberFieldType;
    "Articy Id"?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface ConversationType {
  id: number;
  fields: Record<string, any>;
  dialogueEntries?: DialogueEntryType[];
  [key: string]: any;
}

export interface DialogueEntryType {
  id: number;
  fields: {
    /** Short entry title (not used in game). */
    "Title"?: string
    /** Annotation entry title (for technical entry displaying meta information in dialogue designer). */
    "annotation_title"?: string;
    /** Annotation entry text (for technical entry displaying meta information in dialogue designer). */
    "annotation_text"?: string;
    /** WIP flag for dialogue designer. */
    "status_needs_work"?: BooleanFieldType;
    /** XXX unknown (possibly voice actor instructions) */
    "dialog_stage_directions"?: string;

    /** Articy editor identifier. */
    "Articy Id"?: string;
    /** Articy input port identifier. */
    "InputId"?: string;
    /** Articy output port identifier. */
    "OutputId"?: string;

    /** Type of the dialogue entry. */
    "DialogueEntryType"?: "DialogueFragment" | "Hub" | "Fork" | "Jump" | "Instruction";
    /** Actor identifier for the dialogue line. */
    "Actor"?: NumberFieldType;
    /** Dialgoue line target / counterpart identifier. */
    "Conversant"?: NumberFieldType;
    /** Dialogue flow logic (wait for player input / run animation / ...). */
    "Sequence"?: string;

    /** Alternative name to display (used solely to suppress showing the actor's name). */
    "character_alternative_name"?: string;
    /** Embedded character data (used to override actor properties). */
    "character_game_data"?: string;

    /** Name of the variable to be set when the dialogue entry is successful based on its checks. */
    "FlagName"?: string;
    /** Skill check subject when different from Actor field (same actor reference). */
    "SkillType"?: string;
    /** Passive check -
        skill level threshold to enable and play the dialogue entry (skill defined by the Actor field). */
    "DifficultyPass"?: NumberFieldType;
    /** XXX unknown (possibly reversing DifficultyPass check). */
    "Antipassive"?: BooleanFieldType;
    /** White check (can be retried) -
       skill level threshold to succeed the dialogue entry (skill defined by the SkillType field). */
    "DifficultyWhite"?: NumberFieldType;
    /** Red check (can't be retried) -
        skill level threshold to succeed the dialogue entry (skill defined by the SkillType field). */
    "DifficultyRed"?: NumberFieldType;
    /** XXX unknown (always present with DifficultyAtmo) */
    "AlwaysSucceed"?: BooleanFieldType;
    /** XXX unknown (always present with SkillType) */
    "DifficultyAtmo"?: NumberFieldType;

    /** Skill check modifier amount (skill defined by SkillType field). */
    "modifier1"?: string;
    /** Skill check modifier test expression (skill defined by SkillType field) */
    "variable1"?: string;
    /** Skill check modifier tooltip when available (i.e. when the test expression is true). */
    "tooltip1"?: string;
    /** Skill check modifier amount (skill defined by SkillType field). */
    "modifier2"?: string;
    /** Skill check modifier test expression (skill defined by SkillType field) */
    "variable2"?: string;
    /** Skill check modifier tooltip when available (i.e. when the test expression is true). */
    "tooltip2"?: string;
    /** Skill check modifier amount (skill defined by SkillType field). */
    "modifier3"?: string;
    /** Skill check modifier test expression (skill defined by SkillType field) */
    "variable3"?: string;
    /** Skill check modifier tooltip when available (i.e. when the test expression is true). */
    "tooltip3"?: string;
    /** Skill check modifier amount (skill defined by SkillType field). */
    "modifier4"?: string;
    /** Skill check modifier test expression (skill defined by SkillType field) */
    "variable4"?: string;
    /** Skill check modifier tooltip when available (i.e. when the test expression is true). */
    "tooltip4"?: string;
    /** Skill check modifier amount (skill defined by SkillType field). */
    "modifier5"?: string;
    /** Skill check modifier test expression (skill defined by SkillType field) */
    "variable5"?: string;
    /** Skill check modifier tooltip when available (i.e. when the test expression is true). */
    "tooltip5"?: string;
    /** Skill check modifier amount (skill defined by SkillType field). */
    "modifier6"?: string;
    /** Skill check modifier test expression (skill defined by SkillType field) */
    "variable6"?: string;
    /** Skill check modifier tooltip when available (i.e. when the test expression is true). */
    "tooltip6"?: string;
    /** Skill check modifier amount (skill defined by SkillType field). */
    "modifier7"?: string;
    /** Skill check modifier test expression (skill defined by SkillType field) */
    "variable7"?: string;
    /** Skill check modifier tooltip when available (i.e. when the test expression is true). */
    "tooltip7"?: string;
    /** Skill check modifier amount (skill defined by SkillType field). */
    "modifier8"?: string;
    /** Skill check modifier test expression (skill defined by SkillType field) */
    "variable8"?: string;
    /** Skill check modifier tooltip when available (i.e. when the test expression is true). */
    "tooltip8"?: string;
    /** Skill check modifier amount (skill defined by SkillType field). */
    "modifier9"?: string;
    /** Skill check modifier test expression (skill defined by SkillType field) */
    "variable9"?: string;
    /** Skill check modifier tooltip when available (i.e. when the test expression is true). */
    "tooltip9"?: string;
    /** Skill check modifier amount (skill defined by SkillType field). */
    "modifier10"?: string;
    /** Skill check modifier test expression (skill defined by SkillType field) */
    "variable10"?: string;
    /** Skill check modifier tooltip when available (i.e. when the test expression is true). */
    "tooltip10"?: string;

    /** Actual dialogue text. */
    "Dialogue Text"?: string;
    /** Alternative dialogue text (override) condition. */
    "Condition1"?: string;
    /** Alternative dialogue (override) text. */
    "Alternate1"?: string;
    /** Alternative dialogue text (override) condition. */
    "Condition2"?: string;
    /** Alternative dialogue (override) text. */
    "Alternate2"?: string;
    /** Alternative dialogue text (override) condition. */
    "Condition3"?: string;
    /** Alternative dialogue (override) text. */
    "Alternate3"?: string;
    /** Alternative dialogue text (override) condition. */
    "Condition4"?: string;
    /** Alternative dialogue (override) text. */
    "Alternate4"?: string;

    // "Menu Text";
    // "AlwaysPlayVoice";
    // "PlayVoiceInPsychologicalMode";
    // "color";
    // "check_target";
    // "Forced";
    // "ClickCost";
    // "HiddenNotEnough";
    // "CostOnce";
    // "boolean_only";
    // "kim_watch";
    // "_alternative_item";
    // "HiddenTest";
    [key: string]: any
  };
  conversationID: number;
  outgoingLinks?: DialogueLinkType[];
  conditionPriority: number;
  conditionsString: string;
  userScript: string;
  canvasRect: {
    x: number;
    y: number;
    width: number;
    height: number;
  }
  [key: string]: any;
}

export interface DialogueLinkType {
  originConversationID: number;
  originDialogueID: number;
  destinationConversationID: number;
  destinationDialogueID: number;
  isConnector?: number;
  priority?: number;
}

export interface ItemType {
  id: number;
  fields: {
    // "Name"?: string;
    // "Is Item"?: string;
    // "Description"?: string;
    // "character_short_name"?: string;
    // "description"?: string;
    // "Cursed"?: string;
    // "IsItem"?: string;
    // "fixtureBonus"?: string;
    // "requirement"?: string;
    // "bonus"?: string;
    // "conversation"?: string;
    // "timeLeft"?: string;
    // "thoughtType"?: string;
    // "isThought"?: string;
    // "fixtureDescription"?: string;
    // "Articy Id"?: string;
    // "autoequip"?: string;
    // "cursed"?: string;
    // "itemType"?: string;
    // "isSubstance"?: string;
    // "stackName"?: string;
    // "sound"?: string;
    // "isConsumable"?: string;
    // "itemGroup"?: string;
    // "equipOrb"?: string;
    // "itemValue"?: string;
    // "MediumTextValue"?: string;
    // "multipleAllowed"?: string;
    // "Tooltip"?: string;
    // "alternativeEquipOrb"?: string;
    // "character_alternative_nam"?: string;
    [key: string]: any;
  };
}

export interface VariableType {
  id: number;
  fields: {
    // "Name"?: string
    // "Initial Value"?: string
    // "Description"?: string
    [key: string]: any;
  };
}

export interface DialogueDatabase {
  actorsById: Map<number, ActorType>;
  conversationsById: Map<number, ActorType>;
  itemsById: Map<number, ItemType>;
  variablesByName: Map<string, VariableType>;
}
