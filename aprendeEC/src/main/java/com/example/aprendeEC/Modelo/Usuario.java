package com.example.aprendeEC.Modelo;


import java.util.UUID;

import javax.persistence.*;

@Entity
@Table (name="usuario")
public class Usuario {

    @Id
    @Column (name="usuario_id")
    private String id;
    @Column (name="usuario_username")
    private String username;
    @Column (name="usuario_contrasena")
    private String contrasena;
    @Column (name="usuario_nombre")
    private String nombre;
    @Column (name="usuario_mail")
    private String mail;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }
}
