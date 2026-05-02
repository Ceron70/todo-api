package com.proyecto_9.todo_api.controller;

import com.proyecto_9.todo_api.dto.TaskDTO;
import com.proyecto_9.todo_api.model.Task;
import com.proyecto_9.todo_api.model.User;
import com.proyecto_9.todo_api.service.TaskService;
import com.proyecto_9.todo_api.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/tasks-view")
public class TaskViewController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserService userService;

    // Mostrar listado de tareas y formulario
    @GetMapping("/list")
    public String listTasks(Model model) {
        List<Task> tasks = taskService.getAllTasks();
        List<User> users = userService.getAllUsers();
        model.addAttribute("tasks", tasks);
        model.addAttribute("users", users);
        model.addAttribute("newTask", new TaskDTO());
        return "task-list";
    }

    // Crear una tarea desde el formulario
    @PostMapping("/create")
    public String createTask(@Valid @ModelAttribute("newTask") TaskDTO taskDTO,
                             BindingResult result,
                             Model model) {
        if (result.hasErrors()) {
            // Si hay errores de validación, recargar la lista y mostrar el formulario con errores
            model.addAttribute("tasks", taskService.getAllTasks());
            model.addAttribute("users", userService.getAllUsers());
            return "task-list";
        }
        // Convertir DTO a entidad (sin usuario aún)
        Task task = convertToEntity(taskDTO);
        Long userId = taskDTO.getUserId();
        if (userId != null) {
            taskService.createTask(task, userId);
        } else {
            // Si no viene userId, podrías lanzar un error o asignar por defecto
            throw new RuntimeException("El ID de usuario es obligatorio");
        }
        return "redirect:/tasks-view/list";
    }

    // Marcar tarea como completada o pendiente (toggle)
    @GetMapping("/toggle/{id}")
    public String toggleTask(@PathVariable Long id) {
        Task task = taskService.getTaskById(id)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada con id: " + id));
        task.setCompleted(!task.isCompleted());
        taskService.updateTask(id, task);
        return "redirect:/tasks-view/list";
    }

    // Eliminar tarea
    @GetMapping("/delete/{id}")
    public String deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return "redirect:/tasks-view/list";
    }

    // Método auxiliar para convertir TaskDTO -> Task (sin usuario porque se asigna en el servicio)
    private Task convertToEntity(TaskDTO dto) {
        Task task = new Task();
        task.setId(dto.getId());
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setCompleted(dto.isCompleted());
        // No se asigna usuario aquí; se hará en el servicio con el userId del DTO
        return task;
    }
}