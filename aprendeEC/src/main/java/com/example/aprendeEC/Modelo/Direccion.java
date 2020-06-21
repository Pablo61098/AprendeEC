package com.example.aprendeEC.Modelo;


import javax.persistence.*;

@Entity
@Table (name="direccion")
public class Direccion {


    @Id
    @Column (name="direccion_id")
    private String id;
    @Column (name="direccion_responsable")
    private String responsable;
    @Column (name="direccion_cedula")
    private String cedula;
    @Column (name="direccion_direccion")
    private String direccion;
    @Column (name="direccion_direccionDos")
    private String direccionDos;
    @Column (name="direccion_ciudad")
    private String Ciudad;
    @Column (name="direccion_provincia")
    private String provincia;
    @Column (name="direccion_Postal")
    private String codigoPostal;
    @Column (name="direccion_telefono")
    private String telefono;

    public String getResponsable() {
        return responsable;
    }

    public void setResponsable(String responsable) {
        this.responsable = responsable;
    }

    public String getCedula() {
        return cedula;
    }

    public void setCedula(String cedula) {
        this.cedula = cedula;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getDireccionDos() {
        return direccionDos;
    }

    public void setDireccionDos(String direccionDos) {
        this.direccionDos = direccionDos;
    }

    public String getCiudad() {
        return Ciudad;
    }

    public void setCiudad(String ciudad) {
        Ciudad = ciudad;
    }

    public String getProvincia() {
        return provincia;
    }

    public void setProvincia(String provincia) {
        this.provincia = provincia;
    }

    public String getCodigoPostal() {
        return codigoPostal;
    }

    public void setCodigoPostal(String codigoPostal) {
        this.codigoPostal = codigoPostal;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
}
