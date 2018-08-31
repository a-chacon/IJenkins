# jint README

Extension para visual studio code con la cual puedes construir proyectos de jenkins
con comandos en visual code.

## Install 

Search on the extensions on visual studio code.

## use

Configurar de forma correcta la URL (ej: 'http://www.mijenkins.com:8080') comando:

    'Change jenkins url'

Configurar tu cuenta mediante el comando 'configure jenkins account'.

Ejecutar el comando 'Excecute jenkins job' y continua con el flujo.

obs:
    Para configurar de forma permanente una url de jenkins debes ingresar a :

    Windows %USERPROFILE%\.vscode\extensions
    macOS ~/.vscode/extensions
    Linux ~/.vscode/extensions

    Buscar la carpeta de la extension y editar el archivo:
        /out/extension.js

        Agregar el valor con la url de jenkins a 'VAR URL', guardar y salir.

        Importante:
            La url debe cumplir el formato de ejemplo de forma correcta.

### 1.0.0

Primera version con funciones principales.

### 1.0.2

Correcion de estructura de url (sin slash final).

Mas tiempo de espera para obtener la respuesta del trabajo recien ejecutado, sino tomaba el penultimo trabajo ejecutado.

Automatizado paso de configurar url a credenciales.

-----------------------------------------------------------------------------------------------------------

### contributors

https://github.com/Taurus95/IJenkins.git

if you want to help look the repository!

Por hacer:

- comprobar y ejecutar trabajos con parametros

**Enjoy!**
