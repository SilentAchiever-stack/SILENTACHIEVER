// TaskFlow Todo List JavaScript
class TaskFlow {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('taskflow-tasks')) || [];
        this.currentFilter = 'all';
        this.currentSort = 'newest';
        this.editingTaskId = null;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderTasks();
        this.updateStats();
        this.updateProgress();
    }

    setupEventListeners() {
        // Task form submission
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Sort dropdown
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.setSortOrder(e.target.value);
        });

        // Clear completed button
        document.getElementById('clearCompleted').addEventListener('click', () => {
            this.clearCompleted();
        });

        // Modal controls
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('cancelEdit').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('editForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEdit();
        });

        // Close modal when clicking outside
        document.getElementById('editModal').addEventListener('click', (e) => {
            if (e.target.id === 'editModal') {
                this.closeModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    addTask() {
        const taskInput = document.getElementById('taskInput');
        const prioritySelect = document.getElementById('prioritySelect');
        const categorySelect = document.getElementById('categorySelect');

        const taskText = taskInput.value.trim();
        if (!taskText) return;

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false,
            priority: prioritySelect.value,
            category: categorySelect.value,
            createdAt: new Date().toISOString(),
            completedAt: null
        };

        this.tasks.unshift(newTask);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.updateProgress();

        // Reset form
        taskInput.value = '';
        prioritySelect.value = 'medium';
        categorySelect.value = 'personal';

        // Show success toast
        this.showToast('Task added successfully!', 'success');

        // Focus back to input
        taskInput.focus();
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null;

        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.updateProgress();

        const message = task.completed ? 'Task completed!' : 'Task marked as pending';
        const type = task.completed ? 'success' : 'info';
        this.showToast(message, type);
    }

    deleteTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.updateProgress();
            this.showToast('Task deleted successfully!', 'error');
        }
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        this.editingTaskId = taskId;

        // Populate edit form
        document.getElementById('editTaskText').value = task.text;
        document.getElementById('editPriority').value = task.priority;
        document.getElementById('editCategory').value = task.category;

        // Show modal
        document.getElementById('editModal').classList.add('show');
    }

    saveEdit() {
        if (!this.editingTaskId) return;

        const task = this.tasks.find(t => t.id === this.editingTaskId);
        if (!task) return;

        const newText = document.getElementById('editTaskText').value.trim();
        if (!newText) return;

        task.text = newText;
        task.priority = document.getElementById('editPriority').value;
        task.category = document.getElementById('editCategory').value;

        this.saveTasks();
        this.renderTasks();
        this.closeModal();
        this.showToast('Task updated successfully!', 'success');
    }

    closeModal() {
        document.getElementById('editModal').classList.remove('show');
        this.editingTaskId = null;
    }

    setFilter(filter) {
        this.currentFilter = filter;

        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

        this.renderTasks();
    }

    setSortOrder(sortOrder) {
        this.currentSort = sortOrder;
        this.renderTasks();
    }

    clearCompleted() {
        const completedTasks = this.tasks.filter(task => task.completed);
        if (completedTasks.length === 0) {
            this.showToast('No completed tasks to clear', 'info');
            return;
        }

        if (confirm(`Are you sure you want to delete ${completedTasks.length} completed task(s)?`)) {
            this.tasks = this.tasks.filter(task => !task.completed);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.updateProgress();
            this.showToast(`${completedTasks.length} completed task(s) deleted!`, 'success');
        }
    }

    getFilteredTasks() {
        let filteredTasks = [...this.tasks];

        // Apply filter
        switch (this.currentFilter) {
            case 'pending':
                filteredTasks = filteredTasks.filter(task => !task.completed);
                break;
            case 'completed':
                filteredTasks = filteredTasks.filter(task => task.completed);
                break;
            // 'all' shows all tasks
        }

        // Apply sort
        switch (this.currentSort) {
            case 'oldest':
                filteredTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'priority':
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                filteredTasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
                break;
            case 'category':
                filteredTasks.sort((a, b) => a.category.localeCompare(b.category));
                break;
            case 'alphabetical':
                filteredTasks.sort((a, b) => a.text.localeCompare(b.text));
                break;
            case 'newest':
            default:
                filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
        }

        return filteredTasks;
    }

    renderTasks() {
        const tasksList = document.getElementById('tasksList');
        const emptyState = document.getElementById('emptyState');
        const filteredTasks = this.getFilteredTasks();

        if (filteredTasks.length === 0) {
            tasksList.innerHTML = '';
            emptyState.classList.add('show');
            return;
        }

        emptyState.classList.remove('show');

        tasksList.innerHTML = filteredTasks.map(task => this.createTaskHTML(task)).join('');

        // Add event listeners to task elements
        filteredTasks.forEach(task => {
            const taskElement = document.querySelector(`[data-task-id="${task.id}"]`);

            // Checkbox toggle
            const checkbox = taskElement.querySelector('.task-checkbox');
            checkbox.addEventListener('click', () => this.toggleTask(task.id));

            // Edit button
            const editBtn = taskElement.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => this.editTask(task.id));

            // Delete button
            const deleteBtn = taskElement.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => this.deleteTask(task.id));
        });
    }

    createTaskHTML(task) {
        const createdDate = new Date(task.createdAt).toLocaleDateString();
        const createdTime = new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                <div class="task-content">
                    <div class="task-checkbox ${task.completed ? 'checked' : ''}">
                        ${task.completed ? '<i class="fas fa-check"></i>' : ''}
                    </div>
                    <div class="task-info">
                        <div class="task-text">${this.escapeHtml(task.text)}</div>
                        <div class="task-meta">
                            <span class="task-priority ${task.priority}">${task.priority}</span>
                            <span class="task-category">${task.category}</span>
                            <span class="task-date">${createdDate} at ${createdTime}</span>
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="task-action-btn edit-btn" title="Edit task">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="task-action-btn delete-btn delete" title="Delete task">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    updateStats() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(task => task.completed).length;
        const pendingTasks = totalTasks - completedTasks;

        document.getElementById('totalTasks').textContent = totalTasks;
        document.getElementById('completedTasks').textContent = completedTasks;
        document.getElementById('pendingTasks').textContent = pendingTasks;
    }

    updateProgress() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(task => task.completed).length;
        const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');

        progressFill.style.width = `${progressPercentage}%`;
        progressText.textContent = `${progressPercentage}% Complete`;
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        const toastIcon = toast.querySelector('i');

        // Set message
        toastMessage.textContent = message;

        // Set icon based on type
        toastIcon.className = type === 'success' ? 'fas fa-check-circle' :
            type === 'error' ? 'fas fa-exclamation-circle' :
                type === 'info' ? 'fas fa-info-circle' :
                    'fas fa-check-circle';

        // Set color based on type
        toast.style.background = type === 'success' ? 'linear-gradient(135deg, #2ed573, #20bf6b)' :
            type === 'error' ? 'linear-gradient(135deg, #ff4757, #ff3742)' :
                type === 'info' ? 'linear-gradient(135deg, #3742fa, #2f3542)' :
                    'linear-gradient(135deg, #2ed573, #20bf6b)';

        // Show toast
        toast.classList.add('show');

        // Hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    saveTasks() {
        localStorage.setItem('taskflow-tasks', JSON.stringify(this.tasks));
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app
const taskFlow = new TaskFlow();

