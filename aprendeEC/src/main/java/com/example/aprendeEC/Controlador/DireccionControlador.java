package com.example.aprendeEC.Controlador;


import com.example.aprendeEC.Modelo.Direccion;
import com.example.aprendeEC.Modelo.Usuario;
import com.example.aprendeEC.Repositorio.DireccionRepositorio;
import com.example.aprendeEC.Repositorio.UsuarioRepositorio;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/me/compras/direcciones")
@CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class DireccionControlador {

    @Autowired
    DireccionRepositorio direccionRepo;

    @GetMapping
    public Iterable<Direccion> getAll(){
        return direccionRepo.findAll();
    }

    @GetMapping ("/{id}")
    public Direccion getById(@PathVariable(value="id") String id){
        return direccionRepo.findById(String.valueOf(id))
                .orElseGet(() -> {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Direccion no encontrada");
                });
    }

    @PostMapping
    public Direccion addDireccion(@RequestBody Direccion direccion){
        return direccionRepo.save(direccion);
    }

    @PutMapping
    public Direccion update(@RequestBody Direccion direccion){
        return direccionRepo.save(direccion);
    }


    @DeleteMapping("/{id}")
    public void borrar (@PathVariable(value="id") String id){
        if(direccionRepo.findById(String.valueOf(id)).isPresent()){
            direccionRepo.delete( direccionRepo.findById( String.valueOf(id)).get());
        }else{
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Persona no encontrada");
        }
    }

}
