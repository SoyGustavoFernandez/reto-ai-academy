# Reporte Consolidado de Copiloto de Soporte 🤖

## 1. Ficha Técnica de la Aplicación (Paso 1)

Aquí tienes la Ficha Técnica de Operación estandarizada y compacta para el sistema:

---
# Ficha Técnica de Operación

## 1. Identificación de la App
*   **Nombre del sistema**: Integración Freight Forwarders Inbound (PEUAS100)
*   **Componente principal**: `MockConnectorService`
*   **Cliente**: Interno (para la integración con proveedores externos)

## 2. Componentes Clave
*   **Servicios/APIs**:
    *   `MockConnectorService` (Servicio de Windows)
    *   Endpoint de Administración (QA): `http://192.168.100.12:8080/api/admin/reload-config` (POST, para recarga de configuración en caché).
*   **Puertos**:
    *   `8080` (para el endpoint de administración en QA)
*   **Tecnologías**:
    *   Servicio de Windows
    *   SQL Server (usado para configuración en QA)

## 3. Bases de Datos y Accesos
*   **Servidor DB (QA para configuración)**: `192.168.100.20` (SQL Server)
*   **Base de Datos (QA)**: `MockBillingDB`
*   **Tabla principal (QA para configuración)**: `ParametrosSistema`
    *   **Parámetros críticos**: `EXTPROVIDER_API_CAMION_URL`, `EXTPROVIDER_API_SOLICITUDES_URL`
    *   **Query para verificar valores (QA)**:
        ```sql
        SELECT ParametroKey, ParametroValue FROM ParametrosSistema WHERE ParametroKey LIKE 'EXTPROVIDER_%';
        ```

## 4. Flujos de Integración
*   **Este sistema (`MockConnectorService`)**:
    *   Interactúa con "Freight Forwarders externos" (ExternalProvider y ExternalPartner).
    *   Consume servicios externos de `ExternalProvider` para la "recepción de solicitudes y camiones".
    *   Los endpoints consumidos son configurables (ver sección 5).

## 5. Comandos y Rutas Críticas
*   **Rutas de Configuración de Endpoints Externos**:
    *   **Ambiente QA**: Base de datos `MockBillingDB` en `192.168.100.20`, tabla `ParametrosSistema`.
    *   **Ambiente Producción**: Archivo `C:\Services\MockConnector\appsettings.json` (llaves `"ExternalProvider": { "CamionApiUrl": "...", "SolicitudesApiUrl": "..." }`).
*   **Reiniciar Servicio (Producción - tras cambio en `appsettings.json`)**:
    ```cmd
    net stop MockConnectorService
    net start MockConnectorService
    ```
*   **Recargar Caché de Configuración (QA - tras cambio en DB)**:
    *   Realizar una petición `POST` al siguiente endpoint:
        `http://192.168.100.12:8080/api/admin/reload-config`
*   **Ubicación de Logs**: No especificado en la documentación proporcionada.

---

## 2. Diagnóstico Técnico y Validación (Paso 2)

Como Ingeniero DevOps y Soporte Nivel 3 experto, he revisado la "Ficha Técnica de Operación" del sistema `Integración Freight Forwarders Inbound (PEUAS100)` y el "Ticket de Jira PEUAS100-1048". A continuación, presento el análisis técnico y el plan de acción estructurado para el squad.

---

### 1. Clasificación del Ticket

*   **Tipo**: Solicitud de Cambio (Change Request)
*   **Justificación**: El ticket solicita una modificación específica de configuración (cambio de endpoints de integración), lo cual es una alteración planificada del comportamiento del sistema en un entorno específico, no un reporte de un fallo existente ni una consulta general.

### 2. Componentes y Configuración Afectados

La solicitud se enfoca en el ambiente de QA para los endpoints del `ExternalProvider`.

*   **Servicio principal**: `MockConnectorService`
*   **Base de Datos (QA)**: `MockBillingDB` en el servidor `192.168.100.20` (SQL Server)
    *   **Tabla**: `ParametrosSistema`
    *   **Parámetros críticos a modificar**:
        *   `EXTPROVIDER_API_CAMION_URL`
        *   `EXTPROVIDER_API_SOLICITUDES_URL`
*   **Endpoint de Administración (QA)**: `http://192.168.100.12:8080/api/admin/reload-config` (utilizado para recargar la configuración en caché del `MockConnectorService` tras los cambios en DB).

### 3. Plan de Acción y Validación Técnico

Este plan está diseñado para ser ejecutado en el ambiente de **QA**.

#### 3.1. Pasos de Ejecución

