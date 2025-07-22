/**
 * Storage Service
 * Handles localStorage operations with error handling and data validation
 */

class StorageService {
  constructor() {
    this.prefix = 'ocean_kanban_';
    this.version = '1.0.0';
    this.initializeStorage();
  }

  initializeStorage() {
    try {
      if (\!this.get('boards')) {
        this.set('boards', []);
      }
      if (\!this.get('app_version')) {
        this.set('app_version', this.version);
      }
      if (\!this.get('user_preferences')) {
        this.set('user_preferences', {
          theme: 'ocean',
          autoSave: true,
          notifications: true
        });
      }
    } catch (error) {
      console.error('Failed to initialize storage:', error);
      this.handleStorageError(error);
    }
  }

  get(key) {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage (key: ${key}):`, error);
      this.handleStorageError(error);
      return null;
    }
  }

  set(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, serialized);
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage (key: ${key}):`, error);
      this.handleStorageError(error);
      return false;
    }
  }

  remove(key) {
    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (key: ${key}):`, error);
      return false;
    }
  }

  clear() {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(this.prefix))
        .forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  // Board operations
  getBoards() {
    return this.get('boards') || [];
  }

  saveBoards(boards) {
    return this.set('boards', boards);
  }

  addBoard(board) {
    const boards = this.getBoards();
    boards.push(board);
    return this.saveBoards(boards);
  }

  updateBoard(boardId, updatedBoard) {
    const boards = this.getBoards();
    const index = boards.findIndex(board => board.id === boardId);
    if (index \!== -1) {
      boards[index] = updatedBoard;
      return this.saveBoards(boards);
    }
    return false;
  }

  deleteBoard(boardId) {
    const boards = this.getBoards();
    const filteredBoards = boards.filter(board => board.id \!== boardId);
    return this.saveBoards(filteredBoards);
  }

  // Storage stats and management
  getStorageStats() {
    let totalSize = 0;
    let itemCount = 0;
    
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.prefix)) {
        totalSize += localStorage.getItem(key).length;
        itemCount++;
      }
    });

    return {
      totalSize: Math.round(totalSize / 1024), // KB
      itemCount,
      maxSize: 5120, // 5MB typical localStorage limit
      usagePercentage: Math.round((totalSize / (5120 * 1024)) * 100)
    };
  }

  // Backup and restore
  createBackup() {
    try {
      const data = {};
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.prefix)) {
          data[key.replace(this.prefix, '')] = JSON.parse(localStorage.getItem(key));
        }
      });

      const backup = {
        version: this.version,
        timestamp: new Date().toISOString(),
        data: data
      };

      return btoa(JSON.stringify(backup));
    } catch (error) {
      console.error('Failed to create backup:', error);
      return null;
    }
  }

  restoreBackup(backupString) {
    try {
      const backup = JSON.parse(atob(backupString));
      
      if (\!backup.version || \!backup.data) {
        throw new Error('Invalid backup format');
      }

      // Clear existing data
      this.clear();

      // Restore data
      Object.entries(backup.data).forEach(([key, value]) => {
        this.set(key, value);
      });

      return true;
    } catch (error) {
      console.error('Backup restore failed:', error);
      return false;
    }
  }

  // Error handling
  handleStorageError(error) {
    if (error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded. Consider archiving old boards.');
      this.showQuotaExceededWarning();
    } else if (error.name === 'SecurityError') {
      console.warn('localStorage access denied. Running in private mode?');
    }
  }

  showQuotaExceededWarning() {
    // This would trigger a UI notification in a real app
    console.warn('Storage limit reached. Some data may not be saved.');
  }

  // Data validation before storage
  validateAndSave(key, data) {
    if (this.validateData(data)) {
      return this.set(key, data);
    } else {
      console.error('Data validation failed, not saving:', key);
      return false;
    }
  }

  validateData(data) {
    try {
      // Basic validation - ensure data can be serialized
      JSON.stringify(data);
      
      // Check data size (warn if approaching limits)
      const size = JSON.stringify(data).length;
      if (size > 1024 * 1024) { // 1MB warning threshold
        console.warn('Large data object detected:', Math.round(size / 1024) + 'KB');
      }
      
      return true;
    } catch (error) {
      console.error('Data validation error:', error);
      return false;
    }
  }

  // Migration support for future versions
  migrate() {
    const currentVersion = this.get('app_version');
    
    if (\!currentVersion || currentVersion \!== this.version) {
      console.log('Migrating data from version', currentVersion, 'to', this.version);
      
      // Future migration logic would go here
      // For now, just update the version
      this.set('app_version', this.version);
      
      return true;
    }
    
    return false;
  }
}

// Data Validator utility functions
class DataValidator {
  static validateBoard(board) {
    const errors = [];
    
    if (\!board.id || typeof board.id \!== 'string') {
      errors.push('Invalid board ID');
    }
    
    if (\!board.title || board.title.trim().length === 0) {
      errors.push('Board title is required');
    } else if (board.title.length > 100) {
      errors.push('Board title too long (max 100 characters)');
    }
    
    if (board.description && board.description.length > 500) {
      errors.push('Board description too long (max 500 characters)');
    }
    
    if (\!Array.isArray(board.listIds)) {
      errors.push('Board listIds must be an array');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateList(list) {
    const errors = [];
    
    if (\!list.id || typeof list.id \!== 'string') {
      errors.push('Invalid list ID');
    }
    
    if (\!list.title || list.title.trim().length === 0) {
      errors.push('List title is required');
    } else if (list.title.length > 100) {
      errors.push('List title too long (max 100 characters)');
    }
    
    if (\!list.boardId || typeof list.boardId \!== 'string') {
      errors.push('List must belong to a board');
    }
    
    if (\!Array.isArray(list.cardIds)) {
      errors.push('List cardIds must be an array');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateCard(card) {
    const errors = [];
    
    if (\!card.id || typeof card.id \!== 'string') {
      errors.push('Invalid card ID');
    }
    
    if (\!card.title || card.title.trim().length === 0) {
      errors.push('Card title is required');
    } else if (card.title.length > 200) {
      errors.push('Card title too long (max 200 characters)');
    }
    
    if (card.description && card.description.length > 2000) {
      errors.push('Card description too long (max 2000 characters)');
    }
    
    if (\!card.listId || typeof card.listId \!== 'string') {
      errors.push('Card must belong to a list');
    }
    
    if (card.priority && \!['low', 'medium', 'high', 'urgent'].includes(card.priority)) {
      errors.push('Invalid card priority');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static sanitizeInput(input) {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML
      .trim()
      .substring(0, 1000); // Reasonable length limit
  }
}

// Export for use in other modules
if (typeof module \!== 'undefined' && module.exports) {
  module.exports = { StorageService, DataValidator };
}
EOF < /dev/null