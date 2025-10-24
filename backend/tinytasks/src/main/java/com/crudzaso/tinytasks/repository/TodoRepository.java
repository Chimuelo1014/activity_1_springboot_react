package com.crudzaso.tinytasks.repository;

import com.crudzaso.tinytasks.model.Todo;
import java.util.*;

public class TodoRepository {
    private final Map<Long, Todo> todos = new HashMap<>();
    private long nextId = 1L;

    public List<Todo> findAll() {
        return new ArrayList<>(todos.values());
    }

    public Optional<Todo> findById(Long id) {
        return Optional.ofNullable(todos.get(id));
    }

    public Todo save(String title) {
        Todo todo = new Todo(nextId++, title);
        todos.put(todo.getId(), todo);
        return todo;
    }

    public boolean delete(Long id) {
        return todos.remove(id) != null;
    }
}
