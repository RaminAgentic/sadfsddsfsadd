/**
 * Board Data Model
 * Top-level container for Kanban board structure
 */
class Board {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.title = data.title || 'Untitled Board';
    this.description = data.description || '';
    this.color = data.color || '#0079bf';
    this.listIds = data.listIds || [];
    this.position = data.position || 0;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.isArchived = data.isArchived || false;
    this.owner = data.owner || null;
    this.collaborators = data.collaborators || [];
  }

  generateId() {
    return 'board_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  addList(listId) {
    if (!this.listIds.includes(listId)) {
      this.listIds.push(listId);
      this.updateTimestamp();
    }
  }

  removeList(listId) {
    const index = this.listIds.indexOf(listId);
    if (index > -1) {
      this.listIds.splice(index, 1);
      this.updateTimestamp();
    }
  }

  reorderLists(newOrder) {
    this.listIds = newOrder;
    this.updateTimestamp();
  }

  updateTimestamp() {
    this.updatedAt = new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      color: this.color,
      listIds: this.listIds,
      position: this.position,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isArchived: this.isArchived,
      owner: this.owner,
      collaborators: this.collaborators
    };
  }

  static fromJSON(data) {
    return new Board(data);
  }
}

// Board Schema Definition
const BoardSchema = {
  id: { type: 'string', required: true, unique: true },
  title: { type: 'string', required: true, minLength: 1, maxLength: 100 },
  description: { type: 'string', maxLength: 500 },
  color: { type: 'string', pattern: /^#[0-9A-Fa-f]{6}$/ },
  listIds: { type: 'array', items: { type: 'string' } },
  position: { type: 'number', minimum: 0 },
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
  isArchived: { type: 'boolean' },
  owner: { type: 'string', nullable: true },
  collaborators: { type: 'array', items: { type: 'string' } }
};

module.exports = { Board, BoardSchema };
