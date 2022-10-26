import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Config} from '../config/config';
import {Usuario} from '../models';
import {UsuarioRepository} from '../repositories';
const jwt = require("jsonwebtoken");

@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository
  ) { }

  IdentificarPersona(usuario: string, password: string) {
    try {
      let u = this.usuarioRepository.findOne({
        where: {
          "or": [{usuario: usuario, password: password}, {correo: usuario, password: password}]
        }
      });
      if (u) {
        return u;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  GenerarTokenJWT(usuario: Usuario) {
    let token = jwt.sign({
      data: {
        id: usuario.id,
        usuario: usuario.usuario,
        correo: usuario.correo,
        rol: usuario.rol,
        estado: usuario.estado
      }
    },
      Config.claveJWT);
    return token;
  }

  ValidarTokenJWT(token: string) {
    try {
      let datos = jwt.verify(token, Config.claveJWT);
      return datos;
    } catch (error) {
      return false;
    }
  }
}
