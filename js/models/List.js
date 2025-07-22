/**
 * List Data Model
 * Middle-tier container for cards within a board
 */
class List {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.title = data.title || 'Untitled List';
    this.boardId = data.boardId || null;
    this.cardIds = data.cardIds || [];
    this.position = data.position || 0;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.isArchived = data.isArchived || false;
    this.wipLimit = data.wipLimit || null; // Work In Progress limit
    this.color = data.color || null;
  }

  generateId() {
    return 'list_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  addCard(cardId) {
    if (!this.cardIds.includes(cardId)) {
      this.cardIds.push(cardId);
      this.updateTimestamp();
    }
  }

  removeCard(cardId) {
    const index = this.cardIds.indexOf(cardId);
    if (index > -1) {
      this.cardIds.splice(index, 1);
      this.updateTimestamp();
    }
  }

  reorderCards(newOrder) {
    this.cardIds = newOrder;
    this.updateTimestamp();
  }

  moveCard(cardId, fromIndex, toIndex) {
    const cardIndex = this.cardIds.indexOf(cardId);
    if (cardIndex > -1) {
      this.cardIds.splice(cardIndex, 1);
      this.cardIds.splice(toIndex, 0, cardId);
      this.updateTimestamp();
    }
  }

  getCardCount() {
    return this.cardIds.length;
  }

  isWipLimitExceeded() {
    return this.wipLimit && this.cardIds.length > this.wipLimit;
  }

  updateTimestamp() {
    this.updatedAt = new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      boardId: this.boardId,
      cardIds: this.cardIds,
      position: this.position,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isArchived: this.isArchived,
      wipLimit: this.wipLimit,
      color: this.color
    };
  }

  static fromJSON(data) {
    return new List(data);
  }
}

// List Schema Definition
const ListSchema = {
  id: { type: 'string', required: true, unique: true },
  title: { type: 'string', required: true, minLength: 1, maxLength: 100 },
  boardId: { type: 'string', required: true },
  cardIds: { type: 'array', items: { type: 'string' } },
  position: { type: 'number', minimum: 0 },
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
  isArchived: { type: 'boolean' },
  wipLimit: { type: 'number', minimum: 1, nullable: true },
  color: { type: 'string', pattern: /^#[0-9A-Fa-f]{6}$/, nullable: true }
};

module.exports = { List, ListSchema };
