# Сервис отображения форм


- [VueForm documentation](https://vueform.com/docs/installation)
- [Vueform Builder](https://builder.vueform.com/)

- [Legacy form](https://survey.b216.ru/questionnaire)


Restore legacy DB. Just to observe and get familiar with. Will be removed soon:
```bash
docker compose up -d

PGPASSWORD=superpassword psql       -U postgres -d postgres -h localhost -p 3005 -c "CREATE DATABASE umrs;"
PGPASSWORD=superpassword pg_restore -U postgres -d umrs     -h localhost -p 3005 --clean --if-exists -v /path/to/dump/info.dump
```

Run supabase:
```bash
cd supabase-project

docker compose pull
docker compose up -d
```
