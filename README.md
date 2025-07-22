# Ocean Kanban Board

A comprehensive Kanban board application with ocean-themed styling and dynamic board rendering.

## Features

- **Dynamic Board Rendering**: Transform data structures into visual board layouts
- **Ocean Theme**: Beautiful ocean-inspired color palette and styling
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Interactive Cards**: Priority indicators, descriptions, and action buttons
- **Extensible Architecture**: Built with modularity in mind for future enhancements

## File Structure

- `index.html` - Main HTML structure and layout
- `styles.css` - Ocean-themed CSS with responsive design
- `script.js` - JavaScript board rendering system with sample data

## Usage

1. Open `index.html` in a web browser
2. The board will automatically render with sample data
3. View cards with different priority levels (high, medium, low)
4. Interact with buttons (functionality is placeholder for future development)

## Board Data Structure

```javascript
{
  id: 'board-1',
  title: 'Board Title',
  description: 'Board description',
  lists: [
    {
      id: 'list-1',
      title: 'List Title',
      cards: [
        {
          id: 'card-1',
          title: 'Card Title',
          description: 'Card description',
          priority: 'high' // 'high', 'medium', 'low'
        }
      ]
    }
  ]
}
```

## Classes and Methods

### BoardRenderer
- `renderBoard(boardData)` - Renders the complete board
- `createListElement(listData)` - Creates individual list elements
- `createCardHTML(cardData)` - Generates card HTML with styling
- `updateBoardHeader(boardData)` - Updates board title and description

### BoardUtils
- `generateId()` - Creates unique IDs
- `validateBoardData(data)` - Validates board structure
- `deepClone(obj)` - Deep clones objects

## Styling Features

- Ocean color palette with CSS variables
- Smooth animations and transitions
- Priority-based card colors
- Hover effects and visual feedback
- Responsive breakpoints for mobile
- Custom scrollbars with ocean theme

## Future Enhancements

- Drag and drop functionality
- Real-time data persistence
- Card editing and creation
- List management
- User authentication
- Collaboration features

EOF < /dev/null