package com.proyecto_9.todo_api.repository;

import com.proyecto_9.todo_api.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    // Aquí Spring Data JPA implementa todos los métodos CRUD automáticamente

    // En TaskRepository.java
    List<Task> findByUserId(Long userId);

}

