package com.example.aprendeEC.Controlador;


import com.example.aprendeEC.Modelo.Usuario;
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

import java.util.UUID;

@RestController
@RequestMapping("/me")
@CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class UsuarioControlador {

    @Autowired
    UsuarioRepositorio usuarioRepo;

    @GetMapping
    public Iterable<Usuario> getAll(){
        return usuarioRepo.findAll();
    }

    @GetMapping ("/{id}")
    public Usuario getById(@PathVariable(value="id") String id){
        return usuarioRepo.findById(String.valueOf(id))
                .orElseGet(() -> {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Persona no encontrada");
                } );
    }

    @PostMapping
    public Usuario addUsuario(@RequestBody Usuario usuario){
        return usuarioRepo.save(usuario);
    }

    @PutMapping
    public Usuario update(@RequestBody Usuario usuario){
        return usuarioRepo.save(usuario);
    }


    @DeleteMapping ("/{id}")
    public void borrar (@PathVariable(value="id") String id){
        if(usuarioRepo.findById(String.valueOf(id)).isPresent()){
            usuarioRepo.delete( usuarioRepo.findById( String.valueOf(id)).get());
        }else{
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Persona no encontrada");
        }
    }



}
