/**
 * Data Manager
 * Utility functions for managing hierarchical data operations
 */
const { Board } = require('./Board');
const { List } = require('./List');
const { Card } = require('./Card');

class DataManager {
  constructor() {
    this.boards = new Map();
    this.lists = new Map();
    this.cards = new Map();
  }

  // Board operations
  createBoard(data) {
    const board = new Board(data);
    this.boards.set(board.id, board);
    return board;
  }

  getBoard(id) {
    return this.boards.get(id);
  }

  updateBoard(id, data) {
    const board = this.boards.get(id);
    if (board) {
      Object.assign(board, data);
      board.updateTimestamp();
      return board;
    }
    return null;
  }

  deleteBoard(id) {
    const board = this.boards.get(id);
    if (board) {
      // Delete all associated lists and cards
      board.listIds.forEach(listId => this.deleteList(listId));
      this.boards.delete(id);
      return true;
    }
    return false;
  }

  getAllBoards() {
    return Array.from(this.boards.values());
  }

  // List operations
  createList(data) {
    const list = new List(data);
    this.lists.set(list.id, list);
    
    // Add to parent board
    if (list.boardId) {
      const board = this.boards.get(list.boardId);
      if (board) {
        board.addList(list.id);
      }
    }
    
    return list;
  }

  getList(id) {
    return this.lists.get(id);
  }

  updateList(id, data) {
    const list = this.lists.get(id);
    if (list) {
      Object.assign(list, data);
      list.updateTimestamp();
      return list;
    }
    return null;
  }

  deleteList(id) {
    const list = this.lists.get(id);
    if (list) {
      // Delete all associated cards
      list.cardIds.forEach(cardId => this.deleteCard(cardId));
      
      // Remove from parent board
      if (list.boardId) {
        const board = this.boards.get(list.boardId);
        if (board) {
          board.removeList(id);
        }
      }
      
      this.lists.delete(id);
      return true;
    }
    return false;
  }

  getListsByBoard(boardId) {
    return Array.from(this.lists.values()).filter(list => list.boardId === boardId);
  }

  // Card operations
  createCard(data) {
    const card = new Card(data);
    this.cards.set(card.id, card);
    
    // Add to parent list
    if (card.listId) {
      const list = this.lists.get(card.listId);
      if (list) {
        list.addCard(card.id);
      }
    }
    
    return card;
  }

  getCard(id) {
    return this.cards.get(id);
  }

  updateCard(id, data) {
    const card = this.cards.get(id);
    if (card) {
      Object.assign(card, data);
      card.updateTimestamp();
      return card;
    }
    return null;
  }

  deleteCard(id) {
    const card = this.cards.get(id);
    if (card) {
      // Remove from parent list
      if (card.listId) {
        const list = this.lists.get(card.listId);
        if (list) {
          list.removeCard(id);
        }
      }
      
      this.cards.delete(id);
      return true;
    }
    return false;
  }

  getCardsByList(listId) {
    return Array.from(this.cards.values()).filter(card => card.listId === listId);
  }

  // Move operations
  moveCard(cardId, fromListId, toListId, position) {
    const card = this.cards.get(cardId);
    const fromList = this.lists.get(fromListId);
    const toList = this.lists.get(toListId);
    
    if (card && fromList && toList) {
      // Remove from old list
      fromList.removeCard(cardId);
      
      // Add to new list
      toList.addCard(cardId);
      
      // Update card's list reference
      card.listId = toListId;
      card.position = position;
      card.updateTimestamp();
      
      return true;
    }
    return false;
  }

  moveList(listId, toBoardId, position) {
    const list = this.lists.get(listId);
    const fromBoard = this.boards.get(list?.boardId);
    const toBoard = this.boards.get(toBoardId);
    
    if (list && fromBoard && toBoard) {
      // Remove from old board
      fromBoard.removeList(listId);
      
      // Add to new board
      toBoard.addList(listId);
      
      // Update list's board reference
      list.boardId = toBoardId;
      list.position = position;
      list.updateTimestamp();
      
      return true;
    }
    return false;
  }

  // Hierarchy queries
  getBoardHierarchy(boardId) {
    const board = this.boards.get(boardId);
    if (!board) return null;
    
    const boardData = board.toJSON();
    boardData.lists = board.listIds.map(listId => {
      const list = this.lists.get(listId);
      if (!list) return null;
      
      const listData = list.toJSON();
      listData.cards = list.cardIds.map(cardId => {
        const card = this.cards.get(cardId);
        return card ? card.toJSON() : null;
      }).filter(Boolean);
      
      return listData;
    }).filter(Boolean);
    
    return boardData;
  }

  // Search operations
  searchCards(query, boardId = null) {
    let cards = Array.from(this.cards.values());
    
    if (boardId) {
      const boardLists = this.getListsByBoard(boardId);
      const listIds = boardLists.map(list => list.id);
      cards = cards.filter(card => listIds.includes(card.listId));
    }
    
    const lowerQuery = query.toLowerCase();
    return cards.filter(card => 
      card.title.toLowerCase().includes(lowerQuery) ||
      card.description.toLowerCase().includes(lowerQuery) ||
      card.labels.some(label => label.toLowerCase().includes(lowerQuery))
    );
  }

  // Statistics
  getBoardStats(boardId) {
    const board = this.boards.get(boardId);
    if (!board) return null;
    
    const lists = this.getListsByBoard(boardId);
    const totalCards = lists.reduce((sum, list) => sum + list.cardIds.length, 0);
    const completedCards = lists.reduce((sum, list) => {
      const cards = this.getCardsByList(list.id);
      return sum + cards.filter(card => card.isCompleted).length;
    }, 0);
    
    return {
      boardId,
      totalLists: lists.length,
      totalCards,
      completedCards,
      completionPercentage: totalCards > 0 ? Math.round((completedCards / totalCards) * 100) : 0
    };
  }

  // Export/Import operations
  exportData() {
    return {
      boards: Array.from(this.boards.values()).map(board => board.toJSON()),
      lists: Array.from(this.lists.values()).map(list => list.toJSON()),
      cards: Array.from(this.cards.values()).map(card => card.toJSON())
    };
  }

  importData(data) {
    this.boards.clear();
    this.lists.clear();
    this.cards.clear();
    
    if (data.boards) {
      data.boards.forEach(boardData => {
        const board = Board.fromJSON(boardData);
        this.boards.set(board.id, board);
      });
    }
    
    if (data.lists) {
      data.lists.forEach(listData => {
        const list = List.fromJSON(listData);
        this.lists.set(list.id, list);
      });
    }
    
    if (data.cards) {
      data.cards.forEach(cardData => {
        const card = Card.fromJSON(cardData);
        this.cards.set(card.id, card);
      });
    }
  }
}

module.exports = { DataManager };
