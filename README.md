# ⚡ API Gateway & Billing Service

Un sistema de **API Gateway y Gestión de Monetización** para servicios web y microservicios. Permite a los desarrolladores registrarse, gestionar sus credenciales de API mediante hashing seguro, recargar créditos de uso y consumir endpoints protegidos con control de concurrencia y límites de tasa (*rate limiting*).

---

## 🎯 Propósito del Proyecto

El objetivo principal de esta aplicación es demostrar patrones clave de **Ingeniería de Software e Infraestructura**:

- **Arquitectura Proxy/Gateway:** Intercepción de tráfico HTTP para autenticación, autorización y medición de cuotas antes de llegar a la lógica de negocio final.
- **Seguridad Criptográfica:** Manejo seguro de credenciales con hashing unidireccional (SHA-256) para API Keys y firmas digitales con JWT para el panel de administración.
- **Transacciones e Idempotencia:** Procesamiento atómico de saldo de créditos y consumo de APIs evitando condiciones de carrera (*race conditions*).

---

## 🛠️ Stack Tecnológico

### **Backend & Infraestructura**
- **Runtime:** Node.js (v24+)
- **Framework:** Express.js con TypeScript (`tsx`)
- **Base de Datos:** MongoDB (Mongoose ORM)
- **Caché / Rate Limit:** Redis
- **Autenticación:** JWT (JSON Web Tokens) & Bcrypt

### **Frontend**
- **Librería:** React 19 + TypeScript (Vite)
- **Enrutamiento y HTTP:** React Router, Axios

---

## 🏛️ Arquitectura del Sistema

El servidor se compone de dos zonas operativas claramente separadas:

```text
[ CLIENTE / DEVELOPER ]
       |
       +---> (1) Panel Web (JWT Auth) ----------> [ Auth & Key Management API ]
       |                                                    |
       |                                          Genera Claves & Administra Saldo
       |                                                    |
       +---> (2) Consumo de API (X-API-Key) ------> [ API Gateway Middleware ]
                                                            |
                                             a. Hash & Validar API Key (DB)
                                             b. Verificar Rate Limit (Redis)
                                             c. Descontar Créditos (Operación Atómica)
                                                            |
                                                            v
                                                  [ Servicio Destino ]
```

---

## 💻 Instalación y Configuración Local

### Prerrequisitos
- Docker & Docker Compose
- Node.js (v20+)

### 1. Clonar el repositorio y levantar servicios
```Bash
git clone https://github.com/G4ballay/api-gateway-billing.git
cd api-gateway-billing

#Iniciar MongoDB y Redis en contenedores
docker compose up -d
```
### 2. Configurar y levantar el Backend
```Bash
cd backend
npm install
cp .env.example .env
#Configurar parametros en .env
npm run dev
```
### 3. Configurar y levantar el Frontend
```Bash
cd ../frontend
npm install
npm run dev
```
---

## 📂 Estructura del Monorepo
```text
api-gateway-billing/
├── backend/
│   ├── src/
│   │   ├── controllers/   # Controladores para Auth, Keys y Pagos
│   │   ├── middlewares/   # Middleware del Gateway & Validación
│   │   ├── models/        # Esquemas de Mongoose (User, ApiKey, Transaction)
│   │   ├── routes/        # Definición de endpoints HTTP
│   │   └── utils/         # Helpers de JWT, Criptografía y Generadores
│   └── tsconfig.json
├── frontend/              # Panel de usuario en React
└── docker-compose.yml     # Infraestructura para MongoDB y Redis
```
