import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8081/api/todos';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setTodos(data);
      setError('');
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (e) => {
    e.preventDefault();
    if (title.trim().length < 3) {
      setError('Title must be at least 3 characters');
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() })
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Failed to create task');
        return;
      }

      const newTodo = await res.json();
      setTodos([...todos, newTodo]);
      setTitle('');
      setError('');
    } catch (err) {
      setError('Network error');
    }
  };

  const toggleTodo = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}/toggle`, {
        method: 'PUT'
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Failed to toggle task');
        return;
      }

      const updated = await res.json();
      setTodos(todos.map(t => t.id === id ? updated : t));
      setError('');
    } catch (err) {
      setError('Network error');
    }
  };

  const deleteTodo = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Failed to delete task');
        return;
      }

      setTodos(todos.filter(t => t.id !== id));
      setError('');
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
            🚀 TinyTasks
          </h1>
          <p className="text-gray-400">Crudzaso Microapplication</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <span>{error}</span>
            <button 
              onClick={() => setError('')}
              className="ml-auto text-red-200 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Create Form */}
        <form onSubmit={createTodo} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-2xl mb-6 border border-white/20">
          <div className="flex gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a new task..."
              className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold px-6 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Add Task
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-2">Minimum 3 characters required</p>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-400 border-t-transparent"></div>
            <p className="text-gray-400 mt-4">Loading tasks...</p>
          </div>
        )}

        {/* Tasks List */}
        {!loading && todos.length === 0 && (
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-12 text-center border border-white/10">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-400 text-lg">No tasks yet. Add your first one!</p>
          </div>
        )}

        <div className="space-y-3">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-white/20 flex items-center gap-4 group hover:bg-white/15 transition-all"
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                  todo.done 
                    ? 'bg-cyan-500 border-cyan-500' 
                    : 'border-white/30 hover:border-cyan-400'
                }`}
              >
                {todo.done && <span className="text-white text-sm">✓</span>}
              </button>

              {/* Title */}
              <span className={`flex-1 text-lg ${
                todo.done 
                  ? 'text-gray-500 line-through' 
                  : 'text-white'
              }`}>
                {todo.title}
              </span>

              {/* Status Badge */}
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                todo.done 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                  : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
              }`}>
                {todo.done ? 'Done' : 'Pending'}
              </span>

              {/* Delete Button */}
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/20 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                title="Delete task"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Stats Footer */}
        {todos.length > 0 && (
          <div className="mt-6 bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 flex justify-around text-center">
            <div>
              <p className="text-2xl font-bold text-cyan-400">{todos.length}</p>
              <p className="text-gray-400 text-sm">Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">{todos.filter(t => t.done).length}</p>
              <p className="text-gray-400 text-sm">Done</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-400">{todos.filter(t => !t.done).length}</p>
              <p className="text-gray-400 text-sm">Pending</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}