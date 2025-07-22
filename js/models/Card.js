/**
 * Card Data Model
 * Individual task/item within a list
 */
class Card {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.title = data.title || 'Untitled Card';
    this.description = data.description || '';
    this.listId = data.listId || null;
    this.position = data.position || 0;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.dueDate = data.dueDate || null;
    this.isCompleted = data.isCompleted || false;
    this.isArchived = data.isArchived || false;
    this.priority = data.priority || 'medium'; // low, medium, high, urgent
    this.labels = data.labels || [];
    this.assignees = data.assignees || [];
    this.attachments = data.attachments || [];
    this.checklist = data.checklist || [];
    this.comments = data.comments || [];
    this.estimatedHours = data.estimatedHours || null;
    this.actualHours = data.actualHours || null;
    this.color = data.color || null;
  }

  generateId() {
    return 'card_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  addLabel(label) {
    if (!this.labels.includes(label)) {
      this.labels.push(label);
      this.updateTimestamp();
    }
  }

  removeLabel(label) {
    const index = this.labels.indexOf(label);
    if (index > -1) {
      this.labels.splice(index, 1);
      this.updateTimestamp();
    }
  }

  addAssignee(assignee) {
    if (!this.assignees.includes(assignee)) {
      this.assignees.push(assignee);
      this.updateTimestamp();
    }
  }

  removeAssignee(assignee) {
    const index = this.assignees.indexOf(assignee);
    if (index > -1) {
      this.assignees.splice(index, 1);
      this.updateTimestamp();
    }
  }

  addChecklistItem(item) {
    const checklistItem = {
      id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      text: item,
      isCompleted: false,
      createdAt: new Date().toISOString()
    };
    this.checklist.push(checklistItem);
    this.updateTimestamp();
  }

  toggleChecklistItem(itemId) {
    const item = this.checklist.find(item => item.id === itemId);
    if (item) {
      item.isCompleted = !item.isCompleted;
      this.updateTimestamp();
    }
  }

  addComment(comment) {
    const commentObj = {
      id: 'comment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      text: comment.text,
      author: comment.author,
      createdAt: new Date().toISOString()
    };
    this.comments.push(commentObj);
    this.updateTimestamp();
  }

  addAttachment(attachment) {
    const attachmentObj = {
      id: 'attachment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      name: attachment.name,
      url: attachment.url,
      type: attachment.type,
      size: attachment.size,
      createdAt: new Date().toISOString()
    };
    this.attachments.push(attachmentObj);
    this.updateTimestamp();
  }

  isOverdue() {
    return this.dueDate && new Date(this.dueDate) < new Date() && !this.isCompleted;
  }

  getChecklistProgress() {
    if (this.checklist.length === 0) return { completed: 0, total: 0, percentage: 0 };
    
    const completed = this.checklist.filter(item => item.isCompleted).length;
    const total = this.checklist.length;
    const percentage = Math.round((completed / total) * 100);
    
    return { completed, total, percentage };
  }

  updateTimestamp() {
    this.updatedAt = new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      listId: this.listId,
      position: this.position,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      dueDate: this.dueDate,
      isCompleted: this.isCompleted,
      isArchived: this.isArchived,
      priority: this.priority,
      labels: this.labels,
      assignees: this.assignees,
      attachments: this.attachments,
      checklist: this.checklist,
      comments: this.comments,
      estimatedHours: this.estimatedHours,
      actualHours: this.actualHours,
      color: this.color
    };
  }

  static fromJSON(data) {
    return new Card(data);
  }
}

// Card Schema Definition
const CardSchema = {
  id: { type: 'string', required: true, unique: true },
  title: { type: 'string', required: true, minLength: 1, maxLength: 200 },
  description: { type: 'string', maxLength: 2000 },
  listId: { type: 'string', required: true },
  position: { type: 'number', minimum: 0 },
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
  dueDate: { type: 'string', format: 'date-time', nullable: true },
  isCompleted: { type: 'boolean' },
  isArchived: { type: 'boolean' },
  priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
  labels: { type: 'array', items: { type: 'string' } },
  assignees: { type: 'array', items: { type: 'string' } },
  attachments: { 
    type: 'array', 
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        url: { type: 'string' },
        type: { type: 'string' },
        size: { type: 'number' },
        createdAt: { type: 'string', format: 'date-time' }
      }
    }
  },
  checklist: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        text: { type: 'string' },
        isCompleted: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' }
      }
    }
  },
  comments: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        text: { type: 'string' },
        author: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' }
      }
    }
  },
  estimatedHours: { type: 'number', minimum: 0, nullable: true },
  actualHours: { type: 'number', minimum: 0, nullable: true },
  color: { type: 'string', pattern: /^#[0-9A-Fa-f]{6}$/, nullable: true }
};

module.exports = { Card, CardSchema };
