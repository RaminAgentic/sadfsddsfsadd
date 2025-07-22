/**
 * Data Validation Utility
 * Provides validation functions for data integrity across models
 */
class DataValidator {
  static validateBoard(data) {
    const errors = [];

    if (!data.title || data.title.trim().length === 0) {
      errors.push('Board title is required');
    }
    if (data.title && data.title.length > 100) {
      errors.push('Board title must be 100 characters or less');
    }
    if (data.description && data.description.length > 500) {
      errors.push('Board description must be 500 characters or less');
    }
    if (data.color && !/^#[0-9A-Fa-f]{6}$/.test(data.color)) {
      errors.push('Board color must be a valid hex color code');
    }
    if (data.position && data.position < 0) {
      errors.push('Board position must be non-negative');
    }

    return { isValid: errors.length === 0, errors };
  }

  static validateList(data) {
    const errors = [];

    if (!data.title || data.title.trim().length === 0) {
      errors.push('List title is required');
    }
    if (data.title && data.title.length > 100) {
      errors.push('List title must be 100 characters or less');
    }
    if (!data.boardId) {
      errors.push('List must be associated with a board');
    }
    if (data.position && data.position < 0) {
      errors.push('List position must be non-negative');
    }
    if (data.wipLimit && data.wipLimit < 1) {
      errors.push('WIP limit must be at least 1');
    }
    if (data.color && !/^#[0-9A-Fa-f]{6}$/.test(data.color)) {
      errors.push('List color must be a valid hex color code');
    }

    return { isValid: errors.length === 0, errors };
  }

  static validateCard(data) {
    const errors = [];

    if (!data.title || data.title.trim().length === 0) {
      errors.push('Card title is required');
    }
    if (data.title && data.title.length > 200) {
      errors.push('Card title must be 200 characters or less');
    }
    if (data.description && data.description.length > 2000) {
      errors.push('Card description must be 2000 characters or less');
    }
    if (!data.listId) {
      errors.push('Card must be associated with a list');
    }
    if (data.position && data.position < 0) {
      errors.push('Card position must be non-negative');
    }
    if (data.priority && !['low', 'medium', 'high', 'urgent'].includes(data.priority)) {
      errors.push('Card priority must be one of: low, medium, high, urgent');
    }
    if (data.dueDate && !this.isValidISODate(data.dueDate)) {
      errors.push('Card due date must be a valid ISO date string');
    }
    if (data.estimatedHours && data.estimatedHours < 0) {
      errors.push('Estimated hours must be non-negative');
    }
    if (data.actualHours && data.actualHours < 0) {
      errors.push('Actual hours must be non-negative');
    }
    if (data.color && !/^#[0-9A-Fa-f]{6}$/.test(data.color)) {
      errors.push('Card color must be a valid hex color code');
    }

    return { isValid: errors.length === 0, errors };
  }

  static validateChecklistItem(item) {
    const errors = [];

    if (!item.text || item.text.trim().length === 0) {
      errors.push('Checklist item text is required');
    }
    if (item.text && item.text.length > 500) {
      errors.push('Checklist item text must be 500 characters or less');
    }

    return { isValid: errors.length === 0, errors };
  }

  static validateComment(comment) {
    const errors = [];

    if (!comment.text || comment.text.trim().length === 0) {
      errors.push('Comment text is required');
    }
    if (comment.text && comment.text.length > 1000) {
      errors.push('Comment text must be 1000 characters or less');
    }
    if (!comment.author || comment.author.trim().length === 0) {
      errors.push('Comment author is required');
    }

    return { isValid: errors.length === 0, errors };
  }

  static validateAttachment(attachment) {
    const errors = [];

    if (!attachment.name || attachment.name.trim().length === 0) {
      errors.push('Attachment name is required');
    }
    if (!attachment.url || attachment.url.trim().length === 0) {
      errors.push('Attachment URL is required');
    }
    if (!attachment.type || attachment.type.trim().length === 0) {
      errors.push('Attachment type is required');
    }
    if (attachment.size && attachment.size < 0) {
      errors.push('Attachment size must be non-negative');
    }

    return { isValid: errors.length === 0, errors };
  }

  static isValidISODate(dateString) {
    if (!dateString) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime()) && 
           date.toISOString() === dateString;
  }

  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[<>]/g, '');
  }

  static validateId(id, type = 'general') {
    if (!id || typeof id !== 'string') {
      return { isValid: false, error: 'ID must be a non-empty string' };
    }

    const validPrefixes = {
      board: 'board_',
      list: 'list_',
      card: 'card_',
      general: ''
    };

    if (type !== 'general' && !id.startsWith(validPrefixes[type])) {
      return { isValid: false, error: `${type} ID must start with '${validPrefixes[type]}'` };
    }

    return { isValid: true };
  }

  static validateArray(arr, itemValidator, fieldName) {
    if (!Array.isArray(arr)) {
      return { isValid: false, error: `${fieldName} must be an array` };
    }

    for (let i = 0; i < arr.length; i++) {
      const validation = itemValidator(arr[i]);
      if (!validation.isValid) {
        return { 
          isValid: false, 
          error: `${fieldName}[${i}]: ${validation.errors?.join(', ') || validation.error}` 
        };
      }
    }

    return { isValid: true };
  }
}

module.exports = { DataValidator };
