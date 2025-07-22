// Board Rendering System
class BoardRenderer {
    constructor() {
        this.listsContainer = document.getElementById('lists-container');
        this.boardHeader = document.querySelector('.board-header');
    }

    // Sample data structure for testing
    getSampleData() {
        return {
            id: 'board-1',
            title: 'Ocean Project',
            description: 'Dive deep into productivity',
            lists: [
                {
                    id: 'list-1',
                    title: 'To Do',
                    cards: [
                        { id: 'card-1', title: 'Plan project structure', description: 'Define the basic architecture and components', priority: 'high' },
                        { id: 'card-2', title: 'Design ocean theme', description: 'Create beautiful ocean-inspired visuals', priority: 'medium' },
                        { id: 'card-3', title: 'Setup development environment', description: 'Configure tools and dependencies', priority: 'low' }
                    ]
                },
                {
                    id: 'list-2',
                    title: 'In Progress',
                    cards: [
                        { id: 'card-4', title: 'Implement board rendering', description: 'Create dynamic board display system', priority: 'high' },
                        { id: 'card-5', title: 'Add drag and drop', description: 'Enable card movement between lists', priority: 'medium' }
                    ]
                },
                {
                    id: 'list-3',
                    title: 'Done',
                    cards: [
                        { id: 'card-6', title: 'Initial HTML structure', description: 'Basic layout and components', priority: 'medium' },
                        { id: 'card-7', title: 'Ocean theme CSS', description: 'Beautiful styling with ocean colors', priority: 'high' }
                    ]
                }
            ]
        };
    }

    // Render the entire board
    renderBoard(boardData = null) {
        const data = boardData || this.getSampleData();
        
        // Update board header
        this.updateBoardHeader(data);
        
        // Clear existing content
        this.listsContainer.innerHTML = '';
        
        // Render each list
        data.lists.forEach(list => {
            const listElement = this.createListElement(list);
            this.listsContainer.appendChild(listElement);
        });
        
        // Add "Add List" button
        this.addNewListButton();
    }

    // Update board header with data
    updateBoardHeader(boardData) {
        const titleElement = this.boardHeader.querySelector('.board-title');
        const descriptionElement = this.boardHeader.querySelector('.board-description');
        
        if (titleElement) titleElement.textContent = boardData.title;
        if (descriptionElement) descriptionElement.textContent = boardData.description;
    }

    // Create a list element
    createListElement(listData) {
        const listElement = document.createElement('div');
        listElement.className = 'kanban-list';
        listElement.dataset.listId = listData.id;
        
        listElement.innerHTML = \`
            <div class="list-header">
                <h3 class="list-title">\${listData.title}</h3>
                <div class="list-actions">
                    <button class="btn-icon" title="Add Card">+</button>
                    <button class="btn-icon" title="List Options">⋯</button>
                </div>
            </div>
            <div class="cards-container" data-list-id="\${listData.id}">
                \${listData.cards.map(card => this.createCardHTML(card)).join('')}
            </div>
            <div class="list-footer">
                <button class="btn-add-card">+ Add a card</button>
            </div>
        \`;
        
        return listElement;
    }

    // Create card HTML
    createCardHTML(cardData) {
        const priorityClass = \`priority-\${cardData.priority || 'medium'}\`;
        
        return \`
            <div class="kanban-card \${priorityClass}" data-card-id="\${cardData.id}">
                <div class="card-header">
                    <h4 class="card-title">\${cardData.title}</h4>
                    <div class="card-priority \${priorityClass}"></div>
                </div>
                \${cardData.description ? \`<p class="card-description">\${cardData.description}</p>\` : ''}
                <div class="card-footer">
                    <div class="card-actions">
                        <button class="btn-icon btn-edit" title="Edit">✏️</button>
                        <button class="btn-icon btn-delete" title="Delete">🗑️</button>
                    </div>
                </div>
            </div>
        \`;
    }

    // Add "Add List" button
    addNewListButton() {
        const addListElement = document.createElement('div');
        addListElement.className = 'add-list-container';
        addListElement.innerHTML = \`
            <button class="btn-add-list">
                <span class="add-icon">+</span>
                Add another list
            </button>
        \`;
        
        this.listsContainer.appendChild(addListElement);
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Add card buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn-add-card')) {
                this.handleAddCard(e.target);
            }
            
            if (e.target.matches('.btn-add-list')) {
                this.handleAddList();
            }
            
            if (e.target.matches('.btn-edit')) {
                this.handleEditCard(e.target);
            }
            
            if (e.target.matches('.btn-delete')) {
                this.handleDeleteCard(e.target);
            }
        });
    }

    // Event handlers (placeholder implementations)
    handleAddCard(button) {
        const listId = button.closest('.kanban-list').dataset.listId;
        console.log('Add card to list:', listId);
        // TODO: Implement add card functionality
    }

    handleAddList() {
        console.log('Add new list');
        // TODO: Implement add list functionality
    }

    handleEditCard(button) {
        const cardId = button.closest('.kanban-card').dataset.cardId;
        console.log('Edit card:', cardId);
        // TODO: Implement edit card functionality
    }

    handleDeleteCard(button) {
        const cardId = button.closest('.kanban-card').dataset.cardId;
        if (confirm('Are you sure you want to delete this card?')) {
            console.log('Delete card:', cardId);
            // TODO: Implement delete card functionality
        }
    }
}

// Initialize the board renderer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const boardRenderer = new BoardRenderer();
    boardRenderer.renderBoard();
    boardRenderer.initializeEventListeners();
    
    console.log('Ocean Kanban Board initialized successfully\! 🌊');
});

// Utility functions
const BoardUtils = {
    // Generate unique IDs
    generateId: () => 'id-' + Math.random().toString(36).substr(2, 9),
    
    // Format date
    formatDate: (date) => new Date(date).toLocaleDateString(),
    
    // Validate board data structure
    validateBoardData: (data) => {
        return data && 
               data.id && 
               data.title && 
               Array.isArray(data.lists);
    },
    
    // Deep clone object
    deepClone: (obj) => JSON.parse(JSON.stringify(obj))
};

// Export for potential module use
if (typeof module \!== 'undefined' && module.exports) {
    module.exports = { BoardRenderer, BoardUtils };
}
EOF < /dev/null