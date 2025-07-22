# Kanban Board Hierarchical Data Structure Implementation

## Overview
The Kanban board application implements a three-tier hierarchical data structure: **Boards → Lists → Cards**. Each tier maintains referential integrity through ID-based relationships and supports full CRUD operations with proper cascading behaviors.

## Data Model Architecture

### 1. Board Model (`models/Board.js`)
**Top-level container for organizing Kanban boards**

#### Core Properties:
- `id`: Unique identifier (`board_${timestamp}_${random}`)
- `title`: Board name (1-100 chars)
- `description`: Optional description (max 500 chars)
- `color`: Hex color code for board theme
- `listIds`: Array of child list IDs (maintains order)
- `position`: Numeric position for sorting
- `createdAt`/`updatedAt`: ISO timestamps
- `isArchived`: Boolean archival status
- `owner`: User ID of board owner
- `collaborators`: Array of collaborator user IDs

#### Key Methods:
- `addList(listId)`: Adds list ID to board
- `removeList(listId)`: Removes list ID from board
- `reorderLists(newOrder)`: Updates list order
- `updateTimestamp()`: Updates modification time

### 2. List Model (`models/List.js`)
**Middle-tier container for organizing cards within boards**

#### Core Properties:
- `id`: Unique identifier (`list_${timestamp}_${random}`)
- `title`: List name (1-100 chars)
- `boardId`: Parent board ID (required)
- `cardIds`: Array of child card IDs (maintains order)
- `position`: Numeric position within board
- `createdAt`/`updatedAt`: ISO timestamps
- `isArchived`: Boolean archival status
- `wipLimit`: Work-in-progress limit (optional)
- `color`: Optional hex color code

#### Key Methods:
- `addCard(cardId)`: Adds card ID to list
- `removeCard(cardId)`: Removes card ID from list
- `reorderCards(newOrder)`: Updates card order
- `moveCard(cardId, fromIndex, toIndex)`: Repositions card
- `getCardCount()`: Returns number of cards
- `isWipLimitExceeded()`: Checks WIP limit violation

### 3. Card Model (`models/Card.js`)
**Individual task/item within lists**

#### Core Properties:
- `id`: Unique identifier (`card_${timestamp}_${random}`)
- `title`: Card title (1-200 chars)
- `description`: Detailed description (max 2000 chars)
- `listId`: Parent list ID (required)
- `position`: Numeric position within list
- `createdAt`/`updatedAt`: ISO timestamps
- `dueDate`: Optional due date (ISO format)
- `isCompleted`: Boolean completion status
- `isArchived`: Boolean archival status
- `priority`: Enum ('low', 'medium', 'high', 'urgent')
- `labels`: Array of string labels
- `assignees`: Array of assignee user IDs
- `attachments`: Array of attachment objects
- `checklist`: Array of checklist items
- `comments`: Array of comment objects
- `estimatedHours`/`actualHours`: Time tracking
- `color`: Optional hex color code

#### Key Methods:
- `addLabel(label)`: Adds label to card
- `removeLabel(label)`: Removes label from card
- `addAssignee(assignee)`: Adds assignee to card
- `addChecklistItem(item)`: Creates checklist item
- `toggleChecklistItem(itemId)`: Toggles checklist completion
- `addComment(comment)`: Adds comment with metadata
- `addAttachment(attachment)`: Adds file attachment
- `isOverdue()`: Checks if past due date
- `getChecklistProgress()`: Returns completion stats

## Data Management Layer (`models/DataManager.js`)

### Core Storage
- In-memory Maps for fast lookups:
  - `boards`: Map<string, Board>
  - `lists`: Map<string, List>
  - `cards`: Map<string, Card>

### CRUD Operations

#### Board Operations:
- `createBoard(data)`: Creates new board
- `getBoard(id)`: Retrieves board by ID
- `updateBoard(id, data)`: Updates board properties
- `deleteBoard(id)`: Cascades deletion to lists and cards
- `getAllBoards()`: Returns all boards

#### List Operations:
- `createList(data)`: Creates list and links to board
- `getList(id)`: Retrieves list by ID
- `updateList(id, data)`: Updates list properties
- `deleteList(id)`: Cascades deletion to cards, unlinks from board
- `getListsByBoard(boardId)`: Returns lists for specific board

#### Card Operations:
- `createCard(data)`: Creates card and links to list
- `getCard(id)`: Retrieves card by ID
- `updateCard(id, data)`: Updates card properties
- `deleteCard(id)`: Removes card, unlinks from list
- `getCardsByList(listId)`: Returns cards for specific list

### Advanced Operations

#### Movement Operations:
- `moveCard(cardId, fromListId, toListId, position)`: Moves card between lists
- `moveList(listId, toBoardId, position)`: Moves list between boards

#### Hierarchy Queries:
- `getBoardHierarchy(boardId)`: Returns complete nested structure
- `searchCards(query, boardId)`: Full-text search across cards
- `getBoardStats(boardId)`: Returns completion statistics

#### Data Persistence:
- `exportData()`: Serializes all data to JSON
- `importData(data)`: Restores data from JSON

## Referential Integrity

### Parent-Child Relationships:
1. **Board → Lists**: `board.listIds` contains array of list IDs
2. **List → Cards**: `list.cardIds` contains array of card IDs
3. **Child → Parent**: `list.boardId` and `card.listId` reference parents

### Cascading Operations:
- Deleting board removes all associated lists and cards
- Deleting list removes all associated cards
- Moving items maintains all relationships

### Data Consistency:
- All create operations automatically establish bi-directional links
- All delete operations clean up orphaned references
- Move operations update both source and target containers

## Schema Validation

Each model includes comprehensive schema definitions:
- Required field validation
- Type checking (string, number, boolean, array)
- Format validation (date-time, hex colors, enums)
- Length constraints (min/max lengths)
- Pattern matching (regex for colors)

## Unique ID Generation

All entities use timestamp-based IDs with random suffixes:
```javascript
generateId() {
  return `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
```

This ensures:
- Chronological sorting capability
- Uniqueness across distributed systems
- Human-readable prefixes for debugging

## Time Management

All entities maintain:
- `createdAt`: Set once on creation
- `updatedAt`: Updated on every modification
- Automatic timestamp updates via `updateTimestamp()` method

## Success Criteria Met

✅ **Hierarchical Structure**: Three-tier Board → List → Card hierarchy implemented
✅ **Unique IDs**: Timestamp-based IDs with type prefixes
✅ **Timestamps**: Creation and modification timestamps on all entities
✅ **Order Properties**: Position fields for custom sorting
✅ **Referential Integrity**: Bi-directional relationships maintained
✅ **CRUD Operations**: Complete create, read, update, delete functionality
✅ **Data Consistency**: Cascading operations and cleanup
✅ **Schema Validation**: Comprehensive validation rules
✅ **Advanced Features**: Search, statistics, import/export, movement operations

The data structure provides a robust foundation for the Kanban board application with proper separation of concerns, maintainable code, and scalable architecture.
EOF < /dev/null