# Task Management Frontend

A complete React 19 + TypeScript + Ant Design frontend application for managing and executing tasks through a REST API.

## Features

- 📋 **Task List**: View all tasks in a clean, organized table
- 🔍 **Search**: Filter tasks by name with real-time search
- ➕ **Create Tasks**: Add new tasks with name, command, and description
- ▶️ **Execute Tasks**: Run task commands and view output in real-time
- 🗑️ **Delete Tasks**: Remove tasks with confirmation dialog
- 🔄 **Real-time Updates**: Automatic refresh after operations
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Loading States**: Visual feedback for all operations
- 🚨 **Error Handling**: User-friendly error messages

## Tech Stack

- **React 19** with TypeScript
- **Ant Design** for UI components
- **Axios** for API communication
- **Vite** for build tooling
- **Tailwind CSS** for styling

## Prerequisites

- Node.js 18+ and npm
- Task Management API running (see API Requirements below)

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-management-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```
   
   Replace the URL with your actual API base URL.

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:8080` to view the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Requirements

The application expects a REST API with the following endpoints:

### Get Tasks
```
GET /tasks
GET /tasks?name=<search_term>
```
Response: Array of task objects

### Create Task
```
PUT /tasks
Content-Type: application/json

{
  "name": "Task Name",
  "command": "npm test", 
  "description": "Optional description"
}
```
Response: Created task object

### Delete Task
```
DELETE /tasks/:id
```
Response: 204 No Content

### Execute Task
```
PUT /tasks/:id/execution
```
Response: 
```json
{
  "output": "Command output text",
  "exitCode": 0,
  "executedAt": "2023-12-01T10:00:00Z"
}
```

### Task Object Structure
```typescript
interface Task {
  id: string;
  name: string;
  command: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Project Structure

```
src/
├── components/           # React components
│   ├── TaskForm.tsx     # Task creation form
│   └── TaskList.tsx     # Task list and management
├── services/            # API services
│   └── api.ts          # Axios configuration and API calls
├── pages/              # Page components
│   └── Index.tsx       # Main application page
└── ...
```

## Key Features Explained

### Task Management Table
- Displays all tasks with name, command, description, and creation date
- Sortable columns and pagination
- Search functionality with debounced input
- Action buttons for execute and delete operations

### Task Creation Form
- Validates input fields (required fields, length limits)
- Real-time character counting
- Auto-resets after successful creation
- Displays success/error messages

### Task Execution
- Executes task commands via API
- Shows loading state during execution
- Displays results in a modal with:
  - Exit code (with color coding for success/failure)
  - Execution timestamp
  - Command output in terminal-style format

### Error Handling
- Network request failures
- API validation errors
- Loading states for all operations
- User-friendly error messages

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Base URL for the task management API | `http://localhost:3000/api` |

## Development

1. **Code Style**: Uses ESLint and TypeScript strict mode
2. **Components**: Functional components with React hooks
3. **State Management**: React hooks (useState, useEffect, useCallback)
4. **API Layer**: Centralized in `services/api.ts` with proper TypeScript interfaces
5. **Styling**: Ant Design components with Tailwind CSS utilities

## Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.