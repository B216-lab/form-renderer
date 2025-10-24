# Сервис отображения форм
В то же время сразу для удобства содержит [Apache Superset](./apache-superset-project/) 

- [VueForm documentation](https://vueform.com/docs/installation)
- [Vueform Builder](https://builder.vueform.com/)

- [Legacy form](https://survey.b216.ru/questionnaire)


Restore legacy DB. Just to observe and get familiar with. Will be removed soon:
```bash
docker compose up -d

PGPASSWORD=superpassword psql       -U postgres -d postgres -h localhost -p 3005 -c "CREATE DATABASE umrs;"
PGPASSWORD=superpassword pg_restore -U postgres -d umrs     -h localhost -p 3005 --clean --if-exists -v /path/to/dump/info.dump
```


Run superset:
```bash
cd apache-superset-project

docker compose up -d --build
```

- Don't use direct connection between front-end and back-end using these sweet "database security rules" or that kind of stuff, because of CVE-2024-45489 and increasing complexity of supporting these rules as DB's schema is growing ([look](https://youtu.be/2zcN2aQsUdc?si=80NfsuOA2KI770CH))


# Почему не supabase

- Supabase - это fauxpen source на самом деле в какой-то незначительной (зависит от случая) мере.
- В ошибках, в репозиториях этого Supabase, можно найти немало недовольных политикой работы с open source community 
- Supabase обновляется регулярно, не сильно обращая внимания на документирование для self-hosted, а его инфраструктура не самая простая и поддерживать её, конфигурировать или справляться с появляющимися по тем или иным причинам ошибками - сложная задача, подсильная или прям нормальным специалистм, или разработчикам supabase (субъективно)
- Немало неприятных ограничений в self-hosted версии. Самым критичным является запрет создания более одного проекта в одном instance'е Supabase, но помимо этого, там ещё хватает неудобств разного рода.