1.  **Preparación y Verificación Previa (QA)**
    *   **Conexión DB**: Conectarse al servidor SQL `192.168.100.20`, base de datos `MockBillingDB`.
    *   **Respaldo de Configuración Actual**: Ejecutar la siguiente consulta SQL para obtener los valores actuales de los parámetros y guardarlos como respaldo.
        ```sql
        USE MockBillingDB;
        GO
        SELECT ParametroKey, ParametroValue
        FROM ParametrosSistema
        WHERE ParametroKey IN ('EXTPROVIDER_API_CAMION_URL', 'EXTPROVIDER_API_SOLICITUDES_URL');
        ```
    *   **Verificación de Conectividad a Endpoints Nuevos (Opcional pero Recomendado)**: Antes de aplicar el cambio, se recomienda validar que los nuevos endpoints proporcionados por el ticket (`https://api.externalprovider-qa.com/...`) son accesibles desde el servidor donde reside `MockConnectorService` (asumiendo `192.168.100.12` por el endpoint de admin). Esto puede hacerse con un simple `curl` o similar, si la red lo permite, para descartar problemas de firewall o DNS.

2.  **Aplicación de Cambios en Base de Datos (QA)**
    *   **Descripción**: Actualizar los valores de los parámetros en la tabla `ParametrosSistema` con los nuevos endpoints del ticket.
    *   **Script SQL Sugerido**:
        ```sql
        USE MockBillingDB;
        GO

        -- Actualizar el endpoint para el servicio de camiones
        UPDATE ParametrosSistema
        SET ParametroValue = 'https://api.externalprovider-qa.com/services/operations/api/truck/integration/'
        WHERE ParametroKey = 'EXTPROVIDER_API_CAMION_URL';

        -- Actualizar el endpoint para el servicio de solicitudes
        UPDATE ParametrosSistema
        SET ParametroValue = 'https://api.externalprovider-qa.com/services/operations/api/requests/integration/'
        WHERE ParametroKey = 'EXTPROVIDER_API_SOLICITUDES_URL';

        -- Confirmar los cambios aplicados
        SELECT ParametroKey, ParametroValue
        FROM ParametrosSistema
        WHERE ParametroKey IN ('EXTPROVIDER_API_CAMION_URL', 'EXTPROVIDER_API_SOLICITUDES_URL');
        ```
    *   **Validación del Cambio en DB**: Asegurarse de que el `SELECT` final muestre los nuevos valores.

3.  **Recarga de Configuración en Caché del Servicio (QA)**
    *   **Descripción**: El `MockConnectorService` carga su configuración desde la base de datos al inicio o mediante un mecanismo de recarga. Para aplicar los cambios sin reiniciar el servicio, se debe invocar el endpoint de administración.
    *   **Acción**: Realizar una petición `POST` al endpoint de recarga.
    *   **Método (ej. cURL desde una máquina con acceso a la red de QA)**:
        ```bash
        curl -X POST http://192.168.100.12:8080/api/admin/reload-config
        ```
    *   **Validación de la Recarga**: La respuesta esperada debe ser un código HTTP `200 OK` o un mensaje indicando que la configuración ha sido recargada con éxito.

#### 3.2. Verificación y Validación Post-Cambio

1.  **Revisión de Logs del Servicio**
    *   **Ubicación de Logs**: Aunque la ficha técnica no especifica una ruta exacta, para un Servicio de Windows, los logs suelen encontrarse en:
        *   Visor de Eventos de Windows (Registro de Aplicaciones)
        *   Un directorio específico bajo `C:\Services\MockConnector\` (ej. `C:\Services\MockConnector\Logs\`)
        *   Un directorio bajo `C:\ProgramData\` (ej. `C:\ProgramData\MockConnector\Logs\`)
    *   **Acción**: Acceder al servidor donde corre el `MockConnectorService` (asumido `192.168.100.12`) y revisar los logs más recientes.
    *   **Palabras Clave a Buscar**:
        *   Para confirmar la recarga de configuración: "Configuration Reloaded", "Config updated", "Parameters loaded".
        *   Para identificar posibles errores de conexión a los nuevos endpoints: "Failed to connect", "Connection Refused", "Endpoint Error", "ExternalProvider", "API Call Failed".
        *   Verificar mensajes informativos sobre la inicialización de la conexión con los nuevos endpoints.

2.  **Validación Funcional (Pruebas de Integración)**
    *   **Acción**: Coordinar con el equipo de QA o el solicitante del ticket (`@Lider Soporte (UASL)`) para que ejecuten las pruebas de integración pertinentes que involucren los flujos de "recepción de solicitudes y camiones" de `ExternalProvider`.
    *   **Objetivo**: Confirmar que el `MockConnectorService` se comunica exitosamente con los **nuevos** endpoints de `ExternalProvider` en QA y que el proceso de integración se completa sin errores.

3.  **Monitoreo (Post-Implementación)**
    *   **Acción**: Mantener un monitoreo cercano del `MockConnectorService` y sus logs durante las primeras horas o días después del cambio para detectar cualquier anomalía o regresión inesperada.

---

## 3. Aviso Técnico para Teams (Paso 3)

```
SOPORTE Squad
@squad

