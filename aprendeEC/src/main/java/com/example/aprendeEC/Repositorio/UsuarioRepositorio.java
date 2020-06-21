package com.example.aprendeEC.Repositorio;

import com.example.aprendeEC.Modelo.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UsuarioRepositorio extends JpaRepository<Usuario, String>{
}
