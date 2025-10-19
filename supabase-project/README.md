# Supabase Docker
Supabase - это fauxpen source на самом деле в какой-то незначительной (зависит от случая) мере, поэтому, очень вероятно, надо будет от него избавляться, переходя
на что-то написанное вручную, но на данный момент supabase - достаточное решение, которое "пойдёт".

- [Supabase hosting docs](https://supabase.com/docs/guides/hosting/docker)

- Dependant services are updated ~monthly. Updating should be performed frequently to get the latest features and bug fixes and security patches
- Don't use direct connection between front-end and back-end using these sweet "database security rules" or that kind of stuff, because of CVE-2024-45489 and 
increasing complexity of supporting these rules as DB's schema is growing ([look](https://youtu.be/2zcN2aQsUdc?si=80NfsuOA2KI770CH))
- [Change Supabase database to to UTC timezone](https://supabase.com/docs/guides/database/postgres/configuration#managing-timezones)
```sql
ALTER DATABASE postgres SET TimeZone TO 'UTC';
```
