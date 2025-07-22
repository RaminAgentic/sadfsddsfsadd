# Hierarchical Data Structure for Kanban Board Application

## Overview
This document outlines the comprehensive three-tier hierarchical data structure for boards, lists, and cards with proper relationships, unique IDs, timestamps, and referential integrity.

## Data Model Architecture

### 1. Board (Top Level)
**File**: `models/Board.js`

#### Properties:
- `id`: Unique identifier (auto-generated: `board_${timestamp}_${random}`)
- `title`: Board name (1-100 characters)
- `description`: Optional board description (max 500 characters)
- `color`: Hex color code for visual identification
- `listIds`: Array of associated list IDs (maintains order)
- `position`: Sort order among boards
- `createdAt`: ISO timestamp of creation
- `updatedAt`: ISO timestamp of last modification
- `isArchived`: Boolean flag for archival status
- `owner`: Board owner identifier
- `collaborators`: Array of collaborator identifiers

#### Methods:
- `addList(listId)`: Add list to board
- `removeList(listId)`: Remove list from board
- `reorderLists(newOrder)`: Reorder lists within board
- `updateTimestamp()`: Update modification time
- `toJSON()` / `fromJSON()`: Serialization methods

### 2. List (Middle Tier)
**File**: `models/List.js`

#### Properties:
- `id`: Unique identifier (auto-generated: `list_${timestamp}_${random}`)
- `title`: List name (1-100 characters)
- `boardId`: Parent board reference (required)
- `cardIds`: Array of associated card IDs (maintains order)
- `position`: Sort order within board
- `createdAt`: ISO timestamp of creation
- `updatedAt`: ISO timestamp of last modification
- `isArchived`: Boolean flag for archival status
- `wipLimit`: Work-in-progress limit (optional)
- `color`: Optional hex color code

#### Methods:
- `addCard(cardId)`: Add card to list
- `removeCard(cardId)`: Remove card from list
- `reorderCards(newOrder)`: Reorder cards within list
- `moveCard(cardId, fromIndex, toIndex)`: Move card within list
- `getCardCount()`: Get total number of cards
- `isWipLimitExceeded()`: Check if WIP limit exceeded
- `updateTimestamp()`: Update modification time

### 3. Card (Bottom Tier)
**File**: `models/Card.js`

#### Properties:
- `id`: Unique identifier (auto-generated: `card_${timestamp}_${random}`)
- `title`: Card title (1-200 characters)
- `description`: Card details (max 2000 characters)
- `listId`: Parent list reference (required)
- `position`: Sort order within list
- `createdAt`: ISO timestamp of creation
- `updatedAt`: ISO timestamp of last modification
- `dueDate`: Optional due date (ISO timestamp)
- `isCompleted`: Boolean completion status
- `isArchived`: Boolean flag for archival status
- `priority`: Priority level (low, medium, high, urgent)
- `labels`: Array of string labels
- `assignees`: Array of assigned user identifiers
- `attachments`: Array of file attachments with metadata
- `checklist`: Array of checklist items with completion status
- `comments`: Array of comments with author and timestamp
- `estimatedHours`: Estimated time for completion
- `actualHours`: Actual time spent
- `color`: Optional hex color code

#### Methods:
- `addLabel()` / `removeLabel()`: Manage labels
- `addAssignee()` / `removeAssignee()`: Manage assignees
- `addChecklistItem()` / `toggleChecklistItem()`: Manage checklist
- `addComment()`: Add comment with metadata
- `addAttachment()`: Add file attachment
- `isOverdue()`: Check if card is past due date
- `getChecklistProgress()`: Calculate checklist completion percentage

## Data Manager & Referential Integrity
**File**: `models/DataManager.js`

### Key Features:
1. **Centralized Storage**: Uses Maps for efficient lookups
2. **Referential Integrity**: Automatic parent-child relationship maintenance
3. **Cascading Operations**: Deleting a board removes all lists and cards
4. **Move Operations**: Maintains relationships during drag-and-drop
5. **Hierarchy Queries**: Complete board structure retrieval
6. **Search Capabilities**: Cross-entity search functionality
7. **Statistics**: Board-level metrics and completion tracking
8. **Export/Import**: Complete data serialization support

### Referential Integrity Rules:
- **Board → List**: Board tracks list IDs, lists reference board ID
- **List → Card**: List tracks card IDs, cards reference list ID
- **Cascading Deletes**: Removing parent removes all children
- **Move Validation**: Ensures valid parent-child relationships
- **Orphan Prevention**: All entities must have valid parent references

## Data Schema Validation

### Validation Features:
- **Type Checking**: Ensures correct data types
- **Length Limits**: Prevents oversized content
- **Required Fields**: Validates mandatory properties
- **Format Validation**: ISO timestamps, hex colors, etc.
- **Referential Constraints**: Parent ID validation

### Example Schema (Board):
```javascript
const BoardSchema = {
  id: { type: 'string', required: true, unique: true },
  title: { type: 'string', required: true, minLength: 1, maxLength: 100 },
  color: { type: 'string', pattern: /^#[0-9A-Fa-f]{6}$/ },
  listIds: { type: 'array', items: { type: 'string' } },
  createdAt: { type: 'string', format: 'date-time' },
  // ... additional properties
};
```

## Success Criteria Achieved ✓

1. **Nested Relationships**: Three-tier hierarchy with proper parent-child links
2. **Referential Integrity**: Automatic relationship maintenance and validation
3. **Unique IDs**: Auto-generated unique identifiers for all entities
4. **Timestamps**: Creation and modification tracking
5. **Order Properties**: Position-based sorting within collections
6. **Complete CRUD**: Full create, read, update, delete operations
7. **Data Validation**: Comprehensive schema validation
8. **Kanban Functionality**: All necessary properties for drag-and-drop boards

## Usage Example

```javascript
const dataManager = new DataManager();

// Create hierarchy
const board = dataManager.createBoard({ title: 'Project Board' });
const todoList = dataManager.createList({ 
  title: 'To Do', 
  boardId: board.id 
});
const card = dataManager.createCard({ 
  title: 'Task 1', 
  listId: todoList.id 
});

// Get complete hierarchy
const hierarchy = dataManager.getBoardHierarchy(board.id);
// Returns: { board: {...}, lists: [{ list: {...}, cards: [...] }] }
```

This hierarchical data structure provides a robust foundation for a Kanban board application with complete relationship management, data validation, and referential integrity.
EOF < /dev/null