// Add some demo functionality
document.addEventListener('DOMContentLoaded', () => {
    // Focus on task input when page loads
    document.getElementById('taskInput').focus();

    // Add keyboard shortcut for quick add (Ctrl/Cmd + Enter)
    document.getElementById('taskInput').addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('taskForm').dispatchEvent(new Event('submit'));
        }
    });

    // Add sample tasks if none exist
    if (taskFlow.tasks.length === 0) {
        const sampleTasks = [
            {
                id: Date.now() - 3,
                text: "Welcome to TaskFlow! Edit or delete this task to get started.",
                completed: false,
                priority: "medium",
                category: "personal",
                createdAt: new Date().toISOString(),
                completedAt: null
            },
            {
                id: Date.now() - 2,
                text: "Try adding your first real task using the form above",
                completed: false,
                priority: "high",
                category: "personal",
                createdAt: new Date(Date.now() - 60000).toISOString(),
                completedAt: null
            },
            {
                id: Date.now() - 1,
                text: "Click this checkbox to mark a task as completed",
                completed: true,
                priority: "low",
                category: "other",
                createdAt: new Date(Date.now() - 120000).toISOString(),
                completedAt: new Date(Date.now() - 30000).toISOString()
            }
        ];

        taskFlow.tasks = sampleTasks;
        taskFlow.saveTasks();
        taskFlow.renderTasks();
        taskFlow.updateStats();
        taskFlow.updateProgress();
    }
});