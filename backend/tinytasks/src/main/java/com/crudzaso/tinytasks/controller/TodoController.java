package com.crudzaso.tinytasks.controller;

import com.crudzaso.tinytasks.model.Todo;
import com.crudzaso.tinytasks.service.TodoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "http://localhost:5500")
public class TodoController {
    private final TodoService service = new TodoService();

    @GetMapping
    public List<Todo> getAll() {
        return service.getAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, String> body) {
        try {
            String title = body.get("title");
            Todo created = service.create(title);
            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<?> toggle(@PathVariable Long id) {
        return service.toggle(id)
                .<ResponseEntity<?>>map(todo -> ResponseEntity.ok(todo))
                .orElse(ResponseEntity.status(404).body(Map.of("error", "Not found")));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (service.delete(id)) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(404).body(Map.of("error", "Not found"));
        }
    }
}
