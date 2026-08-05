# 04 - Modelo de Dados e Entidades Principais

## 1. Entidades do Sistema

### User (Profissional / Psicólogo)
- `id`: UUID (Chave Primária)
- `nome`: Texto
- `email`: Texto (Único)
- `crp`: Texto
- `created_at`: Data e Hora

### Patient (Paciente)
- `id`: UUID (Chave Primária)
- `user_id`: UUID (Chave Estrangeira -> User)
- `nome_identificado`: Texto (Encriptado)
- `data_nascimento`: Data
- `observacoes`: Texto
- `created_at`: Data e Hora

### Session (Sessão / Registro)
- `id`: UUID (Chave Primária)
- `patient_id`: UUID (Chave Estrangeira -> Patient)
- `data_sessao`: Data e Hora
- `notas_sessao`: Texto
- `sintese_ia`: Texto
- `created_at`: Data e Hora

### Formulation (Formulação / Conceituação de Caso)
- `id`: UUID (Chave Primária)
- `patient_id`: UUID (Chave Estrangeira -> Patient)
- `abordagem`: Texto (Ex: ACT, FAP, ABA, DBT)
- `hipoteses_funcionais`: Texto / JSON
- `metas_terapeuticas`: Texto / JSON
- `updated_at`: Data e Hora