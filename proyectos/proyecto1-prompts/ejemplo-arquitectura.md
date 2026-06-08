# Confluence Space: PEUAS100
## HU PEUAS100-882 - Integración Freight Forwarders Inbound

Este documento detalla la integración con los Freight Forwarders externos (ExternalProvider y ExternalPartner) para la recepción de solicitudes y camiones.

### Arquitectura Técnica
La integración se realiza a través de un servicio intermedio llamado `MockConnectorService` alojado en el servidor de QA: `192.168.100.12`.

### Configuración de Endpoints
Los endpoints de los servicios externos de ExternalProvider se consumen desde el componente `ExternalProviderClient` y están configurados en dos posibles lugares dependiendo del ambiente:

1.  **Ambiente de QA (Servidor 192.168.100.12)**:
    - Se configuran en la base de datos `MockBillingDB` (SQL Server en `192.168.100.20`), en la tabla `ParametrosSistema`.
    - Campos a actualizar:
      - `ParametroKey = 'EXTPROVIDER_API_CAMION_URL'`
      - `ParametroKey = 'EXTPROVIDER_API_SOLICITUDES_URL'`
    - Query de ejemplo para verificar valor actual:
      ```sql
      SELECT ParametroKey, ParametroValue FROM ParametrosSistema WHERE ParametroKey LIKE 'EXTPROVIDER_%';
      ```

2.  **Ambiente de Producción**:
    - Se configuran en el archivo de configuración local del servicio: `C:\Services\MockConnector\appsettings.json` en las llaves:
      - `"ExternalProvider": { "CamionApiUrl": "...", "SolicitudesApiUrl": "..." }`

### Procesos de Despliegue y Recarga
*   **Si el cambio se hace en Base de Datos (QA)**:
    - Es necesario recargar el caché del servicio. Para ello, realiza una petición POST de healthcheck al endpoint de administración: `http://192.168.100.12:8080/api/admin/reload-config`.
*   **Si el cambio se hace en appsettings.json**:
    - Se debe reiniciar el servicio de Windows ejecutando:
      ```cmd
      net stop MockConnectorService
      net start MockConnectorService
      ```
