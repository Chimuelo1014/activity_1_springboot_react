package com.crudzaso.tinytasks.service;

import com.crudzaso.tinytasks.model.Todo;
import com.crudzaso.tinytasks.repository.TodoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TodoService {
    private final TodoRepository repository = new TodoRepository();

    public List<Todo> getAll() {
        return repository.findAll();
    }

    public Todo create(String title) {
        if (title == null || title.trim().length() < 3) {
            throw new IllegalArgumentException("Title is required and must be at least 3 characters");
        }
        return repository.save(title);
    }

    public Optional<Todo> toggle(Long id) {
        Optional<Todo> opt = repository.findById(id);
        opt.ifPresent(todo -> todo.setDone(!todo.isDone()));
        return opt;
    }

    public boolean delete(Long id) {
        return repository.delete(id);
    }
}