**Nuevo Ticket de Cambio: PEUAS100-1048**

Se ha identificado una solicitud de cambio (CR) para la integración de "Freight Forwarders Inbound". El objetivo es actualizar los endpoints del `ExternalProvider` en el ambiente de **QA**.

**Componentes Afectados (Ambiente QA):**
*   **Servicio Principal:** `MockConnectorService`
*   **Base de Datos:** `MockBillingDB` en `192.168.100.20`
    *   **Tabla:** `ParametrosSistema`
    *   **Parámetros a modificar:** `EXTPROVIDER_API_CAMION_URL`, `EXTPROVIDER_API_SOLICITUDES_URL`
*   **Endpoint de Administración:** <a href="http://192.168.100.12:8080/api/admin/reload-config">http://192.168.100.12:8080/api/admin/reload-config</a>

**Plan de Acción y Validación Técnica (QA):**

**1. Pasos de Ejecución**

    *   **1.1. Preparación y Verificación Previa**
        *   Conectarse a SQL `192.168.100.20`, base de datos `MockBillingDB`.
        *   **Respaldo de Configuración Actual:**
            ```sql
            USE MockBillingDB;
            GO
            SELECT ParametroKey, ParametroValue
            FROM ParametrosSistema
            WHERE ParametroKey IN ('EXTPROVIDER_API_CAMION_URL', 'EXTPROVIDER_API_SOLICITUDES_URL');
            ```
        *   **Verificación de Conectividad (Recomendado):** Validar accesibilidad a los nuevos endpoints (<a href="https://api.externalprovider-qa.com/">https://api.externalprovider-qa.com/</a>) desde el servidor del `MockConnectorService` (`192.168.100.12`).

    *   **1.2. Aplicación de Cambios en Base de Datos**
        *   Actualizar `ParametrosSistema` con los nuevos endpoints.
        *   **Script SQL Sugerido:**
            ```sql
            USE MockBillingDB;
            GO

            UPDATE ParametrosSistema
            SET ParametroValue = 'https://api.externalprovider-qa.com/services/operations/api/truck/integration/'
            WHERE ParametroKey = 'EXTPROVIDER_API_CAMION_URL';

            UPDATE ParametrosSistema
            SET ParametroValue = 'https://api.externalprovider-qa.com/services/operations/api/requests/integration/'
            WHERE ParametroKey = 'EXTPROVIDER_API_SOLICITUDES_URL';

            SELECT ParametroKey, ParametroValue
            FROM ParametrosSistema
            WHERE ParametroKey IN ('EXTPROVIDER_API_CAMION_URL', 'EXTPROVIDER_API_SOLICITUDES_URL');
            ```
        *   Validar que el `SELECT` final muestre los nuevos valores.

    *   **1.3. Recarga de Configuración del Servicio**
        *   Invocar el endpoint de administración para recargar la configuración del `MockConnectorService`.
        *   **Método (ej. cURL):**
            ```bash
            curl -X POST http://192.168.100.12:8080/api/admin/reload-config
            ```
        *   Validar la respuesta HTTP `200 OK`.

**2. Verificación y Validación Post-Cambio**

    *   **2.1. Revisión de Logs del Servicio:**
        *   Acceder al servidor `192.168.100.12` y revisar logs (Visor de Eventos, `C:\Services\MockConnector\Logs\`, `C:\ProgramData\MockConnector\Logs\`).
        *   Buscar "Configuration Reloaded" o errores de conexión a los nuevos endpoints.
    *   **2.2. Validación Funcional (Pruebas de Integración):**
        *   Coordinar con el equipo de QA para ejecutar pruebas de integración que involucren los flujos afectados.
        *   Confirmar comunicación exitosa con los **nuevos** endpoints en QA.
    *   **2.3. Monitoreo (Post-Implementación):**
        *   Mantener monitoreo cercano de logs y rendimiento del servicio en las primeras horas/días.

**Enlace al Ticket Jira:** <a href="https://jira.company.com/browse/PEUAS100-1048">PEUAS100-1048</a>
```
