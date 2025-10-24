package com.crudzaso.tinytasks.model;

public class Todo {
    private Long id;
    private String title;
    private boolean done;

    public Todo(Long id, String title) {
        this.id = id;
        this.title = title;
        this.done = false;
    }

    // Getters y setters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public boolean isDone() { return done; }
    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setDone(boolean done) { this.done = done; }
}
